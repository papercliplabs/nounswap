import { getNounsForAddress } from "@/data/getNounsForAddress";
import NounSelect from "./_partials/NounSelect";
import getChainSpecificData from "@/lib/chainSpecificData";
import { getAddress } from "viem";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { LinkExternal } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import NounFilter from "../../../components/NounFilter";
import NounGrid from "./_partials/NounGrid";

export default function Explore({ searchParams }: { searchParams: { chain?: number; background?: number } }) {
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
            <div className="flex flex-row grow gap-2 bg-negative w-full">
                <NounFilter />
                <NounGrid chainId={searchParams.chain} />
            </div>
        </>
    );
}

// async function NounSelectContainer({ chain }: { chain?: number }) {
//     const treasuryNounsPromise = getNounsForAddress(
//         getChainSpecificData(chain).nounsTreasuryAddress,
//         chain // active chain
//     );
//     const escrowNounsPromise = getNounsForAddress(
//         getAddress("0x44d97D22B3d37d837cE4b22773aAd9d1566055D9"),
//         chain // active chain
//     );

//     const [treasuryNouns, escrowNouns] = await Promise.all([treasuryNounsPromise, escrowNounsPromise]);

//     const nouns = [...treasuryNouns, ...escrowNouns];

//     return <NounSelect nouns={nouns} />;
// }
