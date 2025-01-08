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
import Icon from "@/components/ui/Icon";

export const BACKGROUND_TRAITS: NounTrait[] = [
  { name: "Cool", seed: 0 },
  { name: "Warm", seed: 1 },
];

export const GLASSES_TRAITS: NounTrait[] = ImageData.images.glasses.map(
  (item, i) => ({
    name: capitalizeFirstLetterOfEveryWord(
      item.filename
        .substring(item.filename.indexOf("-") + 1)
        .split("-")
        .join(" "),
    ),
    seed: i,
  }),
);

export const HEAD_TRAITS: NounTrait[] = ImageData.images.heads.map(
  (item, i) => ({
    name: capitalizeFirstLetterOfEveryWord(
      item.filename
        .substring(item.filename.indexOf("-") + 1)
        .split("-")
        .join(" "),
    ),
    seed: i,
  }),
);

export const BODY_TRAITS: NounTrait[] = ImageData.images.bodies.map(
  (item, i) => ({
    name: capitalizeFirstLetterOfEveryWord(
      item.filename
        .substring(item.filename.indexOf("-") + 1)
        .split("-")
        .join(" "),
    ),
    seed: i,
  }),
);

export const ACCESSORY_TRAITS: NounTrait[] = ImageData.images.accessories.map(
  (item, i) => ({
    name: capitalizeFirstLetterOfEveryWord(
      item.filename
        .substring(item.filename.indexOf("-") + 1)
        .split("-")
        .join(" "),
    ),
    seed: i,
  }),
);

export default function NounFilter({ numNouns }: { numNouns: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-[68px] left-1/2 z-10 flex h-12 -translate-x-1/2 items-center justify-center gap-2.5 rounded-full bg-content-primary px-6 text-white hover:bg-content-primary/90 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="filter" size={24} className="fill-white" />
        <span>Filter</span>
      </button>
      <div className="sticky top-[60px] z-[10] flex max-h-[100dvh] shrink-0 md:h-auto md:min-h-[60px] md:pb-[0px]">
        <div
          className={cn(
            "shrink-0 flex-col gap-2 overflow-y-auto",
            "fixed left-0 top-[64px] z-[110] hidden h-full w-full bg-white px-6 pb-[154px] pt-4 transition-all", // sm
            "animate-in slide-in-from-bottom",
            "md:static md:flex md:max-w-[280px] md:animate-none md:p-0 md:pr-2", // md
            isOpen ? "flex" : "hidden",
            "md:flex",
          )}
        >
          <div className="top-0 z-[50] flex w-full items-center justify-between bg-white pt-3">
            <h3>Filter</h3>
            <ClearAllFiltersButton className="hidden text-semantic-accent clickable-active md:flex">
              Clear all
            </ClearAllFiltersButton>
          </div>
          <Separator className="h-[2px]" />
          <div>
            <BuyNowFilter />
            <span className="text-content-secondary paragraph-sm">
              Show Nouns that are listed on secondary that you can buy now.
            </span>
          </div>
          <Separator className="h-[2px]" />
          <div>
            <InstantSwapFilter />
            <span className="text-content-secondary paragraph-sm">
              Show Nouns available for instant Swap via $nouns.
            </span>
          </div>
          <Separator className="h-[2px]" />
          <div>
            <TreasuryNounFilter />
            <span className="text-content-secondary paragraph-sm">
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
          "fixed bottom-0 left-0 z-[100] flex w-full justify-between border-t-2 border-border-secondary bg-white px-6 py-2 md:hidden",
          isOpen ? "flex md:hidden" : "hidden",
        )}
      >
        <ClearAllFiltersButton className="text-semantic-accent clickable-active">
          Clear all
        </ClearAllFiltersButton>
        <Button className="w-fit md:hidden" onClick={() => setIsOpen(false)}>
          Done
        </Button>
      </div>
    </>
  );
}
