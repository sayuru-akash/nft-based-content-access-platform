import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface CreatorCardProps {
  name: string;
  imageSrc: string;
  nftCount: number;
}

export default function CreatorCard({
  name,
  imageSrc,
  nftCount,
}: CreatorCardProps) {
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-lg shadow-lg w-40">
        <img
          src={imageSrc}
          alt={name}
          className="object-cover w-full h-40 transition duration-300 ease-in-out transform hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {nftCount} NFTs{" "}
          <ChevronRightIcon className="inline-block w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-500" />
        </p>
      </div>
    </div>
  );
}
