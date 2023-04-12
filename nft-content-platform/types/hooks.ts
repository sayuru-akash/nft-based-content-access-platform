import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { SWRResponse } from "swr";
import { NftMarketContract } from "./marketSmartContract";

export type Web3Deps = {
  provider: ethers.providers.Web3Provider;
  contract: NftMarketContract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Deps>): CryptoHandlerHook<D, R, P>;
};

export type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: string
) => CryptoSWRResponse<D, R>;

export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;
