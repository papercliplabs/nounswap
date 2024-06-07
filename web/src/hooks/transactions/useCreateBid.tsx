"use client";
import { UseSendTransactionReturnType, useSendTransaction } from "./useSendTransaction";
import { encodeFunctionData, formatEther } from "viem";
import { nounsAuctionHouseConfig } from "@/data/generated/wagmi";
import { CustomTransactionValidationError } from "./types";
import { CLIENT_ID } from "@/utils/constants";
import { multicall } from "viem/actions";
import { CHAIN_CONFIG } from "@/config";
import { bigIntMax } from "@/utils/bigint";
import { formatNumber } from "@/utils/utils";

interface UseCreateBidReturnType extends Omit<UseSendTransactionReturnType, "sendTransaction"> {
  createBid: (nounId: bigint, bidAmount: bigint) => void;
}

export function useCreateBid(): UseCreateBidReturnType {
  const { sendTransaction, ...other } = useSendTransaction();

  async function createBidValidation(
    nounId: bigint,
    bidAmount: bigint
  ): Promise<CustomTransactionValidationError | null> {
    const [{ nounId: auctionNounId, endTime, amount: highestBid }, reservePrice, minBidIncrementPercentage] =
      await multicall(CHAIN_CONFIG.publicClient, {
        contracts: [
          { ...nounsAuctionHouseConfig, functionName: "auction" },
          { ...nounsAuctionHouseConfig, functionName: "reservePrice" },
          { ...nounsAuctionHouseConfig, functionName: "minBidIncrementPercentage" },
        ],
        allowFailure: false,
      });

    const nowS = BigInt(Math.floor(Date.now() / 1000));

    const minNextBid = bigIntMax(
      reservePrice,
      highestBid + (highestBid * BigInt(minBidIncrementPercentage)) / BigInt(100)
    );

    if (nounId !== auctionNounId || nowS > endTime) {
      // Auction must be active
      return new CustomTransactionValidationError("AUCTION_ENDED", "This auction has ended.");
    } else if (bidAmount < minNextBid) {
      // Must be above min bid amount
      return new CustomTransactionValidationError(
        "BID_AMOUNT_TOO_LOW",
        `The bid amount must be ${formatNumber(formatEther(minNextBid), 6)} or more.`
      );
    }

    return null;
  }

  async function createBid(nounId: bigint, bidAmount: bigint) {
    const request = {
      to: nounsAuctionHouseConfig.address,
      data: encodeFunctionData({
        abi: nounsAuctionHouseConfig.abi,
        functionName: "createBid",
        args: [nounId, CLIENT_ID],
      }),
      value: bidAmount,
      gasFallback: BigInt(100000), // Bid generally ~60k
    };

    return sendTransaction(request, () => createBidValidation(nounId, bidAmount));
  }

  return { createBid, ...other };
}
