import {
  ShieldCheckIcon,
  ArrowUpOnSquareStackIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import nftMarket from "../../../../../public/NftMarket.json";
import router from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Loading } from "@nextui-org/react";

interface NFTCardProps {
  id: string;
  name: string;
  imageUrl: string;
  author: string;
  price: number;
  owner: string;
  allowed: boolean;
}

export default function NFTCard({
  id,
  name,
  author,
  imageUrl,
  price,
  owner,
  allowed,
}: NFTCardProps) {
  const { address, isConnected } = useAccount();
  const [isBuying, setIsBuying] = useState(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const buyAccessNFT = async () => {
    setIsBuying(true);
    if (!isConnected) {
      console.log("Please connect your wallet");
      setIsBuying(false);
      return;
    }

    const contract = nftMarket;

    const config = await prepareWriteContract({
      address: "0x82E9A535DE8148505BD1F2E0642193737440b044",
      functionName: "buyNft",
      args: [id],
      overrides: {
        value: ethers.utils.parseEther(price.toString()),
        from: address,
      },
      abi: contract.abi,
    });

    try {
      const boughtNft = await writeContract(config);
      boughtNft.wait().then((receipt) => {
        const tx = receipt.transactionHash;
        console.log("tx", tx);
      });
      toast.success(
        "🦄 Content bought successfully! You will be redirected to your profile soon...",
        {
          position: "top-right",
          autoClose: 2800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      await sleep(5000);
      setIsBuying(false);
      router.push("/profile");
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsBuying(false);
    }
  };

  const handleAccessPath = () => {
    router.push(`/access/?id=${id}`);
  };

  return (
    <div className="flex-shrink-0 w-80 px-4 bg-white p-3 rounded-xl">
      <div className="relative">
        <img
          className="w-full h-48 rounded-lg object-cover"
          src={imageUrl}
          alt={name}
        />
        {owner === address && (
          <button
            onClick={handleAccessPath}
            className="absolute top-2 right-2 px-2 py-1 bg-white rounded-md shadow"
          >
            <ArrowUpOnSquareStackIcon className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-gray-900 text-lg font-medium">{name}</h3>
        <p className="mt-1 text-gray-500 text-sm">{`By ${author}`}</p>
        <div className="mt-2 flex items-center">
          <div className="text-gray-500 text-sm">{`${price} ETH`}</div>
          <div className="ml-2 flex-shrink-0">
            <img
              src="./imgs/ethereum-eth.svg"
              alt="Ethereum"
              className="h-5 w-5"
            />
          </div>
          {isBuying && <Loading color="primary" size="sm" className="ml-4" />}
          {!allowed && (
            <div className="ml-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Banned
              <ExclamationTriangleIcon
                className="ml-2 -mr-0.5 h-4 w-4"
                aria-hidden="true"
              />
            </div>
          )}
          {owner === address && allowed && (
            <div className="ml-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Owned
              <ShieldCheckIcon
                className="ml-2 -mr-0.5 h-4 w-4"
                aria-hidden="true"
              />
            </div>
          )}
          {owner !== address && allowed && (
            <button
              onClick={buyAccessNFT}
              className="ml-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Buy now
              <ShoppingCartIcon
                className="ml-2 -mr-0.5 h-4 w-4"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
