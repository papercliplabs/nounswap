"use client";
import { useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { useModal } from "connectkit";

// TODO: might not need this now
export function useSwitchChainCustom(): {
  switchChain: ({ chainId }: { chainId: number }) => Promise<boolean>;
} {
  const { switchChainAsync } = useSwitchChain();
  const { openSwitchNetworks } = useModal();

  const switchChain = useCallback(
    async ({ chainId }: { chainId: number }) => {
      try {
        const { id } = await switchChainAsync({ chainId });
        if (id != CHAIN_CONFIG.chain.id) {
          throw "Didn't switch network, likely injected..";
        }
        return true;
      } catch (e) {
        console.error("Error switching chains, disconnecting...", e);
        openSwitchNetworks();
        return false;
      }
    },
    [switchChainAsync, openSwitchNetworks]
  );

  return { switchChain };
}
