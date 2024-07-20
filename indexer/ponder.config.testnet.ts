// This file will be copied to ponder.config.ts, DO NOT MODIFY ponder.config.ts
import { createConfig, rateLimit } from "@ponder/core";
import { http, zeroAddress } from "viem";
import { sepolia } from "viem/chains";

import { NounsTokenAbi } from "./abis/NounsTokenAbi";
import { nounsErc20Abi } from "./abis/nounsErc20";
import { erc20Abi } from "./abis/erc20";
import { nounsAuctionHouseAbi } from "./abis/nounsAuctionHouse";
import { nounsDoaLogicAbi } from "./abis/nounsDoaLogic";
import { MAINNET_SEC_PER_BLOCK } from "./src/utils/constants";

export default createConfig({
  networks: {
    sepolia: {
      chainId: sepolia.id,
      transport: rateLimit(http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`), {
        requestsPerSecond: 12,
      }),
    },
  },
  contracts: {
    NounsNFT: {
      abi: NounsTokenAbi,
      address: "0x4C4674bb72a096855496a7204962297bd7e12b85",
      network: "sepolia",
      startBlock: 3594846,
    },
    NounsERC20: {
      abi: nounsErc20Abi,
      address: "0x34182d56d905a195524a8F1813180C134687ca34",
      network: "sepolia",
      startBlock: 6000206,
    },
    // $nouns not deployed on base sepolia, dummy to satisfy type checker
    NounsErc20Base: {
      abi: erc20Abi,
      address: zeroAddress,
      network: "sepolia",
      startBlock: 6000206,
    },
    NounsAuctionHouse: {
      abi: nounsAuctionHouseAbi,
      address: "0x488609b7113FCf3B761A05956300d605E8f6BcAf",
      network: "sepolia",
      startBlock: 3594847,
      maxBlockRange: 1000,
    },
    NounsDaoProxy: {
      abi: nounsDoaLogicAbi,
      address: "0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57",
      network: "sepolia",
      startBlock: 3594849,
      maxBlockRange: 1000,
      includeTransactionReceipts: true,
    },
  },
  blocks: {
    TreasuryBalanceTrigger: {
      network: "sepolia",
      startBlock: 3594849,
      interval: (60 * 60 * 24) / MAINNET_SEC_PER_BLOCK, // Every day
    },
  },
});
