import { CHAIN_CONFIG } from "@/config";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { Noun } from "./types";
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from "@/utils/constants";
import { AllNounsQuery } from "../generated/gql/graphql";
import { getNounData } from "@nouns/assets";
import { getAddress } from "viem";
import { revalidateTag, unstable_cache } from "next/cache";

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
  let queryNouns: AllNounsQuery["nouns"] = [];
  let skip = 0;

  while (true) {
    const response = await graphQLFetchWithFallback(
      CHAIN_CONFIG.subgraphUrl,
      query,
      { batchSize: BATCH_SIZE, skip },
      { next: { revalidate: SECONDS_PER_DAY / 2 } }
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
    revalidate: SECONDS_PER_HOUR,
    tags: [`paginated-nouns-query-${CHAIN_CONFIG.chain.id.toString()}`],
  }
);

function extractNameFromFileName(filename: string) {
  return filename.substring(filename.indexOf("-") + 1);
}

// Async just so we can cache
export async function transformQueryNounToNounUncached(queryNoun: AllNounsQuery["nouns"][0]): Promise<Noun> {
  if (!queryNoun.seed) {
    throw new Error("Seed not found");
  }

  const seed = {
    background: Number(queryNoun.seed.background),
    body: Number(queryNoun.seed.body),
    accessory: Number(queryNoun.seed.accessory),
    head: Number(queryNoun.seed.head),
    glasses: Number(queryNoun.seed.glasses),
  };

  const { parts, background } = getNounData(seed);
  const [bodyPart, accessoryPart, headPart, glassesPart] = parts;

  return {
    id: queryNoun.id,
    owner: getAddress(queryNoun.owner.id),
    traits: {
      background: {
        seed: seed.background,
        name: queryNoun.seed.background == "0" ? "Cool" : "Warm",
      },
      body: {
        seed: seed.body,
        name: extractNameFromFileName(bodyPart.filename),
      },
      accessory: {
        seed: seed.accessory,
        name: extractNameFromFileName(accessoryPart.filename),
      },
      head: {
        seed: seed.head,
        name: extractNameFromFileName(headPart.filename),
      },
      glasses: {
        seed: seed.glasses,
        name: extractNameFromFileName(glassesPart.filename),
      },
    },
  };
}

// Cache forever
const transformQueryNounToNoun = unstable_cache(transformQueryNounToNounUncached, [
  "transform-query-noun-to-noun",
  CHAIN_CONFIG.chain.id.toString(),
]);

export async function getAllNouns(): Promise<Noun[]> {
  const queryResponse = await runPaginatedNounsQuery();
  const nouns = await Promise.all(queryResponse.map(transformQueryNounToNoun));

  // Sort by id, descending
  nouns.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));

  return nouns;
}

export async function checkForAllNounRevalidation(nounId: string) {
  const allNouns = await getAllNouns();
  if (allNouns[allNouns.length - 1].id != nounId) {
    revalidateTag(`paginated-nouns-query-${CHAIN_CONFIG.chain.id.toString()}`);
  }
}
