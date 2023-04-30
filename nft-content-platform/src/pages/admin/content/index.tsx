import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Loading } from "@nextui-org/react";
import { Content } from "../../../../types/Content";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="));
    const isLoggedInCookie = cookieValue
      ? cookieValue.split("=")[1] === "true"
      : false;
    if (isLoggedIn === "false" || !isLoggedInCookie) {
      router.push("/admin/login");
    } else {
      if (loggedIn === false) setLoggedIn(true);
    }
  }, [router]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("http://localhost:3010/contents");
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

    fetchContent();
  }, [loggedIn === true]);

  if (!loggedIn) return null;
  return (
    <AdminLayout currentPage="Content">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Content</h1>
      <div className="flex flex-col">
        {loading ? (
          <Loading size="xl" color="secondary" type="gradient" />
        ) : (
          <div className="py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
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
                      Token Address
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
                        {`${content.tokenAddress.slice(
                          0,
                          5
                        )}...${content.tokenAddress.slice(-5)}`}
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
                        <button className="w-full lg:w-fit bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mr-3">
                          Unlist
                        </button>
                        <button className="w-full lg:w-fit bg-red-900 text-white font-bold py-2 px-4 rounded hover:bg-amber-500 ">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
