import { CHAIN_CONFIG } from "@/config";
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
