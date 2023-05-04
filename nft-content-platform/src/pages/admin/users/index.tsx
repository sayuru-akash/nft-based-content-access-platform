import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Loading } from "@nextui-org/react";
import { User } from "../../../../types/User";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Modal, Button } from "@nextui-org/react";
import Cookies from "js-cookie";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const confirmHandler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  const router = useRouter();
  const { search } = router.query;

  const isLoggedIn = Cookies.get("isLoggedIn");

  useEffect(() => {
    if (isLoggedIn === "false" || !isLoggedIn) {
      router.push("/admin/login");
    } else {
      setLoggedIn(true);
    }
  }, [isLoggedIn]);

  const fetchUsers = async () => {
    try {
      let url = "http://localhost:3010/users";
      if (search) {
        url += `?search=${search}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      const formattedUsers = data.map((user: User) => ({
        ...user,
        joinedOn: new Date(user.joinedOn).toLocaleString(),
      }));
      setUsers(formattedUsers);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [loggedIn === true, search]);

  const handleBanOrUnban = async (userId: string, status: boolean) => {
    setLoading(true);
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
        await fetchUsers();
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

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3010/user/delete/" + userId);
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
        await fetchUsers();
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

  if (!isLoggedIn)
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8"></div>
    );
  return (
    <AdminLayout currentPage="Users">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Users</h1>
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
                      Search users by their name or wallet address...
                    </h3>
                  </div>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="search"
                    className="form-input pt-1 pb-1 text-blue-600 font-mono text-lg block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter search term in here to search"
                    onChange={(e) =>
                      router.push(`/admin/users?search=${e.target.value}`)
                    }
                  />
                </div>
              </div>
              {users.length === 0 ? (
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
                    <div className="ml-4 mt-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        No users found
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Looks like there are no users matching your search
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
                        Wallet Address
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Created
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
                    {users.map((user, index) => (
                      <tr key={user._id} className="text-black">
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {`${user.wallet.slice(0, 9)}...${user.wallet.slice(
                            -9
                          )}`}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {user.ownedContent} token/s
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {user.joinedOn}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-left border-b border-gray-200">
                          <button className="w-full lg:w-fit bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mr-3">
                            View
                          </button>
                          {user.status ? (
                            <button
                              onClick={() => handleBanOrUnban(user._id, false)}
                              className="w-full lg:w-fit bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mr-3"
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanOrUnban(user._id, true)}
                              className="w-full lg:w-fit bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mr-3"
                            >
                              UnBan
                            </button>
                          )}
                          <button
                            onClick={confirmHandler}
                            className="w-full lg:w-fit bg-red-900 text-white font-bold py-2 px-4 rounded hover:bg-amber-500 "
                          >
                            Delete
                          </button>
                        </td>
                        <Modal
                          closeButton
                          aria-labelledby="modal-title"
                          open={visible}
                          onClose={closeHandler}
                        >
                          <Modal.Header className="font-extrabold  modal-title">
                            Delete User
                          </Modal.Header>
                          <Modal.Body>
                            <span className="text-sm">
                              Are you sure you want to delete this user? This
                              action cannot be undone and you will lose all the
                              data related to this user.
                            </span>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              auto
                              color="error"
                              onPress={() => {
                                handleDelete(user._id);
                                closeHandler();
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              auto
                              flat
                              color="secondary"
                              onPress={closeHandler}
                            >
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
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
