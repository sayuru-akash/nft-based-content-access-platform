import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
// import { getUsers } from "../api/userAPI";

export default function UsersPage() {
  //   const [loading, setLoading] = useState(true);
  //   const [users, setUsers] = useState([]);

  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       const data = await getUsers();
  //       setUsers(data);
  //       setLoading(false);
  //     };

  //     fetchUsers();
  //   }, []);

  return (
    <AdminLayout currentPage="Users">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Users</h1>
      <div className="flex flex-col">
        <div className="py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Owned Content
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Joined On
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* {users.map((user, index) => ( */}
                {/* <tr key={user.id}> */}
                <tr>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {/* {index + 1} */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {/* {user.walletAddress} */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {/* {user.name} */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {/* {user.ownedContent} */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    {/* {user.joinedDateTime} */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left border-b border-gray-200">
                    <button className="w-full lg:w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mr-3">
                      View
                    </button>
                    <button className="w-full lg:w-fit bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mr-3">
                      Ban
                    </button>
                    <button className="w-full lg:w-fit bg-red-900 text-white font-bold py-2 px-4 rounded hover:bg-amber-500 ">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
