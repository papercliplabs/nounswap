import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LinkExternal } from "@/components/ui/link";
import Auction from "@/components/Auction";
import { getAllNouns } from "@/data/noun/getAllNouns";
import Explore from "./Explore";
import { getFrameMetadata } from "frog/next";
import JustSwapItAdvertisingBanner from "@/components/AdvertisingBanner/JustSwapItAdvertisingBanner";

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
      <Suspense fallback={<LoadingSpinner />}>
        <NounExplorerWrapper />
      </Suspense>
    </>
  );
}

async function NounExplorerWrapper() {
  const allNouns = await getAllNouns();

  return <Explore nouns={allNouns} />;
}
