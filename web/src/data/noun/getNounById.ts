"use server";
import { Noun } from "./types";
import { getAllNouns, transformQueryNounToNounUncached } from "./getAllNouns";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/config";

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
  const noun = response ? await transformQueryNounToNounUncached(response.noun as any) : undefined;

  return noun;
}

// Use all nouns for cached version (minimized queries)
export async function getNounById(id: string): Promise<Noun | undefined> {
  const allNouns = await getAllNouns();

  const noun = allNouns.find((noun) => noun.id === id);
  return noun;
}
