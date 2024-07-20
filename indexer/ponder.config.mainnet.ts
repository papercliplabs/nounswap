// This file will be copied to ponder.config.ts, DO NOT MODIFY ponder.config.ts
import { createConfig, rateLimit } from "@ponder/core";
import { http } from "viem";
import { base } from "viem/chains";

import { NounsTokenAbi } from "./abis/NounsTokenAbi";
import { nounsErc20Abi } from "./abis/nounsErc20";
import { erc20Abi } from "./abis/erc20";
import { MAINNET_SEC_PER_BLOCK } from "./src/utils/constants";
import { nounsAuctionHouseAbi } from "./abis/nounsAuctionHouse";
import { nounsDoaLogicAbi } from "./abis/nounsDoaLogic";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: process.env.LOCAL_MAINNET_RPC_URL
        ? http(process.env.LOCAL_MAINNET_RPC_URL)
        : rateLimit(http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`), {
            requestsPerSecond: 12,
          }),
    },
    base: {
      chainId: base.id,
      transport: rateLimit(http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`), {
        requestsPerSecond: 12,
      }),
    },
  },
  contracts: {
    NounsNFT: {
      abi: NounsTokenAbi,
      address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
      network: "mainnet",
      startBlock: 12985438, // Misses events from past ~1 week
    },
    NounsERC20: {
      abi: nounsErc20Abi,
      address: "0x5c1760c98be951A4067DF234695c8014D8e7619C",
      network: "mainnet",
      startBlock: 20025747,
      maxBlockRange: 1000,
    },
    NounsErc20Base: {
      abi: erc20Abi,
      address: "0x0a93a7BE7e7e426fC046e204C44d6b03A302b631",
      network: "base",
      startBlock: 15399701,
      maxBlockRange: 1000,
    },
    NounsAuctionHouse: {
      abi: nounsAuctionHouseAbi,
      address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
      network: "mainnet",
      startBlock: 12985451,
      maxBlockRange: 1000,
    },
    NounsDaoProxy: {
      abi: nounsDoaLogicAbi,
      address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
      network: "mainnet",
      startBlock: 12985453,
      maxBlockRange: 1000,
      includeTransactionReceipts: true,
    },
  },
  blocks: {
    TreasuryBalanceTrigger: {
      network: "mainnet",
      startBlock: 12985452,
      interval: (60 * 60 * 24) / MAINNET_SEC_PER_BLOCK, // Every day
    },
  },
});
