"use client";
import NounGrid from "./NounGrid/NounGrid";
import { Noun } from "@/data/noun/types";
import NounDialog from "./dialog/NounDialog";
import NounFilter from "./NounFilter";
import { Suspense } from "react";
import { Button } from "./ui/button";
import { ActiveFilters } from "./NounFilter/ActiveFilters";

interface NounSelectProps {
  nouns: Noun[];
}

export default function NounExplorer({ nouns }: NounSelectProps) {
  return (
    <>
      <NounDialog nouns={nouns} />
      <div className="flex w-full flex-col gap-[30px] md:flex-row md:gap-10">
        <Suspense>
          <NounFilter />
        </Suspense>
        <Suspense>
          <div className="flex w-full min-w-0 flex-col gap-4">
            <ActiveFilters />
            <NounGrid nouns={nouns} />
          </div>
        </Suspense>
      </div>
    </>
  );
}
