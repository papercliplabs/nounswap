import { Address, getAddress } from "viem";
import { mainnet, goerli, Chain } from "viem/chains";

interface ChainSpecificData {
    chain: Chain & { iconUrl?: string };
    nounsTokenAddress: Address;
    nounsTreasuryAddress: Address; // a.k.a NounsDAOExecutor, which is the treasury time lock
    nounsDoaProxyAddress: Address; // GovernorBravoDelegator, proxy to logic contract
    nounsFrontendUrl: string;
    subgraphUrl: string;
}

const CHAIN_SPECIFIC_DATA: Record<number, ChainSpecificData> = {
    [mainnet.id]: {
        chain: mainnet,
        nounsTokenAddress: getAddress("0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"),
        nounsTreasuryAddress: getAddress("0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"),
        nounsDoaProxyAddress: getAddress("0x6f3E6272A167e8AcCb32072d08E0957F9c79223d"),
        nounsFrontendUrl: "https://nouns.wtf",
        subgraphUrl: "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph",
    },
    [goerli.id]: {
        chain: { ...goerli, iconUrl: "/ethereum-testnet.png" },
        nounsTokenAddress: getAddress("0x99265CE0983aab76F5a3789663FDD887dE66638A"),
        nounsTreasuryAddress: getAddress("0xc15008dE43D93D115BD64ED4D95817fFdBfb6DEA"),
        nounsDoaProxyAddress: getAddress("0x22F7658f64be277e6b3968ecE7b773b092a39864"),
        nounsFrontendUrl: "https://nouns-webapp-nu.vercel.app",
        subgraphUrl:
            "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns-v3-goerli/0.1.6/gn",
    },
};

export const DEFAULT_CHAIN = CHAIN_SPECIFIC_DATA[mainnet.id].chain;

// Return the chainId if valid, otherwise default
export function washChainId(chainId?: number): number {
    return chainId == undefined || !(Number(chainId) in CHAIN_SPECIFIC_DATA) ? DEFAULT_CHAIN.id : Number(chainId);
}

// Get chain specific data
// Will return default chain data if chainId is undefined, or an unsupported chain
export default function getChainSpecificData(chainId?: number): ChainSpecificData {
    return CHAIN_SPECIFIC_DATA[washChainId(chainId)];
}
