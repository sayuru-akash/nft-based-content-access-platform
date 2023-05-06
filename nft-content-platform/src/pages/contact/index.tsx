import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { EnvelopeIcon, MapIcon, PhoneIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Loading } from "@nextui-org/react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForm() {
    setLoading(true);
    if (
      !name ||
      !email ||
      !message ||
      name === "" ||
      email === "" ||
      message === ""
    ) {
      toast.error("Please fill out all fields.");
      setLoading(false);
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL+"/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      }),
    });
    if (res.status === 200) {
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } else if (res.status === 400) {
      const { message } = await res.json();
      toast.error(message);
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="bg-purple-50 min-h-[75vh]">
        <div className="pt-12 pb-5 bg-grey-90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="block mb-9">
              <h1 className="text-3xl font-bold pb-4">
                <span className="text-red-500">C</span>
                <span className="text-orange-500">o</span>
                <span className="text-green-500">n</span>
                <span className="text-blue-500">t</span>
                <span className="text-indigo-500">a</span>
                <span className="text-purple-500">c</span>
                <span className="text-orange-500">t</span>
                <span className="text-red-500"> </span>
                <span className="text-orange-500">U</span>
                <span className="text-green-500">s</span>
              </h1>
              <p className="text-base text-gray-700 md:text-lg">
                Getting in touch with us is easy. Just send us an email or
                connect with us on social media. Also, feel free to send us a
                message using the form below. We look forward to hearing from
                you! 🚀
              </p>
            </div>
            <ToastContainer />
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold pb-4 text-gray-800">
              Send a Message
              {loading && (
                <Loading
                  color="primary"
                  size="md"
                  className="inline-block ml-2"
                />
              )}
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              Please fill out the form below and we will get back to you as soon
              as possible.
            </p>
            <div className="p-8">
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-bold text-gray-800" htmlFor="name">
                  Name
                </label>
                <input
                  className="border py-2 px-3 text-gray-800"
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-bold text-gray-800" htmlFor="email">
                  Email
                </label>
                <input
                  className="border py-2 px-3 text-gray-800"
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label
                  className="mb-2 font-bold text-gray-800"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="border py-2 px-3 text-gray-800"
                  name="message"
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button
                className="w-full block bg-indigo-500 text-white uppercase mx-auto p-4 rounded"
                onClick={() => {
                  handleForm();
                }}
              >
                Send Message
              </button>
            </div>
          </div>

          <div className="bg-white min-w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-4 bl-0 br-0 md:bl-10 md:br-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="rounded-full h-14 w-14 bg-indigo-500 flex items-center justify-center">
                        <EnvelopeIcon className="h-8 w-20 text-white" />
                      </div>
                      <div className="ml-10 md:ml-4 mt-4 md:mt-0">
                        <p className="font-bold text-black">Email</p>
                        <p className="text-sm text-gray-700 mt-1">
                          <a href="mailto:sample@mail.com">Send us an email</a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="rounded-full h-14 w-14 bg-indigo-500 flex items-center justify-center">
                        <PhoneIcon className="h-8 w-20 text-white" />
                      </div>
                      <div className="ml-10 md:ml-4 mt-4 md:mt-0">
                        <p className="font-bold text-black">Phone</p>
                        <p className="text-sm text-gray-700 mt-1">
                          <a href="tel:+1-202-555-0176">+1-202-555-0176</a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="rounded-full h-14 w-14 bg-indigo-500 flex items-center justify-center">
                        <MapIcon className="h-8 w-20 text-white" />
                      </div>
                      <div className="ml-10 md:ml-4 mt-4 md:mt-0">
                        <p className="font-bold text-black">Location</p>
                        <p className="text-sm text-gray-700 mt-1">
                          1234, Pannipitiya, Sri Lanka
                        </p>
                      </div>
                    </div>
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
                New here? Don&apos;t worry, we&apos;ve got you covered. We have
                a dedicated team of developers who are always ready to help you
                out. But that&apos;s not enough for us. We want to make sure
                that you get the best experience possible. That&apos;s why you
                should see what our customers have to say about us. We&apos;re
                always looking for ways to improve our service, so if you have
                any feedback or suggestions, please let us know!
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
