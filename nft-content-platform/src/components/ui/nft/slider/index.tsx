import Link from "next/link";
import { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import NFTCard from "../card";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "@nextui-org/react";

export default function NFTSlider() {
  const [nftData, setNftData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNFTs = async () => {
    setIsLoading(true);
    try {
      const data = await fetch("http://localhost:3000/api/get-nfts");
      const nfts = await data.json();

      for (let i = 0; i < nfts.length; i++) {
        const nft = nfts[i];
        const ipfsUri = nft.tokenURI;
        const data = await fetch(ipfsUri);
        const json = await data.json();
        nfts[i].data = json;
      }

      setNftData(nfts);
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="py-12 bg-grey-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Latest Additions
            </h2>
            {isLoading && (
              <Loading color="primary" size="sm" className="ml-2" />
            )}
            <Link
              href="/browse-content"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View all
            </Link>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <div className="flex space-x-6 overflow-x-auto">
            {nftData.length > 0 &&
              nftData.map((nft: any) => (
                <NFTCard
                  key={BigNumber.from(nft.tokenID)._hex}
                  id={BigNumber.from(nft.tokenID)._hex}
                  name={nft.data.name}
                  author={nft.data.author}
                  imageUrl={nft.data.image}
                  price={nft.price}
                  owner={nft.owner}
                  allowed={nft.allowed}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
