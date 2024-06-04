"use client";
import { Address, encodeFunctionData } from "viem";
import { UseSendTransactionReturnType, useSendTransaction } from "./useSendTransaction";
import { nounsTokenConfig } from "@/data/generated/wagmi";

interface UseApproveNounReturnType extends Omit<UseSendTransactionReturnType, "sendTransaction"> {
  approveNoun: (nounId: bigint, spender: Address) => void;
}

export function useApproveNoun(): UseApproveNounReturnType {
  const { sendTransaction, ...other } = useSendTransaction();

  async function approveNoun(nounId: bigint, spender: Address) {
    const request = {
      to: nounsTokenConfig.address,
      data: encodeFunctionData({
        abi: nounsTokenConfig.abi,
        functionName: "approve",
        args: [spender, nounId],
      }),
      value: BigInt(0),
    };

    return sendTransaction(request);
  }

  return { approveNoun, ...other };
}
