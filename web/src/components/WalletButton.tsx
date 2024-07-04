"use client";
import Image from "next/image";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/utils/utils";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { Address } from "viem";
import { CHAIN_CONFIG } from "@/config";
import { useSwitchChainCustom } from "@/hooks/useSwitchChainCustom";
import { ConnectKitButton, useChains } from "connectkit";

interface WalletButtonProps {
  disableMobileShrink?: boolean;
}

export default function WalletButton({ disableMobileShrink }: WalletButtonProps) {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? "", chainId: 1 });
  const { switchChain } = useSwitchChainCustom();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, chain }) => {
        console.log("CONNECTED", isConnected, address);
        if (!isConnected) {
          return (
            <Button onClick={show} variant="secondary" className="py-[10px]">
              Connect
            </Button>
          );
        }

        const wrongNetwork = isConnected && chain?.id != CHAIN_CONFIG.chain.id;
        if (wrongNetwork) {
          return (
            <Button
              onClick={async () => {
                switchChain({ chainId: CHAIN_CONFIG.chain.id });
              }}
              variant="negative"
            >
              Wrong Network
            </Button>
          );
        }

        return (
          <div className="flex flex-row gap-2">
            <Button variant="secondary" onClick={show} className="flex flex-row gap-2 px-4 py-[6px]">
              {ensAvatar ? (
                <Image src={ensAvatar ?? ""} width={32} height={32} alt="avatar" className="rounded-full" />
              ) : (
                <div
                  className="h-[32px] w-[32px] rounded-full"
                  style={{
                    background: getLinearGradientForAddress(address as Address),
                  }}
                />
              )}
              <span className={twMerge("label-md md:flex", !disableMobileShrink && "hidden")}>
                {ensName ?? getShortAddress(address as Address)}
              </span>
            </Button>
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
