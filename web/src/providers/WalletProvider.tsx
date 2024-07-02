"use client";
import { State, WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import TanstackQueryProvider from "./TanstackQueryProvider";
import { palette } from "@/theme/tailwind.config";
import { PROJECT_ID, wagmiConfig } from "./wagmiConfig";

createWeb3Modal({
  wagmiConfig,
  projectId: PROJECT_ID,
  enableAnalytics: true,
  enableOnramp: true,
  allowUnsupportedChain: true,
  termsConditionsUrl: "https://www.nounswap.wtf/terms",
  themeMode: "light",
  themeVariables: {
    "--w3m-font-family": "var(--font-pt-root-ui)",
    "--w3m-accent": palette.gray[900],
    "--w3m-color-mix-strength": 0,
  },
});

export default function WalletProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </WagmiProvider>
  );
}
