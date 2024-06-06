import { nounsTokenAbi } from "@/abis/nounsToken";
import { defineConfig } from "@wagmi/cli";
import { CHAIN_CONFIG } from "@/config";
import { react } from "@wagmi/cli/plugins";
import { nounsAuctionHouseAbi } from "@/abis/nounsAuctionHouse";
import { nounsDoaLogicAbi } from "@/abis/nounsDoaLogic";

export default defineConfig({
  out: "src/data/generated/wagmi.ts",
  contracts: [
    {
      name: "NounsToken",
      abi: nounsTokenAbi,
      address: CHAIN_CONFIG.addresses.nounsToken,
    },
    {
      name: "NounsAuctionHouse",
      abi: nounsAuctionHouseAbi,
      address: CHAIN_CONFIG.addresses.nounsAuctionHouseProxy,
    },
    {
      name: "NounsDaoLogic",
      abi: nounsDoaLogicAbi,
      address: CHAIN_CONFIG.addresses.nounsDoaProxy,
    },
  ],
  plugins: [react()],
});
