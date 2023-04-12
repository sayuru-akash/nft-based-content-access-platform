import { useWeb3Hooks } from "../providers";

export const useAccount = () => {
  const hooks = useWeb3Hooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes,
  };
};

export const useNetwork = () => {
  const hooks = useWeb3Hooks();
  const swrRes = hooks.useNetwork();

  return {
    network: swrRes,
  };
};
