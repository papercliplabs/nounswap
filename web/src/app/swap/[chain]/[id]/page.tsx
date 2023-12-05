import { getNounById } from "../../../../data/getNounById";
import NounSwap from "../../../../components/NounSwap";
import { Address } from "viem";
import { DEFAULT_CHAIN } from "../../../../common/chainSpecificData";
import { getNounsForAddress } from "../../../../data/getNounsForAddress";
import { Suspense } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default async function Swap({
    params,
    searchParams,
}: {
    params: { chain: number; id: string };
    searchParams: { address?: Address; chain?: number };
}) {
    const treasuryNoun = await getNounById(params.id, params.chain);

    if (!treasuryNoun) {
        return <>No treasury noun exists!</>;
    }

    const userNouns = await getNounsForAddress(searchParams.address, treasuryNoun.chainId); // Using treasury noun chain, not active one

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <NounSwap userNouns={userNouns} treasuryNoun={treasuryNoun} address={searchParams.address} />
        </Suspense>
    );
}
