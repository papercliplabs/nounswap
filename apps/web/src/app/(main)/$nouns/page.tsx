import type { Metadata } from "next";
import Hero from "./_sections/Hero";
import Stats from "./_sections/Stats";
import BackedByNouns from "./_sections/BackedByNouns";
import Explainer from "./_sections/Explainer";
import GetStarted from "./_sections/GetStarted";
import VsNouns from "./_sections/VsNouns";
import Ticker from "./_sections/Ticker";
import StartJourney from "./_sections/StartJourney";
import Faq from "./_sections/Faq";
import Disclaimer from "./_sections/Disclaimer";
import Spend from "./_sections/Spend";

export const metadata: Metadata = {
  title:
    "$NOUNS - An ERC-20 Currency Backed by Nouns NFTs | Your Gateway to Ownership",
  description:
    "Learn about $NOUNS, an ERC-20 currency backed by Noun NFTs. Stack $NOUNS to join Nouns DAO and earn a noun!",
  alternates: {
    canonical: "./$nouns",
  },
};

export default function $NounsPage() {
  return (
    <div className="flex w-full flex-col items-center gap-[160px] md:gap-[196px] md:pb-[196px]">
      <Hero />
      <Stats />
      <Explainer />
      <BackedByNouns />
      <GetStarted />
      <Spend />
      <VsNouns />
      <Ticker />
      <StartJourney />
      <Faq />
      <Disclaimer />
    </div>
  );
}
