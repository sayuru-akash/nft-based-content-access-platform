import { UserIcon, WalletIcon } from "@heroicons/react/24/outline";
import {
  StopCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Tooltip } from "@nextui-org/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "@wagmi/connectors/injected";
import { getNetwork } from "@wagmi/core";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const targetChainId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID!.toString();
const targetChainName = process.env.NEXT_PUBLIC_TARGET_CHAIN_NAME!.toString();

function Walletbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [chainId, setChainId] = useState("0");

  const router = useRouter();

  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = async () => {
        try {
          const { chain, chains } = getNetwork();
          setChainId(chain!.id.toString());
        } catch (e) {
          console.log(e);
        }
      };
      window.ethereum.on!("chainChanged", handleChainChanged);
      handleChainChanged();
      return () => {
        window.ethereum!.removeListener!("chainChanged", handleChainChanged);
      };
    } else {
      console.log("No compatible wallet found.");
    }
  }, [chainId, isConnected]);

  useEffect(() => {
    if (window.ethereum) {
      if (isConnected) {
        fetch("http://localhost:3010/user/add/" + address)
          .then((response) => response.json())
          .then((data) => {
            Cookies.remove("userId");
            Cookies.set("userId", data.data.id, {
              sameSite: "lax",
              expires: 1 / 24,
            });
            fetch("http://localhost:3010/user/status/" + data.data.id)
              .then((response) => response.json())
              .then((data) => {
                if (data.status == false) {
                  router.push("/banned");
                }
              });
          })
          .catch((error) => console.error(error));
      }
    }
  }, [isConnected, address]);

  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      {isConnected && chainId != targetChainId && (
        <div className="flex items-center gap-x-4">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-semibold leading-6 text-yellow-500">
            Please switch to the {targetChainName} network
          </span>
        </div>
      )}
      {isConnected && chainId == targetChainId && (
        <>
          <button className="w-1/2 inline-flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4">
            <UserIcon className="w-10 h-6 mr-2" />
            <span className="truncate overflow-hidden ...">
              <Tooltip content={address} placement="leftEnd" color="primary">
                {address}
              </Tooltip>
            </span>
          </button>
          <button
            onClick={() => {
              disconnect();
              Cookies.remove("userId");
              router.reload();
            }}
          >
            <Tooltip content={"DISCONNECT"} placement="leftEnd" color="error">
              <StopCircleIcon className="fill-red-600 stroke-red-800 w-10 h-6 ml-4" />
            </Tooltip>
          </button>
        </>
      )}
      {!isConnected && (
        <button
          type="button"
          onClick={() => connect()}
          className="w-1/2 inline-flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <WalletIcon className="w-6 h-6 mr-2" />
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
}

function WalletbarMobile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [chainId, setChainId] = useState("0");

  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = async () => {
        try {
          const { chain, chains } = getNetwork();
          setChainId(chain!.id.toString());
        } catch (e) {
          console.log(e);
        }
      };
      window.ethereum.on!("chainChanged", handleChainChanged);
      handleChainChanged();
      return () => {
        window.ethereum!.removeListener!("chainChanged", handleChainChanged);
      };
    } else {
      console.log("No compatible wallet found.");
    }
  }, [chainId, isConnected]);
  return (
    <div className="flex items-center justify-between">
      <div className="py-6">
        {isConnected && chainId != targetChainId && (
          <div className="flex items-center gap-x-4">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-semibold leading-6 text-yellow-500">
              Please switch to the {targetChainName} network
            </span>
          </div>
        )}
        {isConnected && chainId == targetChainId && (
          <>
            <button className="w-80 inline-flex items-center justify-start px-3 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4">
              <UserIcon className="w-10 h-6 ml-2" />
              <span className="ml-4 truncate overflow-hidden ...">
                {address}
              </span>
            </button>
            <button
              onClick={() => disconnect()}
              className="w-80 mt-5 inline-flex items-center justify-start px-3 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white-800 bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
            >
              <XMarkIcon className="w-10 h-6" />
              <span className="ml-3 truncate overflow-hidden ...">
                Disconnect Wallet
              </span>
            </button>
          </>
        )}
        {!isConnected && (
          <button
            onClick={() => connect()}
            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <WalletIcon className="w-6 h-6 mr-2" />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Walletbar;

export { WalletbarMobile, Walletbar };
