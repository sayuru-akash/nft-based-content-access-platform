import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Button, Input, Loading } from "@nextui-org/react";
import { SSRProvider } from "@react-aria/ssr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/admin/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogin = async () => {
    setIsLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URL + "/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.status === 200) {
      Cookies.remove("userId");
      Cookies.set("isLoggedIn", "true", {
        sameSite: "lax",
        expires: 1 / 24,
      });
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid username or password!", {
        position: "top-right",
        autoClose: 2800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LockClosedIcon className="mx-auto h-12 w-auto text-gray-400" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 px-4">
          LogIn - Administrator Portal
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg">
          <SSRProvider>
            <form onSubmit={handleLogin}>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="mb-5"
                width="100%"
                aria-label="Username"
              />
              <Input.Password
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-5"
                width="100%"
                aria-label="Password"
              />
              <div className="flex justify-center">
                <Button
                  color="secondary"
                  type="button"
                  size="lg"
                  className="w-full"
                  onPress={handleLogin}
                >
                  Sign in
                  {isLoading && (
                    <Loading type="points-opacity" color="white" size="sm" />
                  )}
                </Button>
              </div>
            </form>
          </SSRProvider>
        </div>
      </div>
    </div>
  );
}
