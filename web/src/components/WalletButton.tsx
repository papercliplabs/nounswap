"use client";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { Address } from "viem";
import { Avatar, Name } from "@paperclip-labs/whisk-sdk/identity";
import clsx from "clsx";

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
                    <Avatar address={account.address as Address} size={32} />
                    <Name
                      address={account.address as Address}
                      className={clsx("label-md md:block", !disableMobileShrink && "hidden")}
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
