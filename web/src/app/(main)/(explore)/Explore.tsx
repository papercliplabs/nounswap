"use client";
import NounGrid from "@/components/NounGrid/NounGrid";
import NounDialog from "@/components/dialog/NounDialog";
import NounFilter from "@/components/NounFilter";
import { ActiveFilters } from "@/components/NounFilter/ActiveFilters";
import { Noun } from "@/data/noun/types";

interface ExploreProps {
  nouns: Noun[];
}

export default function Explore({ nouns }: ExploreProps) {
  return (
    <>
      <div className="flex w-full flex-col items-start gap-[30px] md:flex-row">
        <NounFilter />
        <div className="flex w-full min-w-0 flex-col">
          <ActiveFilters />
          <NounGrid nouns={nouns} />
        </div>
      </div>
      <NounDialog nouns={nouns} />
    </>
  );
}
