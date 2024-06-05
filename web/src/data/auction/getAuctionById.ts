"use server";
import { unstable_cache } from "next/cache";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/config";
import { BigIntString } from "@/utils/types";
import { Auction, Bid } from "./types";
import { getAddress } from "viem";

const query = graphql(/* GraphQL */ `
  query Auction($id: ID!) {
    auction(id: $id) {
      id
      noun {
        id
      }
      amount
      startTime
      endTime
      bidder {
        id
      }
      clientId
      settled
      bids {
        bidder {
          id
        }
        amount
      }
    }
  }
`);

export async function getAuctionByIdUncached(id: BigIntString): Promise<Auction | null> {
  const { auction } = await graphQLFetchWithFallback(
    CHAIN_CONFIG.subgraphUrl,
    query,
    { id },
    { next: { revalidate: 0 } }
  );

  if (!auction) {
    if (BigInt(id) % BigInt(10) != BigInt(0)) {
      // Every 10 goes to nounders, so we expect these to be missing
      console.error("getAuctionByIdUncached - no auction found", id);
    }
    return null;
  }

  const bids: Bid[] = auction.bids.map((bid: any) => ({
    bidderAddress: getAddress(bid.bidder.id),
    amount: bid.amount,
  }));

  // Sort descending by amount
  bids.sort((a, b) => (BigInt(b.amount) > BigInt(a.amount) ? 1 : -1));

  const nowS = Date.now() / 1000;
  const ended = nowS > Number(auction.endTime);

  return {
    nounId: auction.noun.id,

    startTime: auction.startTime,
    endTime: auction.endTime,

    state: ended ? (auction.settled ? "ended-settled" : "ended-unsettled") : "live",

    bids,
  } as Auction;
}

// Cache forever, meant for historical auctions. See getCurrentAuction for current auctions.
export const getAuctionById = unstable_cache(getAuctionByIdUncached, ["get-auction-by-id"]);
