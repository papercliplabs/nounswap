import { Suspense } from "react";
import { LinkExternal } from "@/components/ui/link";
import Auction from "@/components/Auction";
import { getAllNouns } from "@/data/noun/getAllNouns";
import { getFrameMetadata } from "frog/next";
import JustSwapItAdvertisingBanner from "@/components/AdvertisingBanner/JustSwapItAdvertisingBanner";
import NounFilter from "@/components/NounFilter";
import { ActiveFilters } from "@/components/NounFilter/ActiveFilters";
import NounGrid from "@/components/NounGrid/NounGrid";
import NounDialog from "@/components/dialog/NounDialog";
import AnimationGird from "@/components/NounGrid/AnimationGrid";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata({ searchParams }: { searchParams?: Record<string, string> }) {
  const noFrame = searchParams?.["no-frame"] != undefined;
  const frameMetadata = await getFrameMetadata(`https://frames.paperclip.xyz/nounish-auction/v2/nouns`);

  // Only take fc:frame tags (not og image overrides)
  const filteredFrameMetadata = Object.fromEntries(
    Object.entries(frameMetadata).filter(([k]) => k.includes("fc:frame"))
  );
  return {
    title: "Explore Nouns",
    description: "See all the Nouns or Swap for one from the Nouns treasury.",
    other: noFrame ? {} : filteredFrameMetadata,
  };
}

export default function ExplorePage() {
  return (
    <>
      <div className="flex w-full flex-col gap-5">
        <Auction />
        <JustSwapItAdvertisingBanner />
      </div>
      <div>
        <h2 className="pb-1">Explore Nouns</h2>
        <div className="paragraph-lg">
          See all the Nouns or Swap for one from the{" "}
          <LinkExternal href="https://etherscan.io/tokenholdings?a=0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71">
            Nouns treasury.
          </LinkExternal>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[30px] md:flex-row">
        <Suspense>
          <NounFilter />
        </Suspense>
        <div className="flex w-full min-w-0 flex-col">
          <Suspense>
            <ActiveFilters />
          </Suspense>
          <div className="pt-2">
            <Suspense
              fallback={
                <AnimationGird
                  items={Array(40)
                    .fill(0)
                    .map((_, i) => ({
                      element: (
                        <Skeleton className="bg-background-secondary relative flex aspect-square h-full w-full rounded-2xl" />
                      ),
                      id: i,
                    }))}
                />
              }
            >
              <NounGridWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

async function NounGridWrapper() {
  const allNouns = await getAllNouns();

  return (
    <>
      <NounGrid nouns={allNouns} />
      <NounDialog nouns={allNouns} />
    </>
  );
}
