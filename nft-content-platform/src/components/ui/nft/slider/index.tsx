import NFTCard from "../card";

export default function NFTSlider() {
  const nftData = [
    {
      imageUrl: "https://dummyimage.com/400x400/000/fff",
      name: "NFT 1",
      creator: "Creator 1",
      price: 0.05,
    },
    {
      imageUrl: "https://dummyimage.com/400x400/000/fff",
      name: "NFT 2",
      creator: "Creator 2",
      price: 0.1,
    },
    {
      imageUrl: "https://dummyimage.com/400x400/000/fff",
      name: "NFT 3",
      creator: "Creator 3",
      price: 0.2,
    },
    {
      imageUrl: "https://dummyimage.com/400x400/000/fff",
      name: "NFT 4",
      creator: "Creator 4",
      price: 0.3,
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="py-12 bg-grey-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Latest Additions
            </h2>
            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View all
            </button>
          </div>
          <div className="flex space-x-6 overflow-x-auto">
            {nftData.map((nft) => (
              <NFTCard
                key={nft.name}
                imageUrl={nft.imageUrl}
                name={nft.name}
                creator={nft.creator}
                price={nft.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
