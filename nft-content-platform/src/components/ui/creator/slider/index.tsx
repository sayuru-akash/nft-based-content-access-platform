import CreatorCard from "../card";

export default function CreatorSlider() {
  const creators = [
    {
      id: 1,
      name: "John Doe",
      imageSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      nftCount: 15,
    },
    {
      id: 2,
      name: "Jane Doe",
      imageSrc: "https://randomuser.me/api/portraits/women/32.jpg",
      nftCount: 10,
    },
    {
      id: 3,
      name: "David Smith",
      imageSrc: "https://randomuser.me/api/portraits/men/34.jpg",
      nftCount: 12,
    },
    {
      id: 4,
      name: "Emily Johnson",
      imageSrc: "https://randomuser.me/api/portraits/women/34.jpg",
      nftCount: 8,
    },
    {
      id: 5,
      name: "Michael Lee",
      imageSrc: "https://randomuser.me/api/portraits/men/36.jpg",
      nftCount: 20,
    },
    {
      id: 6,
      name: "Mark Johnson",
      imageSrc: "https://randomuser.me/api/portraits/men/40.jpg",
      nftCount: 13,
    },
    {
      id: 7,
      name: "Emily Davis",
      imageSrc: "https://randomuser.me/api/portraits/women/40.jpg",
      nftCount: 11,
    },
    {
      id: 8,
      name: "Sarah Lee",
      imageSrc: "https://randomuser.me/api/portraits/women/60.jpg",
      nftCount: 6,
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Explore Creators
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Discover top 10 creators in the space
          </p>
        </div>
        <div className="mt-10">
          <div className="flex overflow-x-auto -mx-4">
            {creators.map((creator) => (
              <div key={creator.id} className="-mx-1 px-4">
                <CreatorCard {...creator} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
