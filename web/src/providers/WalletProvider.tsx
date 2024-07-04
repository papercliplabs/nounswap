"use client";
import TanstackQueryProvider from "./TanstackQueryProvider";
import { ConnectKitProvider, Types } from "connectkit";
import { fallback, zeroAddress } from "viem";
import { http, WagmiProvider, createConfig } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { getDefaultConfig, useModal } from "connectkit";
import Link from "next/link";
import { getLinearGradientForAddress } from "@/utils/utils";
import Image from "next/image";

export const PROJECT_ID = "cb75b98c5532821d721e6275da3e7006";

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [CHAIN_CONFIG.chain],
    transports: {
      [CHAIN_CONFIG.publicClient.chain!.id]: fallback([
        http(CHAIN_CONFIG.rpcUrl.primary),
        http(CHAIN_CONFIG.rpcUrl.fallback),
      ]),
    },
    walletConnectProjectId: PROJECT_ID,

    appName: "NounSwap",
    appDescription: "Bid, explore, and swap Nouns.",
    appUrl: process.env.NEXT_PUBLIC_URL!,
    appIcon: `${process.env.NEXT_PUBLIC_URL}/app-icon.jpeg`,

    ssr: true,
  })
);

function Disclaimer() {
  const { setOpen } = useModal();
  return (
    <>
      By connecting your wallet, you agree to our{" "}
      <Link href="/terms" onClick={() => setOpen(false)}>
        Terms and conditions
      </Link>
    </>
  );
}

const CustomAvatar = ({ address, ensImage, ensName, size, radius }: Types.CustomAvatarProps) => {
  return (
    <div
      style={{
        overflow: "hidden",
        borderRadius: radius,
        height: size,
        width: size,
        background: getLinearGradientForAddress(address ?? zeroAddress),
      }}
    >
      {ensImage && <Image src={ensImage} alt={ensName ?? address ?? zeroAddress} fill />}
    </div>
  );
};

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <TanstackQueryProvider>
        <ConnectKitProvider options={{ disclaimer: <Disclaimer />, customAvatar: CustomAvatar }} theme="nouns">
          {children}
        </ConnectKitProvider>
      </TanstackQueryProvider>
    </WagmiProvider>
  );
}
