import { NounSeed } from "@nouns/assets/dist/types";
import { buildSVG } from "@nouns/sdk";
import { ImageData, getNounData } from "@nouns/assets";
import { unstable_cache } from "next/cache";
import { NounTrait } from "./types";
import { graphql } from "../generated/gql";
import { graphQLFetchWithFallback } from "../utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/utils/config";

const { palette } = ImageData;

interface NounImageAndTraits {
  imageSrc: string;
  traits: {
    background: NounTrait;
    body: NounTrait;
    accessory: NounTrait;
    head: NounTrait;
    glasses: NounTrait;
  };
}

const query = graphql(/* GraphQL */ `
  query NounSeedsById($id: ID!) {
    noun(id: $id) {
      id
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

async function getNounImageAndTraitsByIdUncached(id: string): Promise<NounImageAndTraits | null> {
  const result = await graphQLFetchWithFallback(CHAIN_CONFIG.subgraphUrl, query, { id }, { cache: "no-store" });

  const seedResult = result.noun?.seed;
  if (!seedResult) {
    console.error(`getNounById: noun not found - ${id}`);
    return null;
  }

  const seed = {
    background: Number(seedResult.background),
    body: Number(seedResult.body),
    accessory: Number(seedResult.accessory),
    head: Number(seedResult.head),
    glasses: Number(seedResult.glasses),
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
    imageSrc: fullImage,
    traits: {
      background: {
        seed: seed.background,
        name: "Background",
        imageSrc: backgroundImage,
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

function buildBase64Image(
  parts: {
    data: string;
  }[],
  bgColor?: string | undefined
) {
  const svgBinary = buildSVG([parts[0]], palette, bgColor);
  const svgBase64 = btoa(svgBinary);
  return "data:image/svg+xml;base64," + svgBase64;
}

function extractNameFromFileName(filename: string) {
  return filename.substring(filename.indexOf("-") + 1);
}

// Cache forever
export const getNounImageAndTraitsById = unstable_cache(getNounImageAndTraitsByIdUncached, [
  "get-noun-image-and-traits-by-id",
]);
