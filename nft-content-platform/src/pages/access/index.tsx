import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAccount } from "wagmi";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import nftMarket from "../../../public/NftMarket.json";
import FourOhFour from "../404";
import { ethers } from "ethers";
import { filetypeextension } from "magic-bytes.js";
import { Loading } from "@nextui-org/react";

export default function Access() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const [authorized, isAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [nftData, setNftData] = useState({
    data: {
      name: "",
      description: "",
      image: "",
      author: "",
      author_address: "",
      file_url: "",
    },
    owner: "",
    price: 0.0,
    isListed: false,
  });

  const [listingPrice, setListingPrice] = useState(0.01);

  const [isListingOpen, setIsListingOpen] = useState(false);
  const openListingPriceModal = () => {
    setIsListingOpen(true);
  };
  const closeListingPriceModal = () => {
    setIsListingOpen(false);
  };

  const fetchNFT = async () => {
    setIsLoading(true);
    if (!isConnected || !address || !id) {
      setIsLoading(false);
      return;
    }

    const data = await fetch(`/api/get-nft?id=${id}`);

    if (data.status === 401) {
      isAuthorized(false);
      setMessage(
        "Sorry, this content has been banned from the platform due to a violation of our terms of service. Please contact us if you believe this is a mistake."
      );
      setIsLoading(false);
      return;
    } else if (data.status === 404) {
      isAuthorized(false);
      setMessage(
        "Sorry, we could not find the NFT you are looking for. Please check the ID and try again."
      );
      setIsLoading(false);
      return;
    } else if (data.status === 500) {
      isAuthorized(false);
      setMessage(
        "Sorry, we could not fetch the NFT you are looking at the moment. Please try again later. "
      );
      setIsLoading(false);
      return;
    }

    const nft = await data.json();
    if (nft) {
      if (nft.owner !== address) {
        isAuthorized(false);
        setMessage(
          "Sorry, you are not the owner of this content. Please try again with the correct wallet."
        );
        setIsLoading(false);
        return;
      }
      isAuthorized(true);
      setMessage("");
    }

    const ipfsUri = nft.tokenURI;
    const ipfsData = await fetch(ipfsUri);
    const ipfsJson = await ipfsData.json();
    nft.data = ipfsJson;

    setNftData(nft);
    setListingPrice(nft.price);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNFT();
  }, [address, id, isConnected, isAuthorized, message]);

  const listAccessNFT = async (listingPrice: number) => {
    setIsLoading(true);
    if (!isConnected) {
      console.log("Wallet not connected.");
      setIsLoading(false);
      return;
    }

    const contract = nftMarket;

    const config = await prepareWriteContract({
      address: process.env
      .NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS as "0x${string}",
      functionName: "placeNftOnSale",
      args: [id, ethers.utils.parseEther(listingPrice.toString())],
      overrides: {
        value: ethers.utils.parseEther("0.025"),
        from: address,
      },
      abi: contract.abi,
    });

    try {
      const listedNft = await writeContract(config);
      listedNft.wait().then((receipt) => {
        const tx = receipt.transactionHash;
        console.log("tx", tx);
      });
      if (listedNft) {
        toast.success("NFT listed successfully!");
        fetchNFT();
      } else {
        toast.error("NFT listing failed.");
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error("NFT listing failed.");
    }
    setIsLoading(false);
  };

  const accessContent = async () => {
    setIsLoading(true);
    if (!isConnected) {
      console.log("Wallet not connected.");
      setIsLoading(false);
      return;
    }

    const authorize = await fetch(
      `/api/get-nft-content?id=${id}&address=${address}`
    );
    const authorized = await authorize.json();
    if (authorized.tokenID) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/content/${id}`
      );
      const data = await response.json();
      if (data) {
        const tokenURI = authorized.tokenURI;
        const tokenData = await fetch(tokenURI);
        const fileURl = await tokenData.json().then((data) => {
          return data.file_url;
        });
        const secret = data.content.encKey;

        try {
          const encryptedFile = await fetch(fileURl);
          const encryptedFileData = await encryptedFile.json();

          const decryptedFile = await CryptoJS.AES.decrypt(
            encryptedFileData.data,
            secret
          );
          const decryptedFileData = decryptedFile.toString(CryptoJS.enc.Utf8);

          const decryptedFileUint8Array = new Uint8Array(
            decryptedFileData.split(",").map(Number)
          );

          const fileType = await filetypeextension(
            decryptedFileUint8Array as any
          );

          const blob = new Blob([decryptedFileUint8Array], {
            type: fileType[0],
          });

          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");

          const link = document.createElement("a");
          link.href = url;
          link.download = `content.${fileType[0]}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error decrypting file:", error);
          toast.error("Error occured when decrypting file.");
        }
      } else {
        console.log("No data found for this NF access Token");
        toast.error("No data found for this NF access Token.");
      }
    } else {
      console.log("Banned content or not authorized to access this content");
      toast.error("Banned content or not authorized to access this content.");
    }
    setIsLoading(false);
  };

  return (
    <>
      {id && <Navbar />}
      {id && (
        <div className="bg-purple-50 min-h-[75vh]">
          <div className="py-12 bg-grey-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ToastContainer />
              <div className="block mb-9">
                <div className="flex">
                  <h1 className="text-3xl font-bold">
                    <span className="text-red-500">A</span>
                    <span className="text-orange-500">c</span>
                    <span className="text-green-500">c</span>
                    <span className="text-blue-500">e</span>
                    <span className="text-indigo-500">s</span>
                    <span className="text-purple-500">s</span>
                    <span className="text-orange-500"> </span>
                    <span className="text-orange-500">C</span>
                    <span className="text-red-500">o</span>
                    <span className="text-pink-500">n</span>
                    <span className="text-green-500">t</span>
                    <span className="text-blue-500">e</span>
                    <span className="text-indigo-500">n</span>
                    <span className="text-purple-500">t</span>
                  </h1>
                  {isLoading && (
                    <Loading color="primary" size="md" className="ml-2" />
                  )}
                </div>
                <span className="text-sm font-medium text-black">
                  Access your exclusive content here by checking in with your
                  wallet to verify your ownership.
                </span>
              </div>
              {!authorized && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {message}
                    </h3>
                  </div>
                </div>
              )}

              {authorized && (
                <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                  {message && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
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

                  <div className="mt-10 sm:flex">
                    <div className="sm:w-1/2 sm:pr-10 flex items-center justify-center">
                      <div className="relative w-96 h-96 bg-white rounded-xl">
                        {nftData.data.image && (
                          <Image
                            src={nftData.data.image}
                            alt={nftData.data.name}
                            fill
                            sizes="500px"
                          />
                        )}
                      </div>
                    </div>
                    <div className="sm:w-1/2 flex flex-col justify-between mt-10 md:mt-0">
                      <div>
                        <h3 className="text-2xl font-bold leading-6 text-gray-900">
                          {nftData.data.name}
                        </h3>
                        <span className="text-sm text-gray-500 font-thin">
                          @{nftData.data.author}
                        </span>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <p className="text-xs text-gray-500">
                              Verify creator at {nftData.data.author_address}
                            </p>
                            <CheckBadgeIcon
                              className="ml-1 flex-shrink-0 h-4 w-4 text-blue-400"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                        <div className="flex items-center mt-4">
                          <p className="text-base text-black">Description:</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {nftData.data.description}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-center justify-between mt-4">
                        <div className="flex items-center pb-10">
                          {nftData.isListed === true && (
                            <h3 className="text-sm font-thin text-gray-400 mr-2">
                              Listed for sale @
                            </h3>
                          )}

                          {nftData.isListed === false && (
                            <h3 className="text-sm font-thin text-gray-400 mr-2">
                              Last traded @
                            </h3>
                          )}
                          <span className="text-lg font-medium text-gray-900">
                            {nftData.price} ETH
                          </span>
                          <div className="ml-2">
                            <img
                              src="./imgs/ethereum-eth.svg"
                              alt="Ethereum"
                              className="h-5 w-5"
                            />
                          </div>
                        </div>
                        <div className="block md:flex items-center justify-between w-full">
                          {nftData.isListed === true && (
                            <div className="w-full md:w-auto block mb-2 md:flex-shrink-0 md:inline-flex items-center text-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2">
                              Listed on Marketplace
                            </div>
                          )}
                          {nftData.isListed === false && (
                            <button
                              onClick={openListingPriceModal}
                              className="w-full md:w-auto block mb-2 md:flex-shrink-0 md:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                            >
                              List on Marketplace
                            </button>
                          )}
                          <button
                            onClick={accessContent}
                            className="w-full md:w-auto block mb-2 md:flex-shrink-0 md:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
                          >
                            Access Exclusive Content
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isListingOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Enter price
                </h3>
                <div className="flex items-center text-blue-800 mr-4 mt-4">
                  <img
                    src="/imgs/ethereum-eth.svg"
                    alt="Ethereum Logo"
                    className="w-6 h-6 mr-2"
                  />
                  ETH
                  <input
                    name="listingPrice"
                    id="listingPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={listingPrice}
                    onChange={(e) =>
                      setListingPrice(parseFloat(e.target.value))
                    }
                    className="ml-4 text-black p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    listAccessNFT(listingPrice);
                    closeListingPriceModal();
                  }}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  List
                </button>
                <button
                  onClick={closeListingPriceModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!id && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Accessing this page is restricted without a valid NFT ID. Please
                try again with a valid NFT ID or contact the site administrator.
              </p>
            </div>
          </div>
        </div>
      )}
      {id && <Footer />}
      {!id && <FourOhFour />}
    </>
  );
}
