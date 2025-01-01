import React from "react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllNounsUncached } from "@/data/noun/getAllNouns";
import NounDialog from "@/components/dialog/NounDialog";
import NounExplorer from "@/components/NounExplorer";
import AnimationGird from "@/components/NounExplorer/NounGrid/AnimationGrid";
import { getSecondaryFloorListing } from "@/data/noun/getSecondaryNounListings";

export default async function Page() {
  return (
    <div className="flex w-full flex-col gap-12 p-6 md:p-10">
      <div>
        <h2 className="pb-1">Explore Nouns</h2>
        <div className="paragraph-lg">
          Explore all Nouns, filter by traits, instant swap, treasury Nouns and
          buy it now.
        </div>
      </div>
      <Suspense
        fallback={
          <div className="w-full">
            <AnimationGird
              items={Array(40)
                .fill(0)
                .map((_, i) => ({
                  element: (
                    <Skeleton className="relative flex aspect-square h-full w-full rounded-2xl bg-background-secondary" />
                  ),
                  id: i,
                }))}
            />
          </div>
        }
      >
        <NounExplorerWrapper />
      </Suspense>
    </div>
  );
}

async function NounExplorerWrapper() {
  const [allNouns, secondaryFloorListing] = await Promise.all([
    getAllNounsUncached(),
    getSecondaryFloorListing(),
  ]);

  return (
    <>
      <NounExplorer nouns={allNouns} />
      <NounDialog
        nouns={allNouns}
        secondaryFloorListing={secondaryFloorListing}
      />
    </>
  );
}
