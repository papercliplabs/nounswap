import NounCard from "./NounCard";
import { Suspense } from "react";
import { LinkInternal } from "@/components/ui/link";
import { getNounsForAddress } from "@/data/getNounsForAddress";
import getChainSpecificData from "@/lib/chainSpecificData";
import { Noun } from "@/lib/types";
import ClearNounFiltersButton from "./ClearNounFiltersButton";
import AnimationGird from "./AnimationGrid";
import { NounGridLoaded } from "./NounGridLoaded";

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
    // const filterFn = (noun: Noun) => {
    //     let backgroundMatch = backgroundFilter == undefined ? true : backgroundFilter == noun.seed.background;
    //     let bodyMatch = bodyFilter == undefined ? true : bodyFilter == noun.seed.body;
    //     let accessoryMatch = accessoryFilter == undefined ? true : accessoryFilter == noun.seed.accessory;
    //     let headMatch = headFilter == undefined ? true : headFilter == noun.seed.head;
    //     let glassesMatch = glassesFilter == undefined ? true : glassesFilter == noun.seed.glasses;

    //     return backgroundMatch && bodyMatch && accessoryMatch && headMatch && glassesMatch;
    // };
    const nouns = await getNounsForAddress(getChainSpecificData(chainId).nounsTreasuryAddress, chainId);

    // TODO: try to find a nice solution to make this smooth... - there is a flash with the server components here, can make the key only chain to get rid of flash but its slower than doing client side filtering then...
    return (
        <Suspense
            fallback={<NounGridLoading numItems={29} />}
            // key={`chain=${chainId}&head=${headFilter}&glasses=${glassesFilter}&accessory=${accessoryFilter}&body=${bodyFilter}&background=${backgroundFilter}`}
            key={`chain=${chainId}`}
        >
            <NounGridLoaded chainId={chainId} nouns={nouns} />
            {/* <NounGridLoading /> */}
        </Suspense>
    );
}

// async function NounGridLoaded({ chainId, filterFn }: { chainId?: number; filterFn: (noun: Noun) => boolean }) {
//     const nouns = await getNounsForAddress(getChainSpecificData(chainId).nounsTreasuryAddress, chainId);
//     const filteredNouns = nouns.filter(filterFn);

//     const nounCards = filteredNouns.map((noun, i) => (
//         <LinkInternal href={`/swap/${noun.chainId}/${noun.id}`} key={i} className="active:clickable-active ">
//             <NounCard noun={noun} enableHover key={i} />
//         </LinkInternal>
//     ));

//     return (
//         <>
//             {nounCards.length == 0 ? (
//                 <div className="flex flex-col border-4 rounded-3xl border-gray-200 grow py-24 h-fit justify-center items-center gap-2">
//                     <h4>No Nouns found.</h4>
//                     <ClearNounFiltersButton />
//                 </div>
//             ) : (
//                 <AnimationGird items={nounCards} disableAnimateIn />
//             )}
//         </>
//     );
// }

export function NounGridLoading({ numItems }: { numItems: number }) {
    const items = [...Array(numItems)].map((_, i) => (
        <div className=" aspect-square w-full h-full rounded-2xl bg-secondary" />
        // <Skeleton className={twMerge("rounded-2xl aspect-square animate-come-in")} />
    ));

    return <AnimationGird items={items} />;
}
