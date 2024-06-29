"use client";
import NounCard from "../../NounCard";
import { useMemo } from "react";
import { Noun } from "@/data/noun/types";
import AnimationGird from "./AnimationGrid";
import { LinkShallow } from "../../ui/link";
import { useSearchParams } from "next/navigation";
import { isAddressEqual } from "viem";
import { CHAIN_CONFIG } from "@/config";
import { ClearAllFiltersButton } from "../NounFilter/ClearAllFiltersButton";
import { ONLY_TREASURY_NOUNS_FILTER_KEY } from "../NounFilter/TreasuryNounFilter";
import { INSTANT_SWAP_FILTER_KEY } from "../NounFilter/InstantSwapFilter";

interface NounGridInterface {
  nouns: Noun[];
}

export default function NounGrid({ nouns }: NounGridInterface) {
  const nounCards = useMemo(() => {
    return nouns.map((noun, i) => ({
      element: (
        <LinkShallow
          searchParam={{ name: "nounId", value: noun.id }}
          key={i}
          className="block aspect-square h-full w-full"
        >
          <NounCard noun={noun} enableHover key={i} lazyLoad />
        </LinkShallow>
      ) as React.ReactNode,
      id: Number(noun.id),
    }));
  }, [nouns]);

  return (
    <div className="relative min-h-[calc(100vh-108px)] w-full pb-[100px] md:min-h-[calc(100vh-64px)]">
      {nounCards.length == 0 ? (
        <div className="flex h-fit grow flex-col items-center justify-center gap-2 rounded-3xl border-4 border-gray-200 px-4 py-24 text-center">
          <h4>No Nouns found.</h4>
          <ClearAllFiltersButton className="heading-6 text-semantic-accent clickable-active">
            Clear all filters
          </ClearAllFiltersButton>
        </div>
      ) : (
        <AnimationGird items={nounCards} />
      )}
    </div>
  );
}
