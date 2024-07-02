import { fallback } from "viem";
import { cookieStorage, createStorage, http, WagmiProvider } from "wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { CHAIN_CONFIG } from "@/config";

export const PROJECT_ID = "cb75b98c5532821d721e6275da3e7006";

export const wagmiConfig = defaultWagmiConfig({
  projectId: PROJECT_ID,
  metadata: {
    name: "Noun Swap",
    description: "Bid, explore, and swap Nouns.",
    url: process.env.NEXT_PUBLIC_URL!,
    icons: [], // TODO
  },
  chains: [CHAIN_CONFIG.chain],
  transports: {
    [CHAIN_CONFIG.publicClient.chain!.id]: fallback([
      http(CHAIN_CONFIG.rpcUrl.primary),
      http(CHAIN_CONFIG.rpcUrl.fallback),
    ]),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
