"use client";
import { Accordion } from "@/components/ui/accordion";
import { NounTrait } from "@/data/noun/types";
import { capitalizeFirstLetterOfEveryWord } from "@/utils/format";
import { ImageData } from "@nouns/assets";
import { FilterSection } from "./FilterSection";
import { Separator } from "../ui/separator";
import TreasuryNounFilter from "./TreasuryNounFilter";
import { ClearAllFiltersButton } from "./ClearAllFiltersButton";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/utils/shadcn";

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

export default function NounFilter() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={cn("sticky top-0 z-[100] w-full bg-white py-2 md:hidden")}>
        <Button variant="secondary" className="w-fit" onClick={() => setIsOpen(true)}>
          Filter
        </Button>
      </div>
      <div
        className={cn(
          "top-0 h-screen shrink-0 flex-col gap-2 overflow-y-auto pb-[100px]",
          "fixed left-0 top-0 z-[100] hidden w-full bg-white px-6 pb-[104px] pt-4", // sm
          "md:sticky md:flex md:max-w-[280px] md:p-0 md:pr-2", // md
          isOpen ? "flex" : "hidden"
        )}
      >
        <div className="top-0 z-[100] flex w-full items-center justify-between bg-white pt-3 md:sticky">
          <h3>Filter</h3>
          <ClearAllFiltersButton className="text-semantic-accent clickable-active hidden md:flex">
            Clear all
          </ClearAllFiltersButton>
        </div>
        <Separator className="h-[2px]" />
        <div>
          <TreasuryNounFilter />
          <span className="paragraph-sm text-content-secondary">
            You can create a swap offer with the Treasury Nouns.
          </span>
        </div>
        <Accordion type="multiple">
          <FilterSection traitType="background" traits={BACKGROUND_TRAITS} />
          <FilterSection traitType="glasses" traits={GLASSES_TRAITS} />
          <FilterSection traitType="head" traits={HEAD_TRAITS} />
          <FilterSection traitType="body" traits={BODY_TRAITS} />
          <FilterSection traitType="accessory" traits={ACCESSORY_TRAITS} />
        </Accordion>
        <div className="fixed bottom-0 left-0 flex w-full justify-between bg-white px-6 py-4 md:hidden">
          <ClearAllFiltersButton className="text-semantic-accent clickable-active">Clear all</ClearAllFiltersButton>
          <Button className="w-fit md:hidden" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
