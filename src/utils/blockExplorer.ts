import { CHAIN_CONFIG } from "@/config";
import { Address } from "viem";

export function getExplorerLink(address: Address) {
  return CHAIN_CONFIG.chain.blockExplorers?.default.url + "/address/" + address;
}
