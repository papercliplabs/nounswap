"use server";
import { Address, erc20Abi } from "viem";
import { CHAIN_CONFIG } from "@/config";
import { readContract } from "viem/actions";
import { BigIntString } from "@/utils/types";

export async function getDoesErc20RequireApproval(
  tokenAddress: Address,
  owner: Address,
  spender: Address,
  amount: BigIntString
): Promise<boolean> {
  const currentAllowance = await readContract(CHAIN_CONFIG.publicClient, {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });

  return currentAllowance < BigInt(amount);
}
