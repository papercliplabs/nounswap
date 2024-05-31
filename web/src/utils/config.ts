import { Address, Client, createClient, fallback, getAddress, http } from "viem";
import { mainnet, Chain } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

export interface ChainSpecificData {
  chain: Chain;
  publicClient: Client;
  rpcUrl: {
    primary: string;
    fallback: string;
  };
  addresses: {
    nounsToken: Address;
    nounsTreasury: Address; // a.k.a NounsDAOExecutor, which is the treasury time lock
    nounsDoaProxy: Address; // GovernorBravoDelegator, proxy to logic contract
    nounsDoaDataProxy: Address; // proxy to NounsDAOData.sol contract, which
    nounsAuctionHouseProxy: Address;
    nnsEnsResolver: Address;
  };
  nounsFrontendUrl: string;
  subgraphUrl: {
    primary: string;
    fallback: string;
  };
  wrappedNativeTokenAddress: Address;
  swapForWrappedNativeUrl: string;
}

const CHAIN_SPECIFIC_CONFIGS: Record<number, ChainSpecificData> = {
  [mainnet.id]: {
    chain: mainnet,
    rpcUrl: {
      primary: process.env.NEXT_PUBLIC_PRIMARY_RPC_URL!,
      fallback: process.env.NEXT_PUBLIC_FALLBACK_RPC_URL!,
    },
    publicClient: createClient({
      chain: mainnet,
      transport: fallback([
        http(process.env.NEXT_PUBLIC_PRIMARY_RPC_URL!),
        http(process.env.NEXT_PUBLIC_FALLBACK_RPC_URL!),
      ]),
    }),
    addresses: {
      nounsToken: getAddress("0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"),
      nounsTreasury: getAddress("0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"),
      nounsDoaProxy: getAddress("0x6f3E6272A167e8AcCb32072d08E0957F9c79223d"),
      nounsDoaDataProxy: getAddress("0xf790A5f59678dd733fb3De93493A91f472ca1365"),
      nounsAuctionHouseProxy: getAddress("0x830BD73E4184ceF73443C15111a1DF14e495C706"),
      nnsEnsResolver: getAddress("0x849F92178950f6254db5D16D1ba265E70521aC1B"),
    },
    nounsFrontendUrl: "https://nouns.wtf/",
    subgraphUrl: {
      primary: "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn",
      fallback: "", // TODO: add decentralized subgraph
    },
    wrappedNativeTokenAddress: getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
    swapForWrappedNativeUrl:
      "https://app.uniswap.org/swap?outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&chain=mainnet",
  },
  // TODO: add Sepolia
};

export const CHAIN_CONFIG = CHAIN_SPECIFIC_CONFIGS[Number(process.env.NEXT_PUBLIC_CHAIN_ID!)]!;
