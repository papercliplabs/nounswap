"use client";
import { useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { useChainModal } from "@rainbow-me/rainbowkit";

export function useSwitchChainCustom(): {
  switchChain: ({ chainId }: { chainId: number }) => Promise<boolean>;
} {
  const { switchChainAsync } = useSwitchChain();
  const { openChainModal } = useChainModal();

  const switchChain = useCallback(
    async ({ chainId }: { chainId: number }) => {
      try {
        // Try to automatically switch
        const { id } = await switchChainAsync({ chainId });
        if (id != CHAIN_CONFIG.chain.id) {
          throw "Didn't switch network, likely injected..";
        }
        return true;
      } catch (e) {
        // If that doesn't work open the modal
        console.error("Error switching chains, disconnecting...", e);
        openChainModal?.();
        return false;
      }
    },
    [switchChainAsync, openChainModal]
  );

  return { switchChain };
}
