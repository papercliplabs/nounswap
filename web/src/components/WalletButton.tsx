"use client";
import Image from "next/image";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/utils/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { Address } from "viem";

interface WalletButtonProps {
  hideChainSwitcher?: boolean;
  disableMobileShrink?: boolean;
}

export default function WalletButton({ hideChainSwitcher, disableMobileShrink }: WalletButtonProps) {
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
                return <Button onClick={openConnectModal}>Connect</Button>;
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className={twMerge(hideChainSwitcher && "hidden")}
                    onClick={openChainModal}
                  >
                    <Image src={chain.iconUrl ?? ""} width={32} height={32} alt="" />
                  </Button>
                  <Button variant="secondary" onClick={openAccountModal} className="flex flex-row gap-2 px-4 py-3">
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
                    <h6 className={twMerge("md:flex", !disableMobileShrink && "hidden")}>
                      {ensName ?? getShortAddress(account.address as Address)}
                    </h6>
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
