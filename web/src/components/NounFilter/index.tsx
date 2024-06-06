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
      <Button variant="secondary" className="w-fit md:hidden" onClick={() => setIsOpen(true)}>
        Filter
      </Button>
      <div
        className={cn(
          "shrink-0 flex-col gap-2",
          "fixed left-0 top-0 z-50 hidden h-full w-full overflow-y-auto bg-white p-6 pb-[104px]", // sm
          "md:static md:flex md:max-w-[280px] md:overflow-hidden md:p-0", // md
          isOpen ? "flex" : "hidden"
        )}
      >
        <div className="flex w-full items-center justify-between">
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
