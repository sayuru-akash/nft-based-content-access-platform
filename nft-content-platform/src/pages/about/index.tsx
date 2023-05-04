import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="bg-purple-50 min-h-[75vh]">
        <div className="py-12 bg-grey-90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="block mb-9">
              <h1 className="text-3xl font-bold pb-4">
                <span className="text-red-500">A</span>
                <span className="text-orange-500">b</span>
                <span className="text-green-500">o</span>
                <span className="text-blue-500">u</span>
                <span className="text-indigo-500">t</span>
                <span className="text-purple-500"> </span>
                <span className="text-orange-500">U</span>
                <span className="text-orange-500">s</span>
              </h1>
              <p className="text-base text-gray-700 md:text-lg">
                De-content is a team of passionate web3 developers who are
                building a Non-Fungible Token based content access platform. Our
                platform allows content creators to monetize their content and
                allows consumers to access content in a decentralized manner. We
                are committed to creating a new web3 ecosystem where content
                creators have the freedom to create and consumers have the power
                to access and consume the content they want.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold pb-4 text-gray-800">Our Team</h2>
            <p className="text-base text-gray-700 md:text-lg">
              Our team is made up of passionate developers with a shared vision
              for the future of web3. We come from different backgrounds but are
              united by a common goal: to create a more equitable and
              decentralized web. Meet our team members below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <Image
                      className="h-48 w-full object-cover md:w-48"
                      src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="user-1"
                      height={200}
                      width={200}
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                      Sayuru Akash
                    </div>
                    <p className="mt-2 text-gray-600">
                      Sayuru Akash is a passionate web3 developer who is
                      building a Non-Fungible Token based content access
                      platform. He is a full-stack developer with experience in
                      building web3 applications. He is also a blockchain
                      enthusiast and has been involved in the blockchain space
                      since 2017.
                    </p>
                  </div>
                </div>
              </div>
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <Image
                      className="h-48 w-full object-cover md:w-48"
                      src="https://images.unsplash.com/photo-1544168190-79c17527004f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
                      alt="user-2"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                      Sayuru Akash
                    </div>
                    <p className="mt-2 text-gray-600">
                      Sayuru Akash is a passionate web3 developer who is
                      building a Non-Fungible Token based content access
                      platform. He is a full-stack developer with experience in
                      building web3 applications. He is also a blockchain
                      enthusiast and has been involved in the blockchain space
                      since 2017.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-12 bg-grey-90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="block mb-9">
              <h1 className="text-3xl font-bold pb-4">
                <span className="text-red-500">F</span>
                <span className="text-orange-500">e</span>
                <span className="text-green-500">e</span>
                <span className="text-blue-500">d</span>
                <span className="text-indigo-500">b</span>
                <span className="text-purple-500">a</span>
                <span className="text-red-500">c</span>
                <span className="text-orange-500">k</span>
              </h1>
              <span className="text-sm font-medium text-black">
                De-content has received a lot of positive feedback from the
                community. Here are some of the comments we have received:
              </span>
              <div className="flex flex-wrap -mx-4 overflow-hidden sm:-mx-4 md:-mx-4 lg:-mx-4 xl:-mx-4">
                <div className="my-4 px-4 w-full overflow-hidden sm:my-4 sm:px-4 sm:w-1/2 md:my-4 md:px-4 md:w-1/2 lg:my-4 lg:px-4 lg:w-1/2 xl:my-4 xl:px-4 xl:w-1/2">
                  <div className="bg-white shadow-lg rounded-lg px-4 py-6">
                    <div className="flex justify-center md:justify-end -mt-16">
                      <Image
                        className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
                        src={
                          "https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
                        }
                        alt="about-1"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div>
                      <h2 className="text-gray-800 text-3xl font-semibold">
                        Mary Jane
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quae dolores deserunt ea doloremque natus error
                        repudiandae incidunt accusantium laborum eos officiis
                        corrupti expedita voluptate cupiditate explicabo,
                        mollitia, nostrum, dicta saepe. Lorem ipsum dolor sit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="my-4 px-4 w-full overflow-hidden sm:my-4 sm:px-4 sm:w-1/2 md:my-4 md:px-4 md:w-1/2 lg:my-4 lg:px-4 lg:w-1/2 xl:my-4 xl:px-4 xl:w-1/2">
                  <div className="bg-white shadow-lg rounded-lg px-4 py-6">
                    <div className="flex justify-center md:justify-end -mt-16">
                      <Image
                        className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
                        src="https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
                        alt="about-2"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div>
                      <h2 className="text-gray-800 text-3xl font-semibold">
                        Jane Doe
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quae labore necessitatibus nostrum, veritatis similique
                        unde obcaecati quisquam, voluptate doloremque
                        voluptatibus fugit, quas assumenda. Quisquam, quod
                        molestiae. Quae, voluptates doloribus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
