import DynamicSwapLayout from "@/components/DynamicSwapLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getNounById } from "@/data/getNounById";
import { Suspense } from "react";
import { Address } from "viem";
import SwapReasonSelect from "@/components/SwapReasonSelect";

export default function SwapReasonPage({
    params,
    searchParams,
}: {
    params: { chain: number; treasuryNounId: string; userNounId: string; tipAmount: bigint };
    searchParams: { address?: Address };
}) {
    return (
        <DynamicSwapLayout
            currentStep={2}
            title="Give a reason"
            subtitle="Share why you want this noun."
            backButtonHref={`/swap/${params.chain}/${params.treasuryNounId}`}
        >
            <Suspense fallback={<LoadingSpinner />}>
                <SwapReasonContainer
                    chain={params.chain}
                    treasuryNounId={params.treasuryNounId}
                    userNounId={params.userNounId}
                    tipAmount={params.tipAmount}
                />
            </Suspense>
        </DynamicSwapLayout>
    );
}

async function SwapReasonContainer({
    chain,
    treasuryNounId,
    userNounId,
    tipAmount,
}: {
    chain: number;
    treasuryNounId: string;
    userNounId: string;
    tipAmount: bigint;
}) {
    const treasuryNoun = await getNounById(treasuryNounId, chain);
    const userNoun = await getNounById(userNounId, chain);

    if (!treasuryNoun || !userNoun) {
        return <>Nouns don{"'"}t exists!</>;
    }

    return <SwapReasonSelect userNoun={userNoun} treasuryNoun={treasuryNoun} tip={tipAmount} />;
}
