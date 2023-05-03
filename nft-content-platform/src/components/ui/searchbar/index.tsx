export default function SearchBar() {
  return (
    <div className="relative bg-cover bg-center bg-gradient-to-b from-gray-900 to-purple-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span style={{ color: "#F59E0B" }}>F</span>
          <span style={{ color: "#84CC16" }}>i</span>
          <span style={{ color: "#10B981" }}>n</span>
          <span style={{ color: "#3B82F6" }}>d</span>
          <span style={{ color: "#6366F1" }}>-</span>
          <span style={{ color: "#8B5CF6" }}>Y</span>
          <span style={{ color: "#DB2777" }}>o</span>
          <span style={{ color: "#EF4444" }}>u</span>
          <span style={{ color: "#F59E0B" }}>r</span>
          <span style={{ color: "#84CC16" }}>-</span>
          <span style={{ color: "#10B981" }}>N</span>
          <span style={{ color: "#3B82F6" }}>F</span>
          <span style={{ color: "#6366F1" }}>T</span>
          <span style={{ color: "#8B5CF6" }}>s</span>
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl mb-6">
          Discover and be a collector of valuable non-fungible tokens (NFTs)
          that serves as access cards to authentic content with our easy-to-use
          platform.
        </p>
        <div className="container mx-auto">
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-full mr-6">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.5 15A6.5 6.5 0 1115 8.5a6.48 6.48 0 01-1.78 4.426l5.088 5.088a1 1 0 11-1.414 1.414l-5.088-5.088A6.467 6.467 0 018.5 15zM3 8.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  className="block w-full bg-white bg-opacity-50 py-3 pl-10 pr-4 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search for NFTs"
                  type="search"
                />
              </div>
            </div>
            <div>
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
