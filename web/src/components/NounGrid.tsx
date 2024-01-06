import NounCard from "./NounCard";
import { Suspense } from "react";
import { LinkInternal } from "@/components/ui/link";
import { getNounsForAddress } from "@/data/getNounsForAddress";
import getChainSpecificData from "@/lib/chainSpecificData";
import { Noun } from "@/lib/types";
import ClearNounFiltersButton from "./ClearNounFiltersButton";
import AnimationGird from "./AnimationGrid";
import { Skeleton } from "./ui/skeleton";

interface NounGridProps {
    chainId?: number;
    headFilter?: number;
    glassesFilter?: number;
    accessoryFilter?: number;
    bodyFilter?: number;
    backgroundFilter?: number;
}

export default async function NounGrid({
    chainId,
    headFilter,
    glassesFilter,
    accessoryFilter,
    bodyFilter,
    backgroundFilter,
}: NounGridProps) {
    const filterFn = (noun: Noun) => {
        let backgroundMatch = backgroundFilter == undefined ? true : backgroundFilter == noun.seed.background;
        let bodyMatch = bodyFilter == undefined ? true : bodyFilter == noun.seed.body;
        let accessoryMatch = accessoryFilter == undefined ? true : accessoryFilter == noun.seed.accessory;
        let headMatch = headFilter == undefined ? true : headFilter == noun.seed.head;
        let glassesMatch = glassesFilter == undefined ? true : glassesFilter == noun.seed.glasses;

        return backgroundMatch && bodyMatch && accessoryMatch && headMatch && glassesMatch;
    };

    return (
        <Suspense fallback={<NounGridLoading numItems={48} />} key={`chain=${chainId}`}>
            <NounGridLoaded chainId={chainId} filterFn={filterFn} />
        </Suspense>
    );
}

async function NounGridLoaded({ chainId, filterFn }: { chainId?: number; filterFn: (noun: Noun) => boolean }) {
    const nouns = await getNounsForAddress(getChainSpecificData(chainId).nounsTreasuryAddress, chainId);
    const filteredNouns = nouns.filter(filterFn);

    const nounCardItems = filteredNouns.map((noun, i) => {
        const element = (
            <Suspense>
                <LinkInternal href={`/swap/${noun.chainId}/${noun.id}`} key={i} className="active:clickable-active ">
                    <NounCard noun={noun} enableHover key={i} lazyLoad={i > 50} />
                </LinkInternal>
            </Suspense>
        ) as React.ReactNode;
        return { element, id: noun.id };
    });

    return (
        <>
            {nounCardItems.length == 0 ? (
                <div className="flex flex-col border-4 rounded-3xl border-gray-200 grow py-24 h-fit justify-center items-center gap-2">
                    <h4>No Nouns found.</h4>
                    <Suspense>
                        <ClearNounFiltersButton />
                    </Suspense>
                </div>
            ) : (
                <AnimationGird items={nounCardItems} />
            )}
        </>
    );
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
