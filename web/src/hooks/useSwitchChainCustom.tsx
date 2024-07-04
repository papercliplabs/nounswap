"use client";
import { useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { CHAIN_CONFIG } from "@/config";

export function useSwitchChainCustom(): {
  switchChain: ({ chainId }: { chainId: number }) => Promise<boolean>;
} {
  const { switchChainAsync } = useSwitchChain();
  const { open } = useWeb3Modal();

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
        open({ view: "Networks" });
        return false;
      }
    },
    [switchChainAsync, open]
  );

  return { switchChain };
}
