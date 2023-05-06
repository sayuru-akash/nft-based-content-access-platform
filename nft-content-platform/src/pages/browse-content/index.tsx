import NFTCard from "@/components/ui/nft/card";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

export default function BrowseContent() {
  const router = useRouter();
  const { search } = router.query;

  const { address, isConnected } = useAccount();
  const [nftData, setNftData] = useState([]);
  const [nftDataFiltered, setNftDataFiltered] = useState([]);

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
    if (!search) {
      setNftDataFiltered(nfts);
    } else {
      const filteredNfts = nftData.filter((nft: any) =>
        nft.data.name.toLowerCase().includes(search.toString().toLowerCase())
      );
      setNftDataFiltered(filteredNfts);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [address, isConnected, search]);

  return (
    <>
      <Navbar />
      <div className="bg-purple-50 min-h-[75vh]">
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
              <span className="text-sm font-medium text-black">
                Browse Content
              </span>
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
            <div className="bg-white mb-8 px-4 py-5 border-b border-gray-200 sm:px-6 rounded-2xl">
              <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
                <div className="ml-4 mt-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-700">
                    Search content by their title...
                  </h3>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="search"
                  value={search ? search : ""}
                  className="form-input pt-1 pb-1 text-blue-600 font-mono block w-full text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter search term in here to search"
                  onChange={(e) =>
                    router.push(`/browse-content?search=${e.target.value}`)
                  }
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 grid-cols-1">
                {nftDataFiltered.map((nft: any) => (
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
                {search && nftDataFiltered.length === 0 && (
                  <div className="flex justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                      No NFTs found for this search term
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
