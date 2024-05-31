"use client";
import { useMemo } from "react";
import { Address, TransactionRequest, encodeFunctionData } from "viem";
import { useAccount, useReadContract } from "wagmi";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { nounsTokenAbi } from "../abis/nounsToken";
import { CHAIN_CONFIG } from "@/utils/config";
import { Noun } from "@/data/noun/types";

interface UseApproveNounParams {
  noun?: Noun;
  spender?: Address;
  onReject?: () => void;
}

interface UseApproveNounReturnType extends UseSendTransactionReturnType {
  requiresApproval: boolean;
}

export default function useApproveNoun({ noun, spender, onReject }: UseApproveNounParams): UseApproveNounReturnType {
  const { address } = useAccount();

  const { data: currentApprovalAddress, refetch: refetchGetApproved } = useReadContract({
    address: CHAIN_CONFIG.addresses.nounsToken,
    abi: nounsTokenAbi,
    functionName: "getApproved",
    args: [noun != undefined ? BigInt(noun.id) : BigInt(0)],
    query: { enabled: noun != undefined },
  });

  const request = useMemo(() => {
    let request: TransactionRequest | undefined = undefined;

    if (noun != undefined && spender && address) {
      const calldata = encodeFunctionData({
        abi: nounsTokenAbi,
        functionName: "approve",
        args: [spender, noun != undefined ? BigInt(noun.id) : BigInt(0)],
      });
      request = {
        to: CHAIN_CONFIG.addresses.nounsToken,
        from: address,
        data: calldata,
      };
    }

    return request;
  }, [noun, spender, address]);

  const sendTxnData = useSendTransaction({
    request,
    successMsg: `Noun ${noun?.id} approved!`,
    onSuccess: () => refetchGetApproved(),
    onReject,
  });

  return { requiresApproval: currentApprovalAddress != spender, ...sendTxnData };
}
