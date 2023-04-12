import { Web3Deps } from "../../../types/hooks";
import {
  hookFactory as createAccountHook,
  UseAccountHook,
} from "./useWalletAccount";
import {
  hookFactory as createNetworkHook,
  UseNetworkHook,
} from "./useChainNetwork";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
};

export type SetupHooks = {
  (d: Web3Deps): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
  };
};
