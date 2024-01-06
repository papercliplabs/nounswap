import { Suspense } from "react";
import { getNounsForAddress } from "@/data/getNounsForAddress";
import getChainSpecificData from "@/lib/chainSpecificData";
import AnimationGird from "./AnimationGrid";
import { Skeleton } from "./ui/skeleton";
import NounGridClient from "./NounGridClient";

interface NounGridProps {
    chainId?: number;
    // headFilter?: number;
    // glassesFilter?: number;
    // accessoryFilter?: number;
    // bodyFilter?: number;
    // backgroundFilter?: number;
}

export default async function NounGrid({
    chainId,
}: // headFilter,
// glassesFilter,
// accessoryFilter,
// bodyFilter,
// backgroundFilter,
NounGridProps) {
    return (
        <Suspense fallback={<NounGridLoading numItems={48} />} key={`chain=${chainId}`}>
            <NounGridLoaded chainId={chainId} />
        </Suspense>
    );
}

async function NounGridLoaded({ chainId }: { chainId?: number }) {
    const nouns = await getNounsForAddress(getChainSpecificData(chainId).nounsTreasuryAddress, chainId);

    return <NounGridClient nouns={nouns} />;
}

export function NounGridLoading({ numItems }: { numItems: number }) {
    const items = [...Array(numItems)].map((_, i) => {
        return {
            element: (<Skeleton className="rounded-2xl aspect-square" key={i} />) as React.ReactNode,
            id: i,
        };
    });

    return <AnimationGird items={items} disableAnimateIn disableAnimateOut />;
}
