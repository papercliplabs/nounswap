"use client";
import NounCard from "../NounCard";
import { useMemo } from "react";
import { Noun } from "@/data/noun/types";
import AnimationGird from "./AnimationGrid";
import { LinkShallow } from "../ui/link";

interface NounGridInterface {
  nouns: Noun[];
  onClearAllFilters: () => void;
}

export default function NounGrid({ nouns, onClearAllFilters }: NounGridInterface) {
  const nounCards = useMemo(() => {
    return nouns.map((noun, i) => ({
      element: (
        <LinkShallow searchParam={{ name: "nounId", value: noun.id }} key={i} className="h-full w-full">
          <NounCard noun={noun} enableHover key={i} lazyLoad />
        </LinkShallow>
      ) as React.ReactNode,
      id: Number(noun.id),
    }));
  }, [nouns]);

  return (
    <>
      {nounCards.length == 0 ? (
        <div className="flex h-fit grow flex-col items-center justify-center gap-2 rounded-3xl border-4 border-gray-200 py-24">
          <h4>No Nouns found.</h4>
          <button className="text-semantic-accent hover:brightness-[85%]" onClick={onClearAllFilters}>
            <h6>Clear all filters</h6>
          </button>
        </div>
      ) : (
        <AnimationGird items={nounCards} />
      )}
    </>
  );
}
