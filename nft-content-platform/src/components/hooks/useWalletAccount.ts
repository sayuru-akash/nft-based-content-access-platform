import useSWR from "swr";
import { CryptoHookFactory } from "../../../types/hooks";
import { useEffect } from "react";

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
};

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

// @ts-ignore
export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  // @ts-ignore
  () => {
    const { data, mutate, isValidating, ...swr } = useSWR(
      provider ? "web3/useAccount" : null,
      async () => {
        const accounts = await provider!.listAccounts();
        const account = accounts[0];

        if (!account) {
          throw "Cannot retrieve account! Please, connect to web3 wallet.";
        }

        return account;
      },
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    );

    useEffect(() => {
      ethereum?.on("accountsChanged", handleAccountsChanged);
      return () => {
        ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    });

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        console.error("No accounts found! Please, connect to web3 wallet.");
      } else {
        // @ts-ignore
        if (accounts[0] !== data) {
          // @ts-ignore
          mutate(accounts[0]).then((r) => console.log(r));
        }
      }
    };

    const connect = async () => {
      try {
        ethereum?.request({ method: "eth_requestAccounts" });
      } catch (e) {
        console.error(e);
      }
    };

    return {
      ...swr,
      data,
      isValidating,
      isLoading: isLoading as boolean,
      isInstalled: !!ethereum?.isMetaMask || false,
      mutate,
      connect,
    };
  };
