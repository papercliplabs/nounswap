"use client";
import Image from "next/image";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/utils/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { Address } from "viem";

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
                    {ensAvatar ? (
                      <Image src={ensAvatar ?? ""} width={32} height={32} alt="avatar" className="rounded-full" />
                    ) : (
                      <div
                        className="h-[32px] w-[32px] rounded-full"
                        style={{
                          background: getLinearGradientForAddress(account.address as Address),
                        }}
                      />
                    )}
                    <span className={twMerge("label-md md:flex", !disableMobileShrink && "hidden")}>
                      {ensName ?? getShortAddress(account.address as Address)}
                    </span>
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
