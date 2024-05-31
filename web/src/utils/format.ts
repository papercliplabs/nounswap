import { Address } from "viem";

export function formatAddress(address: Address, amount: number = 4): string {
  return `${address.slice(0, amount)}...${address?.slice(address.length - amount, address.length)}`;
}
