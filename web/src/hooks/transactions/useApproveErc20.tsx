"use client";
import { Address, encodeFunctionData, erc20Abi } from "viem";
import { UseSendTransactionReturnType, useSendTransaction } from "./useSendTransaction";

interface UseApproveErc20ReturnType extends Omit<UseSendTransactionReturnType, "sendTransaction"> {
  approveErc20: (tokenAddress: Address, spender: Address, amount: bigint) => void;
}

export function useApproveErc20(): UseApproveErc20ReturnType {
  const { sendTransaction, ...other } = useSendTransaction();

  async function approveErc20(tokenAddress: Address, spender: Address, amount: bigint) {
    const request = {
      to: tokenAddress,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      }),
      value: BigInt(0),
    };

    return sendTransaction(request);
  }

  return { approveErc20, ...other };
}
