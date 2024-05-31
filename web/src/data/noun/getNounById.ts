"use server";
import { getAddress } from "viem";
import { CHAIN_CONFIG } from "@/utils/config";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { Noun } from "./types";
import { getNounImageAndTraitsById } from "./getNounImageAndTraitsBySeed";

const query = graphql(/* GraphQL */ `
  query NounOwnerById($id: ID!) {
    noun(id: $id) {
      owner {
        id
      }
    }
  }
`);

export async function getNounById(id: string): Promise<Noun | undefined> {
  const [result, imageAndTraits] = await Promise.all([
    graphQLFetchWithFallback(CHAIN_CONFIG.subgraphUrl, query, { id }, { next: { revalidate: 60 } }),
    getNounImageAndTraitsById(id),
  ]);

  const ownerResult = result.noun?.owner;
  if (ownerResult && imageAndTraits) {
    const owner = getAddress(ownerResult.id);

    return {
      id,
      owner,
      ...imageAndTraits,
    };
  } else {
    console.error(`getNounById: noun not found - ${id}, ${ownerResult}, ${imageAndTraits}`);
    return undefined;
  }
}
