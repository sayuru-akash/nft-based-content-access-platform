import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Loading } from "@nextui-org/react";
import { Content } from "../../../../types/Content";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn");
    if (isLoggedIn === "false" || !isLoggedIn) {
      router.push("/admin/login");
    } else {
      setLoggedIn(true);
    }
  }, []);

  const fetchContent = async () => {
    try {
      let url = "http://localhost:3010/contents";
      if (search) {
        url += `?search=${search}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      const formattedContent = data.map((content: Content) => ({
        ...content,
        createdOn: new Date(content.createdOn).toLocaleString(),
      }));
      setContents(formattedContent);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [loggedIn === true, search]);

  const handleListOrUnlist = async (contentId: string, status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3010/content/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId, status }),
      });
      const data = await res.json();
      const message = data.message;
      if (res.status === 200) {
        toast.success(message, {
          position: "top-right",
          autoClose: 2800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        await fetchContent();
        setLoading(false);
      } else {
        toast.error(message, {
          position: "top-right",
          autoClose: 2800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    return setLoading(false);
  };

  const handleBlacklist = async (
    contentId: string,
    userId: string,
    status: boolean
  ) => {
    setLoading(true);
    await handleListOrUnlist(contentId, status);
    try {
      const res = await fetch("http://localhost:3010/user/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, status }),
      });
      const data = await res.json();
      const message = data.message;
      if (res.status === 200) {
        toast.success(message, {
          position: "top-right",
          autoClose: 2800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        await fetchContent();
        setLoading(false);
      } else {
        toast.error(message, {
          position: "top-right",
          autoClose: 2800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    return setLoading(false);
  };

  if (!loggedIn)
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8"></div>
    );
  return (
    <AdminLayout currentPage="Content">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Content</h1>
      <div className="flex flex-col">
        <ToastContainer />
        {loading ? (
          <Loading size="xl" color="secondary" type="gradient" />
        ) : (
          <div className="py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
                  <div className="ml-4 mt-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-700">
                      Search content by their title or token id...
                    </h3>
                  </div>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="search"
                    className="form-input pt-1 pb-1 text-blue-600 font-mono text-lg block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter search term in here to search"
                    onChange={(e) =>
                      router.push(`/admin/content?search=${e.target.value}`)
                    }
                  />
                </div>
              </div>
              {contents.length === 0 ? (
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
                    <div className="ml-4 mt-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        No content found
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Looks like there are no content matching your search
                        criteria.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Token ID
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Author ID
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Created On
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {contents.map((content, index) => (
                      <tr key={content._id} className="text-black">
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <Image
                            src={content.image}
                            alt={content.title}
                            height={100}
                            width={100}
                            className="w-20 h-20 object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {content.tokenId}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {content.title.length > 10
                            ? `${content.title.slice(0, 10)}..`
                            : content.title}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {content.authorId.length > 10
                            ? `${content.authorId.slice(0, 10)}..`
                            : content.authorId}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {content.createdOn}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-left border-b border-gray-200">
                          <button className="w-full lg:w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mr-3">
                            View
                          </button>
                          {content.status && content.authorStatus ? (
                            <button
                              onClick={() => {
                                handleListOrUnlist(content._id, false);
                              }}
                              className="w-full lg:w-fit bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mr-3"
                            >
                              UnList
                            </button>
                          ) : null}

                          {content.authorStatus && !content.status ? (
                            <button
                              onClick={() => {
                                handleListOrUnlist(content._id, true);
                              }}
                              className="w-full lg:w-fit bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mr-3"
                            >
                              List
                            </button>
                          ) : null}
                          {content.authorStatus ? (
                            <button
                              onClick={() => {
                                handleBlacklist(
                                  content._id,
                                  content.authorId,
                                  false
                                );
                              }}
                              className="w-full lg:w-fit bg-red-900 text-white font-bold py-2 px-4 rounded hover:bg-amber-500 "
                            >
                              Blacklist
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full lg:w-fit bg-gray-900 text-white font-bold py-2 px-4 rounded"
                            >
                              Blacklisted
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
