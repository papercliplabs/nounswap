"use server";
import { BigIntString } from "@/utils/types";
import { CHAIN_CONFIG } from "@/config";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";

const query = graphql(/* GraphQL */ `
  query CurrentAuctionId {
    auctions(orderBy: endTime, orderDirection: desc, first: 1) {
      id
    }
  }
`);

export async function getCurrentAuctionNounId(): Promise<BigIntString> {
  const { auctions } = await graphQLFetchWithFallback(CHAIN_CONFIG.subgraphUrl, query, {}, { next: { revalidate: 2 } });
  return auctions[0].id;
}
