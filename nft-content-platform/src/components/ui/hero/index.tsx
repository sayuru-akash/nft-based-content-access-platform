export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Publish your content with</span>
            <span className="block text-indigo-600">
              Blockchain-Driven NFTs
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-gray-500 lg:mx-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            magnam voluptatum cupiditate veritatis in, accusamus quisquam.
          </p>
          <div className="mt-10 sm:flex sm:justify-center lg:justify-start lg:w-2/3">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Publish Content
              </a>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
        <div
          className="mt-10 lg:mt-0 lg:w-1/3 bg-fixed bg-contain overflow-auto visible lg:invisible"
          style={{
            backgroundImage: "url(./imgs/hero-cover.webp)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom",
          }}
        >
          <img
            className="h-56 w-full object-cover md:h-96 invisible lg:visible"
            src="./imgs/hero-cover.webp"
            alt="hero-cover-image"
          />
        </div>
      </div>
    </div>
  );
}
