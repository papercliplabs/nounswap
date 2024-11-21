import { CHAIN_CONFIG } from "@/config";
import { IdentityApiConfig } from "@paperclip-labs/dapp-kit/identity/server";
import { Address, getAddress } from "viem";

export const IDENTITY_API_CONFIG: IdentityApiConfig = {
  mainnetRpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
  baseRpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
  neynarApiKey: process.env.NEYNAR_API_KEY!,
};

export const HARDCODED_USERS: Record<Address, { name: string; imageSrc: string }> = {
  [getAddress(CHAIN_CONFIG.addresses.nounsTreasury)]: {
    name: "The Nouns Treasury",
    imageSrc: "/nouns-treasury.png",
  },
  [getAddress(CHAIN_CONFIG.addresses.nounsErc20)]: {
    name: "$nouns ERC-20 contract",
    imageSrc: "/nouns-erc20.png",
  },
};
