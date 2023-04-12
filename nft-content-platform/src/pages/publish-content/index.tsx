import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { MinusIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/solid";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import CryptoJS from "crypto-js";

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
  const [price, setPrice] = useState(0.01);
  const [fileUrl, updateFileUrl] = useState("");

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

  const encryptBinary = async (binary: string, walletAddress: string) => {
    const key = CryptoJS.enc.Hex.parse(walletAddress);
    const iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
    const encrypted = CryptoJS.AES.encrypt(binary, key, {
      iv,
    });
    return await Promise.resolve(
      encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    );
  };

  const decryptBinary = async (data: string, walletAddress: string) => {
    const key = CryptoJS.enc.Hex.parse(walletAddress);
    const iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv,
    });
    return await Promise.resolve(decrypted.toString(CryptoJS.enc.Utf16));
  };

  const fileToBinary = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const binary = new Uint8Array(arrayBuffer as ArrayBuffer);
        resolve(binary);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  async function onFileChange(e: any) {
    const file = e.target.files[0];
    try {
      if (!file) return;

      const binary: Uint8Array = (await fileToBinary(file)) as Uint8Array;
      console.log("Binary: ", binary);
      const encrypted = await encryptBinary(
        binary.toString(),
        "0x0000000000000000000000000"
      );
      console.log("Binary: ", binary.toString());
      const encryptedJson = JSON.stringify({ data: encrypted });
      console.log(encryptedJson);
      const fileAdded = await client.add(encryptedJson);
      const url = `https://ipfs.io/ipfs/${fileAdded.path}`;
      console.log("IPFS URI: ", url);

      const uploadedFile = await axios.get(url);
      const data = uploadedFile.data;
      console.log("Uploaded File: ", uploadedFile.data);

      const decryptedFile = await decryptBinary(
        data.data as string,
        "0x0000000000000000000000000"
      );
      console.log("Decrypted File: ", decryptedFile);
      const blob = new Blob([binary], { type: "image/png" });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      updateFileUrl(imageUrl);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <>
      <Navbar />

      <div className="bg-white  mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <form>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Publish Content on IPFS and Mint Access NFTs
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be submitted for saving your content on
                IPFS and minting access tokens on blockchain so make sure the
                details are correct.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Wallet Address
                  </label>
                  <div className="mt-2">
                    <div className="block flex-1 rounded-md shadow-sm ring-1 py-1.5 pl-1 ring-inset ring-gray-300 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                        0x0000000000000000000000000
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Double check you are connected to the correct wallet
                    address.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="title"
                        className="block flex-1 ml-2 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="New Awesome Content"
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
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="author"
                        id="author"
                        autoComplete="author"
                        className="block flex-1 ml-2 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="New Awesome Author"
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
                      className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="content-file"
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
                        min="0.01"
                        step="0.01"
                        className="text-gray-900 w-16 h-8 text-lg text-center border-gray-400 border rounded-md mx-2 appearance-none"
                        value={price.toFixed(2)}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
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
                    htmlFor="content-file"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Upload Content
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      {fileUrl !== "" && (
                        <img
                          src={fileUrl}
                          alt="Uploaded File"
                          width={200}
                          height={200}
                        ></img>
                      )}
                      {fileUrl === "" && (
                        <PhotoIcon
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
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 100MB
                      </p>
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
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      {fileUrl !== "" && (
                        <Image
                          src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                          alt="Uploaded Thumbnail"
                          width={200}
                          height={200}
                        />
                      )}
                      {fileUrl === "" && (
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="img-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="img-upload"
                            name="img-upload"
                            type="file"
                            className="sr-only"
                            // onChange={}
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
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900 border-b-stone-900 border rounded-md px-2 py-1 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-24 py-2 text-sm font-semibold text-whit shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Mint Content
            </button>
          </div>
        </form>
        <div className="border-t border-gray-200 my-8"></div>
      </div>
      <Footer />
    </>
  );
}
