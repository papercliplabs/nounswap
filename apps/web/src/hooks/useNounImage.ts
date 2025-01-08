import { useMemo } from "react";
import { Noun } from "@/data/noun/types";
import { buildNounImage, NounImageType } from "@/utils/nounImage";

export function useNounImage(imageType: NounImageType, noun?: Noun): string | undefined {
  return useMemo(() => {
    return noun ? buildNounImage(noun.traits, imageType) : undefined;
  }, [noun, imageType]);
}
