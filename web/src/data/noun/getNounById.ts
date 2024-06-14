"use server";
import { Noun } from "./types";
import { checkForAllNounRevalidation, forceAllNounRevalidation, getAllNouns } from "./getAllNouns";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/config";
import { transformQueryNounToNoun } from "./helpers";

const query = graphql(/* GraphQL */ `
  query NounById($id: ID!) {
    noun(id: $id) {
      id
      owner {
        id
      }
      seed {
        background
        body
        accessory
        head
        glasses
      }
    }
  }
`);

export async function getNounByIdUncached(id: string): Promise<Noun | undefined> {
  const response = await graphQLFetchWithFallback(CHAIN_CONFIG.subgraphUrl, query, { id }, { next: { revalidate: 0 } });
  const noun = response ? transformQueryNounToNoun(response.noun as any) : undefined;

  return noun;
}

// Use all nouns for cached version (minimized queries)
export async function getNounById(id: string): Promise<Noun | undefined> {
  const allNouns = await getAllNouns();
  let noun = allNouns.find((noun) => noun.id === id);

  if (!noun) {
    // Revalidate all nouns if we have a new noun so will show in explorer on next load
    await checkForAllNounRevalidation(id);
    const allNouns = await getAllNouns();
    noun = allNouns.find((noun) => noun.id === id);
  }

  if (!noun) {
    console.error("getNounById - Error can't find Noun", id);
  }

  return noun;
}
