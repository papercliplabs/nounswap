import { CHAIN_CONFIG } from "@/config";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { Noun } from "./types";
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from "@/utils/constants";
import { AllNounsQuery } from "../generated/gql/graphql";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { getAddress } from "viem";
import { unstable_cache } from "next/cache";

const { palette } = ImageData;

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

const runPaginatedNounsQuery = unstable_cache(runPaginatedNounsQueryUncached, ["run-paginated-nouns-query"], {
  revalidate: SECONDS_PER_HOUR,
});

function buildBase64Image(
  parts: {
    data: string;
  }[],
  bgColor?: string | undefined
) {
  const svgBinary = buildSVG(parts, palette, bgColor);
  const svgBase64 = btoa(svgBinary);
  return "data:image/svg+xml;base64," + svgBase64;
}

function extractNameFromFileName(filename: string) {
  return filename.substring(filename.indexOf("-") + 1);
}

// Async just so we can cache
async function transformQueryNounToNounUncached(queryNoun: AllNounsQuery["nouns"][0]): Promise<Noun> {
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

  const backgroundImage = buildBase64Image([{ data: "0x0" }], background);
  const bodyImage = buildBase64Image([bodyPart], background);
  const accessoryImage = buildBase64Image([accessoryPart], background);
  const headImage = buildBase64Image([headPart], background);
  const glassesImage = buildBase64Image([glassesPart], background);

  const fullImage = buildBase64Image(parts, background);

  return {
    id: queryNoun.id,
    owner: getAddress(queryNoun.owner.id),
    imageSrc: fullImage,
    traits: {
      background: {
        seed: seed.background,
        name: queryNoun.seed.background == "0" ? "Cool" : "Warm",
        imageSrc: backgroundImage,
        color: "#" + background,
      },
      body: {
        seed: seed.body,
        name: extractNameFromFileName(bodyPart.filename),
        imageSrc: bodyImage,
      },
      accessory: {
        seed: seed.accessory,
        name: extractNameFromFileName(accessoryPart.filename),
        imageSrc: accessoryImage,
      },
      head: {
        seed: seed.head,
        name: extractNameFromFileName(headPart.filename),
        imageSrc: headImage,
      },
      glasses: {
        seed: seed.glasses,
        name: extractNameFromFileName(glassesPart.filename),
        imageSrc: glassesImage,
      },
    },
  };
}

// Cache forever
const transformQueryNounToNoun = unstable_cache(transformQueryNounToNounUncached, ["transform-query-noun-to-noun"]);

export async function getAllNouns(): Promise<Noun[]> {
  const queryResponse = await runPaginatedNounsQuery();
  const nouns = await Promise.all(queryResponse.map(transformQueryNounToNoun));

  // Sort by id, descending
  nouns.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));

  return nouns;
}
