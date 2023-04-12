import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createDefaultState,
  Web3State,
  loadContract,
  createWeb3State,
} from "../providers/utils";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "../../../types/marketSmartContract";

const pageReload = () => {
  window.location.reload();
};

const handleAccountsChanged =
  (ethereum: MetaMaskInpageProvider) => async () => {
    ethereum._metamask.isUnlocked().then((isUnlocked) => {
      if (!isUnlocked) {
        pageReload();
      }
    });
  };

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("accountsChanged", handleAccountsChanged(ethereum));
};

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.removeListener("chainChanged", pageReload);
  ethereum.removeListener("accountsChanged", handleAccountsChanged);
};

const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME;
const Web3Context = createContext<Web3State>(createDefaultState());

interface Web3ProviderProps {
  children: any;
}

const Web3Provider: FunctionComponent<Web3ProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState);

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        // @ts-ignore
        const contract = await loadContract(CONTRACT_NAME, provider);

        const signer = provider.getSigner();
        const signedContract = contract.connect(signer);

        setTimeout(() => setGlobalListeners(window.ethereum), 500);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract: signedContract as unknown as NftMarketContract,
            isLoading: false,
          })
        );
      } catch (e: any) {
        console.error("Please install Metamask: ", e);
        setWeb3Api((web3Api: any) =>
          createWeb3State({
            ...(web3Api as any),
            isLoading: false,
          })
        );
      }
    }
    initWeb3().then((r) => console.log("Init Web3: ", r));
    return () => {
      if (window.ethereum) {
        removeGlobalListeners(window.ethereum);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

export function useWeb3Hooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
