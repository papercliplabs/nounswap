"use client";
import Image from "next/image";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/utils/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { Address } from "viem";
import { Avatar, Name } from "@paperclip-labs/dapp-kit/identity";
import { IDENTITY_RESOLVERS } from "./Identity";
import { motion } from "framer-motion";

interface WalletButtonProps {
  disableMobileShrink?: boolean;
}

export default function WalletButton({ disableMobileShrink }: WalletButtonProps) {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? "", chainId: 1 });

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal }) => {
        const connected = account && chain;

        return (
          <div>
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="secondary" className="py-[10px]">
                    Connect
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button variant="negative" onClick={openChainModal}>
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex flex-row gap-2">
                  <Button variant="secondary" onClick={openAccountModal} className="flex flex-row gap-2 px-4 py-[6px]">
                    <Avatar address={account.address as Address} resolvers={IDENTITY_RESOLVERS} size={32} />
                    <Name
                      address={account.address as Address}
                      resolvers={IDENTITY_RESOLVERS}
                      className="label-md hidden md:block"
                    />
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
