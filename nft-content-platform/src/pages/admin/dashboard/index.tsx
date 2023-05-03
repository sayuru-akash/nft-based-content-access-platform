import AdminLayout from "../AdminLayout";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { FireIcon, TrophyIcon } from "@heroicons/react/24/solid";
import { ArrowSmallUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Loading } from "@nextui-org/react";
import { Content } from "../../../../types/Content";
import Image from "next/image";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [usersLast24h, setUsersLast24h] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [contentLast24h, setContentLast24h] = useState(0);
  const [contentSalesCount, setContentSalesCount] = useState(0);
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
    const fetchCounts = async () => {
      try {
        let data = await fetch("http://localhost:3010/users/count").then(
          (res) => res.json()
        );
        setUsersCount(data.count);
        setUsersLast24h(data.countLast24h);
        data = await fetch("http://localhost:3010/contents/count").then((res) =>
          res.json()
        );
        setContentCount(data.count);
        setContentLast24h(data.countLast24h);
        data = await fetch("http://localhost:3010/contents/sale-count").then(
          (res) => res.json()
        );
        setContentSalesCount(data.count);
        data = await fetch("http://localhost:3010/contents").then((res) =>
          res.json()
        );
        const formattedContent = data
          .slice(data.length - 5)
          .map((content: Content) => ({
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

    fetchCounts();
  }, [loggedIn === true]);

  if (!loggedIn) return null;
  return (
    <AdminLayout currentPage="Dashboard">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ChevronUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  {loading ? (
                    <Loading size="sm" color="secondary" type="gradient" />
                  ) : (
                    <dd className="text-3xl font-semibold text-gray-900 flex">
                      {usersCount}
                      <span className="text-green-500 text-sm ml-5 flex items-center">
                        <ArrowSmallUpIcon className="h-4 w-4 mr-1" />
                        {usersLast24h} (24h)
                      </span>
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <ChevronUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Content
                  </dt>
                  {loading ? (
                    <Loading size="sm" color="secondary" type="gradient" />
                  ) : (
                    <dd className="text-3xl font-semibold text-gray-900 flex">
                      {contentCount}
                      <span className="text-green-500 text-sm ml-5 flex items-center">
                        <ArrowSmallUpIcon className="h-4 w-4 mr-1" />
                        {contentLast24h} (24h)
                      </span>
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <ChevronUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total OnSale Content
                  </dt>
                  {loading ? (
                    <Loading size="sm" color="secondary" type="gradient" />
                  ) : (
                    <dd className="text-3xl font-semibold text-gray-900 flex">
                      {contentSalesCount}
                      <span className="text-red-500 text-sm ml-5 flex items-center">
                        <FireIcon className="h-6 w-6 mr-1" />
                        (24h)
                      </span>
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 flex">
          Latest Additions
          <span className="text-yellow-500 font-mono text-sm ml-1">x5</span>
          <TrophyIcon className="h-6 w-6 text-yellow-500 ml-2" />
        </h2>
        <div className="mt-4">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                {loading ? (
                  <Loading size="xl" color="secondary" type="gradient" />
                ) : (
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    {contents.length === 0 ? (
                      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                        <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
                          <div className="ml-4 mt-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              No content found
                            </h3>
                            <p className="mt-1 text-sm leading-5 text-gray-500">
                              Looks like there is no content yet. Add some to
                              get started.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Image
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Token ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Created On
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contents.map((content) => (
                            <tr key={content._id} className="text-black">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-20 w-20">
                                  <Image
                                    src={content.image}
                                    alt={content.title}
                                    height={100}
                                    width={100}
                                    className="h-20 w-20 rounded-full"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 uppercase">
                                  {content.title.length > 15
                                    ? `${content.title.slice(0, 15)}..`
                                    : content.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {content.tokenId}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {content.createdOn}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
