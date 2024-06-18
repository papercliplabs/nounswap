"use server";
import { CHAIN_CONFIG } from "@/config";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { Noun } from "./types";
import { AllNounsQuery } from "../generated/gql/graphql";
import { getNounData } from "@nouns/assets";
import { getAddress } from "viem";
import { revalidateTag, unstable_cache } from "next/cache";
import { transformQueryNounToNoun } from "./helpers";
import { SECONDS_PER_HOUR } from "@/utils/constants";

const BATCH_SIZE = 1000;

const query = graphql(/* GraphQL */ `
  query AllNouns($batchSize: Int!, $skip: Int!) {
    nouns(first: $batchSize, skip: $skip) {
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

async function runPaginatedNounsQueryUncached() {
  console.log("CACHE MISS");
  let queryNouns: AllNounsQuery["nouns"] = [];
  let skip = 0;

  while (true) {
    const response = await graphQLFetchWithFallback(
      CHAIN_CONFIG.subgraphUrl,
      query,
      { batchSize: BATCH_SIZE, skip },
      { next: { revalidate: 0 } }
    );
    const responseNouns = response.nouns;
    queryNouns = queryNouns.concat(responseNouns);

    if (responseNouns.length == BATCH_SIZE) {
      skip += BATCH_SIZE;
    } else {
      break;
    }
  }

  return queryNouns;
}

const runPaginatedNounsQuery = unstable_cache(
  runPaginatedNounsQueryUncached,
  ["run-paginated-nouns-query", CHAIN_CONFIG.chain.id.toString()],
  {
    revalidate: 5 * 60, // 5min
    tags: [`paginated-nouns-query-${CHAIN_CONFIG.chain.id.toString()}`],
  }
);

export async function getAllNounsUncached(): Promise<Noun[]> {
  const queryResponse = await runPaginatedNounsQueryUncached();
  const nouns = queryResponse.map(transformQueryNounToNoun);

  // Sort by id, descending
  nouns.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));

  return nouns;
}

export async function getAllNouns(): Promise<Noun[]> {
  const queryResponse = await runPaginatedNounsQuery();
  const nouns = queryResponse.map(transformQueryNounToNoun);

  // Sort by id, descending
  nouns.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));

  return nouns;
}

export async function forceAllNounRevalidation() {
  revalidateTag(`paginated-nouns-query-${CHAIN_CONFIG.chain.id.toString()}`);
}

export async function checkForAllNounRevalidation(nounId: string) {
  const allNouns = await getAllNouns();
  if (allNouns[0]?.id && BigInt(allNouns[0].id) < BigInt(nounId)) {
    forceAllNounRevalidation();
  }
}
