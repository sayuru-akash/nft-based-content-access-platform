import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import NFTCard from "@/components/ui/nft/card";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Profile() {
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

    const data = await fetch(
      `http://localhost:3000/api/get-user-nfts?address=${address}`
    );
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
  }, [address]);

  return (
    <>
      <Navbar />
      <div className="bg-purple-50">
        <div className="py-12 bg-grey-90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="block mb-9">
              <h1 className="text-3xl font-bold">
                <span className="text-red-500">P</span>
                <span className="text-orange-500">r</span>
                <span className="text-green-500">o</span>
                <span className="text-blue-500">f</span>
                <span className="text-indigo-500">i</span>
                <span className="text-purple-500">l</span>
                <span className="text-orange-500">e</span>
              </h1>

              <span className="text-sm font-bold text-black">
                Explore the NF Access Tokens you created or purchased.
              </span>
            </div>
            {domLoaded && (
              <div className="flex justify-center">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 grid-cols-1">
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
