import { createConfig, loadBalance, rateLimit } from "ponder";
import { fallback, http } from "viem";
import { base } from "viem/chains";

import { NounsTokenAbi } from "./abis/NounsTokenAbi";
import { nounsErc20Abi } from "./abis/nounsErc20";
import { erc20Abi } from "./abis/erc20";
import { MAINNET_SEC_PER_BLOCK } from "./src/utils/constants";
import { nounsAuctionHouseAbi } from "./abis/nounsAuctionHouse";
import { nounsDoaLogicAbi } from "./abis/nounsDoaLogic";
import { nounsClientIncentivesAbi } from "./abis/nounsClientIncentives";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: fallback([http(process.env.MAINNET_RPC_URL!), http(process.env.MAINNET_RPC_URL_FALLBACK!)]),
    },
    base: {
      chainId: base.id,
      transport: fallback([http(process.env.BASE_RPC_URL!), http(process.env.BASE_RPC_URL_FALLBACK!)]),
    },
  },
  contracts: {
    NounsNFT: {
      abi: NounsTokenAbi,
      address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
      network: "mainnet",
      startBlock: 12985438,
    },
    NounsERC20: {
      abi: nounsErc20Abi,
      address: "0x5c1760c98be951A4067DF234695c8014D8e7619C",
      network: "mainnet",
      startBlock: 20025747,
    },
    NounsErc20Base: {
      abi: erc20Abi,
      address: "0x0a93a7BE7e7e426fC046e204C44d6b03A302b631",
      network: "base",
      startBlock: 15399701,
    },
    NounsAuctionHouse: {
      abi: nounsAuctionHouseAbi,
      address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
      network: "mainnet",
      startBlock: 12985451,
    },
    NounsDaoProxy: {
      abi: nounsDoaLogicAbi,
      address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
      network: "mainnet",
      startBlock: 12985453,
      includeTransactionReceipts: true,
    },
    NounsClientIncentives: {
      abi: nounsClientIncentivesAbi,
      address: "0x883860178F95d0C82413eDc1D6De530cB4771d55",
      network: "mainnet",
      startBlock: 19818566,
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
