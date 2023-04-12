import useSWR from "swr";
import { CryptoHookFactory } from "../../../types/hooks";

const NETWORKS: { [k: string]: string } = {
  1: "MAINNET",
  3: "ROPSTEN",
  4: "RINKEBY",
  5: "GOERLI",
  42: "KOVAN",
  56: "BINANCE SMART CHAIN",
  1337: "LOCALHOST",
  11155111: "SEPOLIA",
};

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId!];

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
  isConnectedToNetwork: boolean;
};

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

// @ts-ignore
export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  // @ts-ignore
  () => {
    const { data, isValidating, ...swr } = useSWR(
      provider ? "web3/useNetwork" : null,
      async () => {
        const chainId = await provider!
          .getNetwork()
          .then((n) => n.chainId.toString());
        if (!chainId) {
          throw "Cannot retrieve network! Please, connect to web3 wallet.";
        }
        return NETWORKS[chainId];
      },
      {
        revalidateOnFocus: true,
      }
    );

    const isSupported = data === targetNetwork;

    return {
      ...swr,
      data,
      isValidating,
      targetNetwork,
      isSupported,
      isConnectedToNetwork: !isLoading && isSupported,
      isLoading: isLoading as boolean,
    };
  };
