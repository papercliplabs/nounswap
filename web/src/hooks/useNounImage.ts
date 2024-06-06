import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { useMemo } from "react";
import { Noun, NounTraitType } from "@/data/noun/types";

export type NounImageType = "full" | NounTraitType;

const { palette } = ImageData;

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

function buildNounImage(noun: Noun, imageType: NounImageType): string {
  const seed = {
    background: noun.traits.background.seed,
    body: noun.traits.body.seed,
    accessory: noun.traits.accessory.seed,
    head: noun.traits.head.seed,
    glasses: noun.traits.glasses.seed,
  };

  const { parts, background } = getNounData(seed);
  const [bodyPart, accessoryPart, headPart, glassesPart] = parts;

  switch (imageType) {
    case "full":
      return buildBase64Image(parts, background);
    case "body":
      return buildBase64Image([bodyPart], background);
    case "accessory":
      return buildBase64Image([accessoryPart], background);
    case "head":
      return buildBase64Image([headPart], background);
    case "glasses":
      return buildBase64Image([glassesPart], background);
    case "background":
      return buildBase64Image([{ data: "0x0" }], background);
    default:
      return "";
  }
}

export function useNounImage(imageType: NounImageType, noun?: Noun): string | undefined {
  return useMemo(() => {
    return noun ? buildNounImage(noun, imageType) : undefined;
  }, [noun, imageType]);
}
