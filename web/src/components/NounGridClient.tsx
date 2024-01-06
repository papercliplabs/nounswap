"use client";
import { Noun } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { LinkInternal } from "./ui/link";
import NounCard from "./NounCard";
import AnimationGird from "./AnimationGrid";
import ClearNounFiltersButton from "./ClearNounFiltersButton";

export default function NounGridClient({ nouns }: { nouns: Noun[] }) {
    const searchParams = useSearchParams();

    const headFilter = searchParams.get("head");
    const glassesFilter = searchParams.get("glasses");
    const accessoryFilter = searchParams.get("accessory");
    const bodyFilter = searchParams.get("body");
    const backgroundFilter = searchParams.get("background");

    const filterFn = (noun: Noun) => {
        let backgroundMatch = backgroundFilter == null ? true : backgroundFilter == noun.seed.background.toString();
        let bodyMatch = bodyFilter == null ? true : bodyFilter == noun.seed.body.toString();
        let accessoryMatch = accessoryFilter == null ? true : accessoryFilter == noun.seed.accessory.toString();
        let headMatch = headFilter == null ? true : headFilter == noun.seed.head.toString();
        let glassesMatch = glassesFilter == null ? true : glassesFilter == noun.seed.glasses.toString();

        return backgroundMatch && bodyMatch && accessoryMatch && headMatch && glassesMatch;
    };

    const filteredNouns = nouns.filter(filterFn);

    const nounCardItems = filteredNouns.map((noun, i) => {
        const element = (
            <LinkInternal href={`/swap/${noun.chainId}/${noun.id}`} key={i} className="active:clickable-active ">
                <NounCard noun={noun} enableHover key={i} lazyLoad={i > 50} />
            </LinkInternal>
        ) as React.ReactNode;
        return { element, id: noun.id };
    });

    return (
        <>
            {nounCardItems.length == 0 ? (
                <div className="flex flex-col border-4 rounded-3xl border-gray-200 grow py-24 h-fit justify-center items-center gap-2">
                    <h4>No Nouns found.</h4>
                    <ClearNounFiltersButton />
                </div>
            ) : (
                <AnimationGird items={nounCardItems} />
            )}
        </>
    );
}
