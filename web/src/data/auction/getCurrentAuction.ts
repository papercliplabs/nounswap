"use server";
import { BigIntString } from "@/utils/types";
import { Auction } from "./types";
import { readContract } from "viem/actions";
import { CHAIN_CONFIG } from "@/utils/config";
import { nounsAuctionHouseConfig } from "../generated/wagmi";
import { unstable_cache } from "next/cache";
import { getProtocolParams } from "../protocol/getProtocolParams";
import { getAuctionByIdUncached } from "./getAuctionById";
import { bigIntMax } from "@/utils/bigint";

export interface CurrentAuction extends Auction {
  nextMinBid: BigIntString;
}

async function getCurrentAuctionNounIdUncached(): Promise<BigIntString> {
  const { nounId } = await readContract(CHAIN_CONFIG.publicClient, {
    ...nounsAuctionHouseConfig,
    functionName: "auction",
  });

  return nounId.toString();
}

const getCurrentAuctionNounId = unstable_cache(getCurrentAuctionNounIdUncached, ["get-current-auction-noun-id"], {
  revalidate: 5,
});

export async function getCurrentAuction(): Promise<CurrentAuction> {
  const [id, params] = await Promise.all([getCurrentAuctionNounId(), getProtocolParams()]);
  const auction = await getAuctionByIdUncached(id);

  if (!auction) {
    throw new Error("No current auction found");
  }

  const highestBidAmount = auction.bids.length > 0 ? BigInt(auction.bids[0].amount) : BigInt(0);
  const nextMinBid = bigIntMax(
    BigInt(params.reservePrice),
    highestBidAmount + (highestBidAmount * BigInt(params.minBidIncrementPercentage)) / BigInt(100)
  );

  return { ...auction, nextMinBid: nextMinBid.toString() };
}
