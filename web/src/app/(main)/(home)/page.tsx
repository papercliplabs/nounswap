import Auction from "@/components/Auction";
import { getFrameMetadata } from "frog/next";
import React from "react";
import { Suspense } from "react";
import { LinkExternal } from "@/components/ui/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllNounsUncached } from "@/data/noun/getAllNouns";
import NounDialog from "@/components/dialog/NounDialog";
import FeatureHighlight from "@/components/FeatureHighlight";
import NounExplorer from "@/components/NounExplorer";
import AnimationGird from "@/components/NounExplorer/NounGrid/AnimationGrid";
import ExternalFeaturedCarousel from "@/components/ExternalFeaturedCarousel";
import { getSecondaryFloorListing } from "@/data/noun/getSecondaryNounListings";

export async function generateMetadata(props: { searchParams: Promise<{ frame?: string }> }) {
  const searchParams = await props.searchParams;
  let filteredFrameMetadata: Record<string, string> = {};
  try {
    const frameMetadata = await getFrameMetadata(`https://frames.paperclip.xyz/nounish-auction/v2/nouns`);

    // Only take fc:frame tags (not og image overrides)
    filteredFrameMetadata = Object.fromEntries(Object.entries(frameMetadata).filter(([k]) => k.includes("fc:frame")));
  } catch (e) {
    console.error("Failed to fetch frame metadata", e);
  }

  return {
    title: "NounSwap",
    description: "See all the Nouns or Swap for one from the Nouns treasury.",
    other: searchParams.frame != undefined ? filteredFrameMetadata : {},
  };
}

export default async function Page(props: { searchParams: Promise<{ auctionId?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Auction initialAuctionId={searchParams.auctionId} />
        <ExternalFeaturedCarousel />
        <FeatureHighlight />
      </div>
      <div>
        <h2 className="pb-1">Explore Nouns</h2>
        <div className="paragraph-lg">
          See all the Nouns or Swap for one from the{" "}
          <LinkExternal
            className="text-semantic-accent"
            href="https://etherscan.io/tokenholdings?a=0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"
          >
            Nouns treasury.
          </LinkExternal>
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
                    <Skeleton className="bg-background-secondary relative flex aspect-square h-full w-full rounded-2xl" />
                  ),
                  id: i,
                }))}
            />
          </div>
        }
      >
        <NounExplorerWrapper />
      </Suspense>
    </>
  );
}

async function NounExplorerWrapper() {
  const [allNouns, secondaryFloorListing] = await Promise.all([getAllNounsUncached(), getSecondaryFloorListing()]);

  return (
    <>
      <NounExplorer nouns={allNouns} />
      <NounDialog nouns={allNouns} secondaryFloorListing={secondaryFloorListing} />
    </>
  );
}
