"use client";
import { Accordion } from "@/components/ui/accordion";
import { NounTrait } from "@/data/noun/types";
import { capitalizeFirstLetterOfEveryWord } from "@/utils/format";
import { ImageData } from "@nouns/assets";
import { FilterSection } from "./FilterSection";
import { Separator } from "../../ui/separator";
import TreasuryNounFilter from "./TreasuryNounFilter";
import { ClearAllFiltersButton } from "./ClearAllFiltersButton";
import { Button } from "../../ui/button";
import { useState } from "react";
import { cn } from "@/utils/shadcn";
import InstantSwapFilter from "./InstantSwapFilter";
import { useNounFilters } from "@/hooks/useNounFilters";
import clsx from "clsx";
import BuyNowFilter from "./BuyNowFilter";

export const BACKGROUND_TRAITS: NounTrait[] = [
  { name: "Cool", seed: 0 },
  { name: "Warm", seed: 1 },
];

export const GLASSES_TRAITS: NounTrait[] = ImageData.images.glasses.map((item, i) => ({
  name: capitalizeFirstLetterOfEveryWord(
    item.filename
      .substring(item.filename.indexOf("-") + 1)
      .split("-")
      .join(" ")
  ),
  seed: i,
}));

export const HEAD_TRAITS: NounTrait[] = ImageData.images.heads.map((item, i) => ({
  name: capitalizeFirstLetterOfEveryWord(
    item.filename
      .substring(item.filename.indexOf("-") + 1)
      .split("-")
      .join(" ")
  ),
  seed: i,
}));

export const BODY_TRAITS: NounTrait[] = ImageData.images.bodies.map((item, i) => ({
  name: capitalizeFirstLetterOfEveryWord(
    item.filename
      .substring(item.filename.indexOf("-") + 1)
      .split("-")
      .join(" ")
  ),
  seed: i,
}));

export const ACCESSORY_TRAITS: NounTrait[] = ImageData.images.accessories.map((item, i) => ({
  name: capitalizeFirstLetterOfEveryWord(
    item.filename
      .substring(item.filename.indexOf("-") + 1)
      .split("-")
      .join(" ")
  ),
  seed: i,
}));

export default function NounFilter({ numNouns }: { numNouns: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { totalCount } = useNounFilters();
  return (
    <>
      <div className="sticky top-0 z-[10] flex max-h-[100dvh] min-h-[60px] shrink-0 md:h-auto md:pb-[0px]">
        <div
          className={cn(
            "label-sm top-0 z-[10] flex w-screen items-end justify-between bg-white py-2 md:hidden md:w-full"
          )}
        >
          <Button variant="secondary" className="w-fit" onClick={() => setIsOpen(true)}>
            Filters • {totalCount}
          </Button>
          <div>
            <h6>{numNouns} nouns</h6>
          </div>
        </div>
        <div
          className={cn(
            "shrink-0 flex-col gap-2 overflow-y-auto",
            "fixed left-0 top-0 z-[50] hidden h-full w-full bg-white px-6 pb-[104px] pt-4 transition-all", // sm
            "animate-in slide-in-from-bottom",
            "md:static md:flex md:max-w-[280px] md:animate-none md:p-0 md:pr-2", // md
            isOpen ? "flex" : "hidden",
            "md:flex"
          )}
        >
          <div className="top-0 z-[50] flex w-full items-center justify-between bg-white pt-3">
            <h3>Filter</h3>
            <ClearAllFiltersButton className="text-semantic-accent clickable-active hidden md:flex">
              Clear all
            </ClearAllFiltersButton>
          </div>
          <Separator className="h-[2px]" />
          <div>
            <BuyNowFilter />
            <span className="paragraph-sm text-content-secondary">
              Show Nouns that are listed on secondary that you you can buy now.
            </span>
          </div>
          <Separator className="h-[2px]" />
          <div>
            <InstantSwapFilter />
            <span className="paragraph-sm text-content-secondary">
              Show Nouns available for instant Swap via $nouns.
            </span>
          </div>
          <Separator className="h-[2px]" />
          <div>
            <TreasuryNounFilter />
            <span className="paragraph-sm text-content-secondary">
              Show Nouns held by the Treasury you can create a swap offer for.
            </span>
          </div>
          <Accordion type="multiple">
            <FilterSection traitType="background" traits={BACKGROUND_TRAITS} />
            <FilterSection traitType="glasses" traits={GLASSES_TRAITS} />
            <FilterSection traitType="head" traits={HEAD_TRAITS} />
            <FilterSection traitType="body" traits={BODY_TRAITS} />
            <FilterSection traitType="accessory" traits={ACCESSORY_TRAITS} />
          </Accordion>
        </div>
      </div>
      <div
        className={clsx(
          "border-border-secondary fixed bottom-0 left-0 z-[100] flex w-full justify-between border-t-2 bg-white px-6 py-2 md:hidden",
          isOpen ? "flex md:hidden" : "hidden"
        )}
      >
        <ClearAllFiltersButton className="text-semantic-accent clickable-active">Clear all</ClearAllFiltersButton>
        <Button className="w-fit md:hidden" onClick={() => setIsOpen(false)}>
          Done
        </Button>
      </div>
    </>
  );
}
