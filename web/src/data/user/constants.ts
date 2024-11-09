import { CHAIN_CONFIG } from "@/config";
import { IdentityConfig, IdentityResolver } from "@paperclip-labs/dapp-kit/identity/api";
import { Address } from "viem";

export const HARDCODED_USERS: Record<Address, { name: string; imageSrc: string }> = {
  [CHAIN_CONFIG.addresses.nounsTreasury]: {
    name: "The Nouns Treasury",
    imageSrc: "/nouns-treasury.png",
  },
  [CHAIN_CONFIG.addresses.nounsErc20]: {
    name: "$nouns ERC-20 contract",
    imageSrc: "/nouns-erc20.png",
  },
};

export const IDENTITY_RESOLVERS: IdentityResolver[] = ["nns", "ens", "farcaster"];

export const IDENTITY_CONFIG: IdentityConfig = {
  mainnetRpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
  neynarApiKey: process.env.NEYNAR_API_KEY!,
};
