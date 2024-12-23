"use client";
import { ReactNode } from "react";
import { WhiskSdkProvider as _WhiskSdkProvider } from "@paperclip-labs/whisk-sdk";
import { getAddress } from "viem";
import { CHAIN_CONFIG } from "@/config";

export default function WhiskSdkProvider({ children }: { children: ReactNode }) {
  return (
    <_WhiskSdkProvider
      apiKey={process.env.NEXT_PUBLIC_WHISK_API_KEY!}
      config={{
        identity: {
          resolvers: ["nns", "ens", "farcaster", "lens", "base", "uni", "world"],
          overrides: {
            [getAddress(CHAIN_CONFIG.addresses.nounsTreasury)]: {
              name: "The Nouns Treasury",
              avatar: "/nouns-treasury.png",
            },
            [getAddress(CHAIN_CONFIG.addresses.nounsErc20)]: {
              name: "$nouns ERC-20 contract",
              avatar: "/nouns-erc20.png",
            },
          },
        },
      }}
    >
      {children}
    </_WhiskSdkProvider>
  );
}
