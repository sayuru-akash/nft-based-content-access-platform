import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, ethers } from "ethers";
import { setupHooks, Web3Hooks } from "../hooks/setupHooks";
import { Web3Deps } from "../../../types/hooks";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean; // true if the web3 provider is loading
  hooks: Web3Hooks;
} & Nullable<Web3Deps>;

export const createDefaultState = () => {
  return {
    ethereum: null,
    contract: null,
    provider: null,
    isLoading: true,
    hooks: setupHooks({ isLoading: true } as any),
  };
};

export const createWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: Web3Deps) => {
  return {
    ethereum,
    contract,
    provider,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract, isLoading }),
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: ethers.providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    );

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
};
