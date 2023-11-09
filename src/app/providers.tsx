"use client";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
    [mainnet],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string }), publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "Noun Swap",
    projectId: "cb75b98c5532821d721e6275da3e7006",
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: false, // Issues with SSR, there is a workaround we used for Hopscotch can add if needed
    connectors,
    publicClient,
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig>
    );
}
