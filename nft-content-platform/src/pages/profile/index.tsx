import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import NFTCard from "@/components/ui/nft/card";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAccount } from "wagmi";

export default function Profile() {
  const [domLoaded, setDomLoaded] = useState(false);
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [username, setUsername] = useState("");

  const openListingModal = () => {
    setIsListingOpen(true);
  };
  const closeListingModal = () => {
    setIsListingOpen(false);
  };

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

    const data2 = await fetch(`http://localhost:3010/user/${address}`);
    const json2 = await data2.json();
    setUsername(json2.data.name);

    setNftData(nfts);
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchNFTs();
  }, [address]);

  const updateUsername = async () => {
    if (!username) {
      toast.error("Please enter a valid username!");
      fetchNFTs();
      return;
    }

    const res = await fetch("http://localhost:3010/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet: address,
        name: username,
      }),
    });
    const json = await res.json();
    console.log(json);
    if (res && res.status === 200) {
      toast.success(json.message);
    } else {
      toast.error("Error updating username!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-purple-50 min-h-[75vh]">
        <div className="py-12 bg-grey-90">
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-9 flex flex-col md:flex-row items-center md:items-start justify-between">
              <div>
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
              <div className="flex flex-col items-center pt-2 md:pt-0 pl-0 md:pl-4 lg:pl-80">
                <span className="text-sm font-bold text-black font-mono">
                  Your Name:
                </span>
                {domLoaded && isConnected && (
                  <p className="text-2xl font-bold text-black font-mono">
                    {username === "anonymous" ||
                      (username === "" && (
                        <span className="text-sm font-bold text-black font-mono">
                          (Set your name to be listed here!)
                        </span>
                      ))}
                    {username !== "anonymous" && username !== "" && (
                      <span className="text-sm font-bold text-black font-mono">
                        {username}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={openListingModal}
                className="mt-4 md:mt-0 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Name
              </button>
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
                    Enter Your Name
                  </h3>
                  <div className="flex items-center text-blue-800 mr-4 mt-4">
                    <input
                      name="username"
                      id="username"
                      type="text"
                      defaultValue={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="text-black p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => {
                      updateUsername();
                      closeListingModal();
                    }}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update Name
                  </button>
                  <button
                    onClick={() => {
                      closeListingModal();
                    }}
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
      </div>
      <Footer />
    </>
  );
}
