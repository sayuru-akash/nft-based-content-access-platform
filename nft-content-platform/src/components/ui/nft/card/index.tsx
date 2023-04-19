import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

interface NFTCardProps {
  name: string;
  description: string;
  imageUrl: string;
  fileUrl: string;
  author: string;
  price: number;
}

export default function NFTCard({
  name,
  description,
  author,
  imageUrl,
  fileUrl,
  price,
}: NFTCardProps) {
  return (
    <div className="flex-shrink-0 w-80 px-4 bg-white p-3 rounded-xl">
      <div className="relative">
        <img
          className="w-full h-48 rounded-lg object-cover"
          src={imageUrl}
          alt={name}
        />
        <button className="absolute top-2 right-2 px-2 py-1 bg-white rounded-md shadow">
          <HeartIcon className="h-5 w-5 text-gray-400" />
        </button>
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
          <button className="ml-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Buy now
            <ShoppingCartIcon
              className="ml-2 -mr-0.5 h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
