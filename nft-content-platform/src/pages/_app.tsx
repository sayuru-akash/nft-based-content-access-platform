import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { configureChains } from "@wagmi/core";
import { localhost, mainnet, sepolia } from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import ErrorBoundary from "./errorBoundry";
import { Analytics } from "@vercel/analytics/react";

const { chains, provider, webSocketProvider } = configureChains(
  [localhost, mainnet, sepolia],
  [publicProvider()]
);

const web3Client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary fallback={<h1>Something went wrong!</h1>}>
      <WagmiConfig client={web3Client}>
        <Component {...pageProps} />
        <Analytics />
      </WagmiConfig>
    </ErrorBoundary>
  );
}
