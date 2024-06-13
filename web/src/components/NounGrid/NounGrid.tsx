"use client";
import NounCard from "../NounCard";
import { useMemo } from "react";
import { Noun } from "@/data/noun/types";
import AnimationGird from "./AnimationGrid";
import { LinkShallow } from "../ui/link";
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
  const searchParams = useSearchParams();

  const filteredNouns = useMemo(() => {
    const backgroundFilters = searchParams.getAll("background[]");
    const headFilters = searchParams.getAll("head[]");
    const glassesFilters = searchParams.getAll("glasses[]");
    const bodyFilters = searchParams.getAll("body[]");
    const accessoryFilters = searchParams.getAll("accessory[]");
    const treasuryNounsOnly = searchParams.get(ONLY_TREASURY_NOUNS_FILTER_KEY);
    const instantSwap = searchParams.get(INSTANT_SWAP_FILTER_KEY);

    return nouns.filter((noun) => {
      const backgroundMatch =
        backgroundFilters.length === 0 || backgroundFilters.includes(noun.traits.background.seed.toString());
      const headMatch = headFilters.length === 0 || headFilters.includes(noun.traits.head.seed.toString());
      const glassesMatch = glassesFilters.length === 0 || glassesFilters.includes(noun.traits.glasses.seed.toString());
      const bodyMatch = bodyFilters.length === 0 || bodyFilters.includes(noun.traits.body.seed.toString());
      const accessoryMatch =
        accessoryFilters.length === 0 || accessoryFilters.includes(noun.traits.accessory.seed.toString());
      const treasuryNounMatch = !treasuryNounsOnly || isAddressEqual(noun.owner, CHAIN_CONFIG.addresses.nounsTreasury);
      const instantSwapMatch = !instantSwap || isAddressEqual(noun.owner, CHAIN_CONFIG.addresses.nounsErc20);

      return (
        backgroundMatch &&
        headMatch &&
        glassesMatch &&
        bodyMatch &&
        accessoryMatch &&
        treasuryNounMatch &&
        instantSwapMatch
      );
    });
  }, [searchParams, nouns]);

  const nounCards = useMemo(() => {
    return filteredNouns.map((noun, i) => ({
      element: (
        <LinkShallow searchParam={{ name: "nounId", value: noun.id }} key={i} className="aspect-square w-full">
          <NounCard noun={noun} enableHover key={i} lazyLoad />
        </LinkShallow>
      ) as React.ReactNode,
      id: Number(noun.id),
    }));
  }, [filteredNouns]);

  return (
    <div className="relative min-h-[calc(100vh-116px)] w-full pb-[100px] md:min-h-[calc(100vh-64px)]">
      <h6 className="absolute -top-[80px] right-0 -translate-y-full">{nounCards.length} nouns</h6>
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
