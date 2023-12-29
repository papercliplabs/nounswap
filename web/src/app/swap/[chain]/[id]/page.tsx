import { getNounById } from "@//data/getNounById";
import NounSwap from "@//components/NounSwap";
import { Address } from "viem";
import { getNounsForAddress } from "@//data/getNounsForAddress";
import { Suspense } from "react";
import HowItWorksModal from "@/components/HowItWorks";
import { LinkInternal } from "@/components/ui/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function Swap({
    params,
    searchParams,
}: {
    params: { chain: number; id: string };
    searchParams: { address?: Address };
}) {
    return (
        <div className="flex flex-col w-full grow">
            <div className="bg-secondary">
                <div className="flex flex-row justify-between px-6 md:px-10 py-5">
                    <Suspense fallback={<LoadingSpinner />}>
                        <LinkInternal href="/">
                            <Button variant="secondary">Back</Button>
                        </LinkInternal>
                    </Suspense>
                    <HowItWorksModal />
                </div>
                <div className="flex flex-col justify-center items-center text-center pb-10 px-6 md:px-10">
                    <h1>Create a Swap Prop</h1>
                    <div>Select the Noun you want to offer for the Swap.</div>
                </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
                <NounSwapContainer userAddress={searchParams.address} treasuryNounId={params.id} chain={params.chain} />
            </Suspense>
        </div>
    );
}

async function NounSwapContainer({
    userAddress,
    treasuryNounId,
    chain,
}: {
    userAddress?: Address;
    treasuryNounId: string;
    chain: number;
}) {
    const treasuryNoun = await getNounById(treasuryNounId, chain);

    if (!treasuryNoun) {
        return <>No treasury noun exists!</>;
    }

    const userNouns = await getNounsForAddress(userAddress, chain); // Using treasury noun chain, not active one

    return <NounSwap userNouns={userNouns} treasuryNoun={treasuryNoun} address={userAddress} />;
}
