import Auction from "@/components/Auction";
import { getFrameMetadata } from "frog/next";
import React from "react";
import NounsFundsIdeas from "./_sections/NounsFundsIdeas";
import ThisIsNouns from "./_sections/ThisIsNouns";
import { getAllNouns } from "@/data/noun/getAllNouns";
import GovernedByYou from "./_sections/GovernedByYou";
import { getSecondaryFloorListing } from "@/data/noun/getSecondaryNounListings";
import NounDialog from "@/components/dialog/NounDialog";
import TheseAreNouns from "./_sections/TheseAreNouns";
import AlreadyOwnANoun from "./_sections/AlreadyOwnANoun";
import ByTheNumbers from "./_sections/ByTheNumbers";
import Faq from "./_sections/Faq";
import StartJourney from "./_sections/StartJourney";
import GetANoun from "./_sections/GetANoun";

export async function generateMetadata(props: {
  searchParams: Promise<{ frame?: string }>;
}) {
  const searchParams = await props.searchParams;
  let filteredFrameMetadata: Record<string, string> = {};
  try {
    const frameMetadata = await getFrameMetadata(
      `https://frames.paperclip.xyz/nounish-auction/v2/nouns`,
    );

    // Only take fc:frame tags (not og image overrides)
    filteredFrameMetadata = Object.fromEntries(
      Object.entries(frameMetadata).filter(([k]) => k.includes("fc:frame")),
    );
  } catch (e) {
    console.error("Failed to fetch frame metadata", e);
  }

  return {
    title: "NounSwap",
    description: "See all the Nouns or Swap for one from the Nouns treasury.",
    other: searchParams.frame != undefined ? filteredFrameMetadata : {},
  };
}

export default async function Page(props: {
  searchParams: Promise<{ auctionId?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex w-full flex-col items-center gap-[160px] md:gap-[196px] md:pb-[196px]">
      <div className="flex w-full flex-col items-center justify-center gap-[80px]">
        <section className="flex w-full max-w-[1680px] flex-col gap-4 px-6 pt-6 md:px-10 md:pt-10">
          <Auction initialAuctionId={searchParams.auctionId} />
        </section>

        <ThisIsNouns />
      </div>

      <NounsFundsIdeas />
      <GovernedByYou />
      <TheseAreNouns />
      <GetANoun />
      <AlreadyOwnANoun />
      <ByTheNumbers />
      <StartJourney />
      <Faq />

      <NounsDialogWrapper />
    </div>
  );
}

async function NounsDialogWrapper() {
  const [allNouns, secondaryFloorListing] = await Promise.all([
    getAllNouns(),
    getSecondaryFloorListing(),
  ]);
  return (
    <NounDialog
      nouns={allNouns}
      secondaryFloorListing={secondaryFloorListing}
    />
  );
}
