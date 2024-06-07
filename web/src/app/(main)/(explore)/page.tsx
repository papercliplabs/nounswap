import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LinkExternal } from "@/components/ui/link";
import Auction from "@/components/Auction";
import { getAllNouns } from "@/data/noun/getAllNouns";
import Explore from "./Explore";

export default function ExplorePage() {
  return (
    <>
      <Auction />
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
