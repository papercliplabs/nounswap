"use client";
import { getLinearGradientForAddress } from "@/lib/utils";
import { ToastProvider } from "./toast";
import { getDefaultWallets, RainbowKitProvider, AvatarComponent } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Address, configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, goerli, localhost } from "wagmi/chains";
import { Suspense, useEffect } from "react";
import UrlManager from "@/components/UrlManager";
import LoadingSpinner from "@/components/LoadingSpinner";

const { chains, publicClient } = configureChains(
    [mainnet, { ...goerli, iconUrl: "/ethereum-testnet.png" }],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
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

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    const linearGradient = getLinearGradientForAddress(address as Address);
    return ensImage ? (
        <Image src={ensImage} width={size} height={size} alt="" style={{ borderRadius: 999 }} />
    ) : (
        <div
            style={{
                background: linearGradient,
                borderRadius: 999,
                height: size,
                width: size,
            }}
        />
    );
};

export default function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Manually trigger autoconnect after mounted
        wagmiConfig.autoConnect();
    }, []);

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} avatar={CustomAvatar}>
                <ToastProvider>{children}</ToastProvider>
                <Suspense fallback={<LoadingSpinner />}>
                    <UrlManager />
                </Suspense>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
