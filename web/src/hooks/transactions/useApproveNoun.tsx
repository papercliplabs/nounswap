"use client";
import { Address, encodeFunctionData } from "viem";
import { UseSendTransactionReturnType, useSendTransaction } from "./useSendTransaction";
import { nounsTokenConfig } from "@/data/generated/wagmi";
import { useCallback } from "react";

interface UseApproveNounReturnType extends Omit<UseSendTransactionReturnType, "sendTransaction"> {
  approveNoun: (nounId: bigint, spender: Address) => void;
}

export function useApproveNoun(): UseApproveNounReturnType {
  const { sendTransaction, ...other } = useSendTransaction();

  const approveNoun = useCallback(
    (nounId: bigint, spender: Address) => {
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
    },
    [sendTransaction]
  );

  return { approveNoun, ...other };
}
