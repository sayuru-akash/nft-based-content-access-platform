import Link from "next/link";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon, HashtagIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Users", href: "/admin/users" },
  { name: "Content", href: "/admin/content" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type AdminHeaderProps = {
  currentPage: string;
};

export default function AdminHeader({ currentPage }: AdminHeaderProps) {
  const router = useRouter();

  const isLoggedIn = Cookies.get("isLoggedIn");
  if (isLoggedIn === "false" || !isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    Cookies.remove("isLoggedIn");
    router.push("/admin/login");
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link className="text-white font-bold text-xl" href="/admin/">
                    Moderation Portal
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Fragment key={item.name}>
                        {currentPage === item.name ? (
                          <span className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900">
                            {item.name}
                          </span>
                        ) : (
                          <Link
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            href={item.href}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <HashtagIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Menu as="div" className="ml-3 relative">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <Image
                              src={
                                "https://images.unsplash.com/photo-1586038693164-cb7ee3fb8e2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80"
                              }
                              alt={"Avatar"}
                              width={40}
                              height={40}
                              className="h-8 w-8 rounded-full"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleLogout}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm w-full text-left"
                                    )}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Fragment key={item.name}>
                  {currentPage === item.name ? (
                    <a
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      {item.name}
                    </a>
                  )}
                </Fragment>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
