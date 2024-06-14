"use server";
import { BigIntString } from "@/utils/types";
import { CHAIN_CONFIG } from "@/config";
import { unstable_cache } from "next/cache";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { checkForAllNounRevalidation } from "../noun/getAllNouns";

const query = graphql(/* GraphQL */ `
  query CurrentAuctionId {
    auctions(orderBy: endTime, orderDirection: desc, first: 1) {
      id
    }
  }
`);

async function getCurrentAuctionNounIdUncached(): Promise<BigIntString> {
  const { auctions } = await graphQLFetchWithFallback(CHAIN_CONFIG.subgraphUrl, query, {}, { next: { revalidate: 0 } });
  return auctions[0].id;
}

export const getCurrentAuctionNounId = unstable_cache(
  getCurrentAuctionNounIdUncached,
  ["get-current-auction-noun-id", CHAIN_CONFIG.chain.id.toString()],
  { revalidate: 2 }
);
