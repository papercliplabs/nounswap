import { getNounsForAddress } from "@/data/noun/getNounsForAddress";
import NounSelect from "./_partials/NounSelect";
import { getAddress } from "viem";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { LinkExternal } from "@/components/ui/link";
import { CHAIN_CONFIG } from "@/utils/config";

export default function Home({ searchParams }: { searchParams: { chain?: number } }) {
  return (
    <>
      <div>
        <h1 className="pb-1">Choose a Noun</h1>
        <div>
          Swap your Noun for a Noun, from the{" "}
          <LinkExternal href="https://etherscan.io/tokenholdings?a=0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71">
            Nouns treasury.
          </LinkExternal>
        </div>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <NounSelectContainer />
      </Suspense>
    </>
  );
}

async function NounSelectContainer() {
  const treasuryNounsPromise = getNounsForAddress(CHAIN_CONFIG.addresses.nounsTreasury);
  // const escrowNounsPromise = getNounsForAddress(
  //     getAddress("0x44d97D22B3d37d837cE4b22773aAd9d1566055D9"),
  //     chain // active chain
  // );

  const [treasuryNouns] = await Promise.all([treasuryNounsPromise]);

  const nouns = [...treasuryNouns];

  return <NounSelect nouns={nouns} />;
}
