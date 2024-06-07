"use server";
import { Address } from "viem";
import { CHAIN_CONFIG } from "@/config";
import { readContract } from "viem/actions";
import { nounsNftTokenConfig } from "../generated/wagmi";
import { BigIntString } from "@/utils/types";

export async function getDoesNounRequireApproval(nounId: BigIntString, spender: Address): Promise<boolean> {
  const currentApprovalAddress = await readContract(CHAIN_CONFIG.publicClient, {
    address: nounsNftTokenConfig.address,
    abi: nounsNftTokenConfig.abi,
    functionName: "getApproved",
    args: [BigInt(nounId)],
  });

  return currentApprovalAddress !== spender;
}
