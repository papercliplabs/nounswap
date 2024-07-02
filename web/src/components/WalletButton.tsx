"use client";
import Image from "next/image";
import { useAccount, useEnsAvatar, useEnsName, useSwitchChain } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/utils/utils";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { Address } from "viem";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { CHAIN_CONFIG } from "@/config";

interface WalletButtonProps {
  disableMobileShrink?: boolean;
}

export default function WalletButton({ disableMobileShrink }: WalletButtonProps) {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? "", chainId: 1 });
  const { selectedNetworkId } = useWeb3ModalState();
  const { switchChain } = useSwitchChain();

  if (!isConnected) {
    return (
      <Button onClick={() => open({ view: "Connect" })} variant="secondary">
        Connect
      </Button>
    );
  }

  if (selectedNetworkId != CHAIN_CONFIG.chain.id.toString()) {
    return (
      <Button onClick={() => switchChain({ chainId: CHAIN_CONFIG.chain.id })} variant="negative">
        Wrong Network
      </Button>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <Button variant="secondary" onClick={() => open({ view: "Account" })} className="flex flex-row gap-2 px-4 py-2">
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
        <h6 className={twMerge("md:flex", !disableMobileShrink && "hidden")}>
          {ensName ?? getShortAddress(address as Address)}
        </h6>
      </Button>
    </div>
  );
}
