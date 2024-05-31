"use server";
import { Address } from "viem";
import { CHAIN_CONFIG } from "../../utils/config";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { Noun } from "./types";
import { getNounById } from "./getNounById";

const query = graphql(/* GraphQL */ `
  query NounIdsForAccountQuery($address: ID!) {
    account(id: $address) {
      nouns(first: 1000) {
        id
      }
    }
  }
`);

export async function getNounsForAddress(address: Address): Promise<Noun[]> {
  const queryResult = await graphQLFetchWithFallback(
    CHAIN_CONFIG.subgraphUrl,
    query,
    {
      address: address.toString().toLowerCase(),
    },
    { next: { revalidate: 60 } }
  );

  const ids = queryResult.account?.nouns.map((noun) => noun.id) ?? [];

  const nouns = await Promise.all(ids.map((id) => getNounById(id)));

  // Filter out any undefined
  const nounsFiltered = nouns.filter((noun) => noun !== undefined) as Noun[];

  if (nouns.length !== nounsFiltered.length) {
    console.error(`getNounsForAddress: some nouns not found - ${nouns.length - nounsFiltered.length}`);
  }

  // Sort by id, descending
  nounsFiltered.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));

  return nounsFiltered;
}
