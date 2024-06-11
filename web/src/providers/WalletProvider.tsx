"use client";
import { Address, fallback } from "viem";
import { http, WagmiProvider } from "wagmi";
import { AvatarComponent, DisclaimerComponent, RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";

import { CHAIN_CONFIG } from "@/config";
import TanstackQueryProvider from "./TanstackQueryProvider";
import { getLinearGradientForAddress } from "@/utils/utils";
import Image from "next/image";

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const linearGradient = getLinearGradientForAddress(address as Address);
  return ensImage ? (
    <Image src={ensImage} width={size} height={size} alt="" style={{ borderRadius: 999, width: size, height: size }} />
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

export const wagmiConfig = getDefaultConfig({
  appName: "Noun Swap",
  projectId: "cb75b98c5532821d721e6275da3e7006",
  chains: [CHAIN_CONFIG.chain],
  transports: {
    [CHAIN_CONFIG.publicClient.chain!.id]: fallback([
      http(CHAIN_CONFIG.rpcUrl.primary),
      http(CHAIN_CONFIG.rpcUrl.fallback),
    ]),
  },
  ssr: true,
});

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the <Link href="/terms">Terms & Conditions</Link>.
  </Text>
);

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <TanstackQueryProvider>
        <RainbowKitProvider avatar={CustomAvatar} appInfo={{ appName: "Noun Swap", disclaimer: Disclaimer }}>
          {children}
        </RainbowKitProvider>
      </TanstackQueryProvider>
    </WagmiProvider>
  );
}
