import Link from "next/link";
import { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import NFTCard from "../card";

export default function NFTSlider() {
  const [nftData, setNftData] = useState([]);

  const fetchNFTs = async () => {
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
            <Link
              href="/browse-content"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="flex space-x-6 overflow-x-auto">
            {nftData.map((nft: any) => (
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
