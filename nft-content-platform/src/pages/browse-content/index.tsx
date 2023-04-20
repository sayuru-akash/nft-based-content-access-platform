import NFTCard from "@/components/ui/nft/card";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export default function BrowseContent() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, [domLoaded]);

  const { address, isConnected } = useAccount();
  const [nftData, setNftData] = useState([]);

  const fetchNFTs = async () => {
    if (!isConnected || !address) {
      return;
    }

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
    <>
      <Navbar />
      <div className="bg-purple-50">
        <div className="py-12 bg-grey-90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="block mb-9">
              <h1 className="text-3xl font-bold">
                <span className="text-red-500">M</span>
                <span className="text-orange-500">a</span>
                <span className="text-green-500">r</span>
                <span className="text-blue-500">k</span>
                <span className="text-indigo-500">e</span>
                <span className="text-purple-500">t</span>
                <span className="text-orange-500">p</span>
                <span className="text-red-500">l</span>
                <span className="text-pink-500">a</span>
                <span className="text-green-500">c</span>
                <span className="text-blue-500">e</span>
              </h1>
              <span className="text-sm font-medium text-gray-600">
                Browse Content
              </span>
            </div>
            {domLoaded && (
              <div className="flex justify-center">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 grid-cols-1">
                  {nftData.map((nft: any) => (
                    <NFTCard
                      key={nft.data.image}
                      name={nft.data.name}
                      description={nft.data.description}
                      author={nft.data.author}
                      imageUrl={nft.data.image}
                      fileUrl={nft.data.file_url}
                      price={nft.price}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}