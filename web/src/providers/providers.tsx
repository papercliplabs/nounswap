"use client";
import { ToastProvider } from "./toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransactionListenerProvider } from "./TransactionListener";
import WhiskSdkProvider from "./WhiskSdkProvider";
import TanstackQueryProvider from "./TanstackQueryProvider";
import { Address, fallback } from "viem";
import { http, WagmiProvider } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { getDefaultConfig, AvatarComponent, RainbowKitProvider, DisclaimerComponent } from "@rainbow-me/rainbowkit";
import { Avatar } from "@paperclip-labs/whisk-sdk/identity";

export const PROJECT_ID = "cb75b98c5532821d721e6275da3e7006";

const config = getDefaultConfig({
  chains: [CHAIN_CONFIG.chain],
  transports: {
    [CHAIN_CONFIG.publicClient.chain!.id]: fallback([
      http(CHAIN_CONFIG.rpcUrl.primary),
      http(CHAIN_CONFIG.rpcUrl.fallback),
    ]),
  },
  projectId: "cb75b98c5532821d721e6275da3e7006",

  appName: "NounSwap",
  appDescription: "Bid, explore, and swap Nouns.",
  appUrl: process.env.NEXT_PUBLIC_URL!,
  appIcon: `${process.env.NEXT_PUBLIC_URL}/app-icon.jpeg`,

  ssr: true,
});

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return <Avatar address={address as Address} size={size} />;
};

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the <Link href="/terms">Terms & Conditions</Link>.
  </Text>
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryProvider>
      <WagmiProvider config={config}>
        <WhiskSdkProvider>
          <RainbowKitProvider
            avatar={CustomAvatar}
            appInfo={{ appName: "Noun Swap", disclaimer: Disclaimer }}
            showRecentTransactions={true}
          >
            <ToastProvider>
              <TransactionListenerProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </TransactionListenerProvider>
            </ToastProvider>
          </RainbowKitProvider>
        </WhiskSdkProvider>
      </WagmiProvider>
    </TanstackQueryProvider>
  );
}
