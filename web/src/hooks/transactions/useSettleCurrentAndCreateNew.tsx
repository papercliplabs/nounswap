"use client";
import { encodeFunctionData } from "viem";
import { nounsAuctionHouseConfig } from "@/data/generated/wagmi";
import { UseSendTransactionReturnType, useSendTransaction } from "./useSendTransaction";

interface UseCreateBidReturnType extends Omit<UseSendTransactionReturnType, "sendTransaction"> {
  settleCurrentAndCreateNew: () => void;
}

export function useSettleCurrentAndCreateNew(): UseCreateBidReturnType {
  const { sendTransaction, ...other } = useSendTransaction();

  async function settleCurrentAndCreateNew() {
    // TODO: Validate can settle (?)

    const request = {
      to: nounsAuctionHouseConfig.address,
      data: encodeFunctionData({
        abi: nounsAuctionHouseConfig.abi,
        functionName: "settleCurrentAndCreateNewAuction",
      }),
      value: BigInt(0),
    };

    return sendTransaction(request);
  }

  return { settleCurrentAndCreateNew, ...other };
}
