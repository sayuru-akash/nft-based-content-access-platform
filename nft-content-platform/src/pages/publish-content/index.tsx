import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import {
  MinusIcon,
  PhotoIcon,
  PlusIcon,
  DocumentPlusIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import Image from "next/image";
import CryptoJS from "crypto-js";
import { useAccount } from "wagmi";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import nftMarket from "../../../public/NftMarket.json";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { Card, Text } from "@nextui-org/react";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
const infuraSecret = process.env.NEXT_PUBLIC_INFURA_SECRET;
const auth =
  "Basic " + Buffer.from(infuraId + ":" + infuraSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function PublishContent() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const [fileUrl, updateFileUrl] = useState("");
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setConnected(true);
    }
  }, [isConnected]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.01);
  const [thumbnailUrl, updateThumbnailUrl] = useState("");
  const [mintedNFTAddress, setMintedNFTAddress] = useState("");
  const [vUID, setVUID] = useState("");

  const [message, setMessage] = useState("");

  const mintAccessNFT = async () => {
    if (!isConnected) {
      setMessage("Please connect your wallet to mint an NFT.");
      return;
    }
    if (
      title == "" ||
      author == "" ||
      description == "" ||
      price == 0 ||
      thumbnailUrl == "" ||
      fileUrl == ""
    ) {
      setMessage("Please fill out all fields before minting.");
      return;
    }
    setMessage("Minting NFT...");
    const contract = nftMarket;

    const nftMetadataFile = JSON.stringify({
      name: title,
      description: description,
      image: thumbnailUrl,
      author: author,
      author_address: address,
      file_url: fileUrl,
    });

    const fileAdded = await client.add(nftMetadataFile);
    const url = `https://ipfs.io/ipfs/${fileAdded.path}`;

    console.log("Metadata IPFS URI: ", url);

    const config = await prepareWriteContract({
      address: "0x82E9A535DE8148505BD1F2E0642193737440b044",
      functionName: "mintToken",
      args: [url, ethers.utils.parseEther(price.toString())],
      overrides: {
        value: ethers.utils.parseEther("0.025"),
      },
      abi: contract.abi,
    });

    let tx;
    try {
      const mintedNFT = await writeContract(config);
      mintedNFT.wait().then(async (receipt) => {
        {
          tx = receipt.transactionHash;
          console.log("tx", tx);
          setMintedNFTAddress(tx);
        }

        const allOwnedNfts = await fetch(
          `http://localhost:3000/api/get-user-nfts?address=${address}`
        );
        const nfts = await allOwnedNfts.json();
        const tokenId = nfts[nfts.length - 1].tokenID.hex.toString();

        const userID = await fetch("http://localhost:3010/user/add/" + address)
          .then((response) => response.json())
          .then((data) => data)
          .catch((error) => console.error(error));

        const contentID = await fetch("http://localhost:3010/content/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: thumbnailUrl,
            tokenId: tokenId,
            title: title,
            authorId: userID.data.id,
            encKey: vUID,
          }),
        });

        const contentIDData = await contentID.json();
        if (contentIDData && contentIDData.newContentId) {
          console.log("Content ID: ", contentIDData.newContentId);
        } else {
          console.log("Error: ", contentIDData.message);
          setMessage(
            "Error occurred while adding content to database. You may not be able to decrypt the encrypted content later. Please contact support. 🙏"
          );
        }
      });
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (mintedNFTAddress) {
      setMessage("NFT Minted Successfully at " + mintedNFTAddress + " 🎉 ");
    }
  }, [mintedNFTAddress]);

  const handleIncrement = () => {
    const newPrice = parseFloat((price + 0.01).toFixed(2));
    if (newPrice > 0) {
      setPrice(newPrice);
    }
  };

  const handleDecrement = () => {
    const newPrice = parseFloat((price - 0.01).toFixed(2));
    if (newPrice > 0) {
      setPrice(newPrice);
    }
  };

  async function onThumbnailChange(e: any) {
    const file = e.target.files[0];
    try {
      if (!file) return;

      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        setMessage("Please select a valid image to upload.");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setMessage("Please select an image smaller than 4MB.");
        return;
      }

      const fileAdded = await client.add(file);
      const url = `https://ipfs.io/ipfs/${fileAdded.path}`;

      console.log("Thumbnail IPFS URI: ", url);
      updateThumbnailUrl(url);

      const veryUniqueID = uuidv4();
      setVUID(veryUniqueID);
    } catch (error) {
      setMessage("Error uploading thumbnail");
      console.log("Error uploading thumbnail: ", error);
    }
  }

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    try {
      if (!file) return;

      if (file.size > 100 * 1024 * 1024) {
        setMessage("Please select an image smaller than 4MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = new Uint8Array(reader.result as ArrayBuffer);

        const ciphertext = await CryptoJS.AES.encrypt(
          fileData.toString(),
          vUID
        );
        const encrypted = ciphertext.toString();

        const encryptedJson = JSON.stringify({ data: encrypted });
        console.log(encryptedJson);

        const fileAdded = await client.add(encryptedJson);
        const url = `https://ipfs.io/ipfs/${fileAdded.path}`;
        console.log("Content IPFS URI: ", url);

        updateFileUrl(url);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage("Error uploading file");
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-purple-50  mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 min-h-[75vh]">
        <div className="max-w-7xl mx-auto pb-4">
          <div className="text-start">
            {message && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 13a1 1 0 01-.707-1.707l7-7a1 1 0 011.414 0l7 7A1 1 0 0119 13H5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="block mb-9">
              <h1 className="text-3xl font-bold">
                <span className="text-red-500">P</span>
                <span className="text-orange-500">u</span>
                <span className="text-green-500">b</span>
                <span className="text-blue-500">l</span>
                <span className="text-indigo-500">i</span>
                <span className="text-purple-500">s</span>
                <span className="text-red-500">h</span>
                <span className="text-orange-500"> </span>
                <span className="text-orange-500">C</span>
                <span className="text-red-500">o</span>
                <span className="text-pink-500">n</span>
                <span className="text-green-500">t</span>
                <span className="text-blue-500">e</span>
                <span className="text-indigo-500">n</span>
                <span className="text-purple-500">t</span>
              </h1>
              <span className="text-sm font-medium text-black">
                This information will be submitted for saving your content on
                IPFS and minting access tokens on blockchain so make sure the
                details are correct.
              </span>
            </div>
          </div>
          {!connected && (
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <Card isHoverable variant="bordered">
                  <Card.Body>
                    <Text>
                      Please connect your wallet to publish your content!
                    </Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
          {connected && (
            <form>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  {domLoaded && (
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="wallet_address"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Wallet Address
                        </label>
                        <div className="mt-2">
                          <div className="block bg-white flex-1 rounded-md shadow-sm ring-1 py-1.5 pl-1 ring-inset ring-gray-300 sm:max-w-md">
                            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                              {address && connected ? (
                                <span className="text-green-900 font-thin">
                                  {address}
                                </span>
                              ) : (
                                <span className="text-red-500">
                                  Not Connected
                                </span>
                              )}
                            </span>
                            <input
                              type="text"
                              name="wallet_address"
                              id="wallet_address"
                              style={{ display: "none" }}
                              defaultValue={
                                address && connected ? address : ""
                              }
                            />
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          Double check you are connected to the correct wallet
                          address.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Title
                      </label>
                      <div className="mt-2">
                        <div className="flex bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="title"
                            className="block flex-1 ml-2 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter Content Title"
                            onChange={(e) => {
                              setTitle(e.target.value);
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="author"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Author
                      </label>
                      <div className="mt-2">
                        <div className="flex bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            type="text"
                            name="author"
                            id="author"
                            autoComplete="author"
                            className="block flex-1 ml-2 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter Author Name"
                            onChange={(e) => {
                              setAuthor(e.target.value);
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="block pl-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                          placeholder="Enter Content Description"
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        List Price
                      </label>
                      <div className="flex items-center justify-left mb-4 mt-4">
                        <div className="flex items-center text-blue-800 mr-4">
                          <img
                            src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg"
                            alt="Ethereum Logo"
                            className="w-6 h-6 mr-2"
                          />

                          <span className="text-lg font-semibold">ETH</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="bg-gray-200 rounded-full p-2"
                            onClick={handleDecrement}
                          >
                            <MinusIcon className="h-5 w-5 text-gray-600" />
                          </button>
                          <input
                            type="text"
                            name="price"
                            id="price"
                            min="0.01"
                            step="0.01"
                            className="text-gray-900 w-16 h-8 text-lg text-center border-gray-400 border rounded-md mx-2 appearance-none"
                            value={price.toFixed(2)}
                            onChange={(e) =>
                              setPrice(parseFloat(e.target.value))
                            }
                            required
                          />
                          <button
                            type="button"
                            className="bg-gray-200 rounded-full p-2"
                            onClick={handleIncrement}
                          >
                            <PlusIcon className="h-5 w-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="thumbnail-file"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Upload Thumbnail
                      </label>
                      <div className="mt-2 bg-white flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          {thumbnailUrl !== "" && (
                            <Image
                              src={thumbnailUrl}
                              alt="Uploaded Thumbnail"
                              width={200}
                              height={200}
                            />
                          )}
                          {thumbnailUrl === "" && (
                            <PhotoIcon
                              className="mx-auto h-12 w-12 text-gray-300"
                              aria-hidden="true"
                            />
                          )}
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="thumbnail"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload an image</span>
                              <input
                                id="thumbnail"
                                name="thumbnail"
                                type="file"
                                className="sr-only"
                                onChange={onThumbnailChange}
                                required
                              />
                              <input
                                type="text"
                                name="thumbnail_url"
                                id="thumbnail_url"
                                style={{ display: "none" }}
                                defaultValue={thumbnailUrl && thumbnailUrl}
                                required
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG up to 4MB
                          </p>
                        </div>
                      </div>
                    </div>
                    {thumbnailUrl && vUID && (
                      <div className="col-span-full">
                        <label
                          htmlFor="file-upload"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Upload Content
                        </label>
                        <div className="mt-2 bg-white flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          <div className="text-center">
                            {fileUrl !== "" && (
                              <DocumentCheckIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                            )}
                            {fileUrl === "" && (
                              <DocumentPlusIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                            )}
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={onFileChange}
                                  required
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">
                              Up to 100MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900 border-b-stone-900 border rounded-md px-2 py-1 shadow-sm bg-white hover:bg-gray-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={mintAccessNFT}
                  className="rounded-md bg-indigo-600 px-24 py-2 text-sm font-semibold text-whit shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Mint Content
                </button>
              </div>
            </form>
          )}
          <div className="border-t border-gray-200 my-8"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}
