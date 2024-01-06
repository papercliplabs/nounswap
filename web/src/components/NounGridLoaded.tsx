"use client";
import NounCard from "./NounCard";
import { Suspense, useMemo } from "react";
import { LinkInternal } from "@/components/ui/link";
import { getNounsForAddress } from "@/data/getNounsForAddress";
import getChainSpecificData from "@/lib/chainSpecificData";
import { Noun } from "@/lib/types";
import ClearNounFiltersButton from "./ClearNounFiltersButton";
import AnimationGird from "./AnimationGrid";
import { useSearchParams } from "next/navigation";

export function NounGridLoaded({ chainId, nouns }: { chainId?: number; nouns: Noun[] }) {
    const searchParams = useSearchParams();

    const filteredNouns = useMemo(() => {
        return nouns.filter((noun: Noun) => {
            let backgroundMatch =
                searchParams.get("background") == undefined
                    ? true
                    : searchParams.get("background") == noun.seed.background.toString();
            let bodyMatch =
                searchParams.get("body") == undefined ? true : searchParams.get("body") == noun.seed.body.toString();
            let accessoryMatch =
                searchParams.get("accessory") == undefined
                    ? true
                    : searchParams.get("accessory") == noun.seed.accessory.toString();
            let headMatch =
                searchParams.get("head") == undefined ? true : searchParams.get("head") == noun.seed.head.toString();
            let glassesMatch =
                searchParams.get("glasses") == undefined
                    ? true
                    : searchParams.get("glasses") == noun.seed.glasses.toString();

            return backgroundMatch && bodyMatch && accessoryMatch && headMatch && glassesMatch;
        });
    }, [searchParams]);

    return (
        <>
            {filteredNouns.length == 0 ? (
                <div className="flex flex-col border-4 rounded-3xl border-gray-200 grow py-24 h-fit justify-center items-center gap-2">
                    <h4>No Nouns found.</h4>
                    <ClearNounFiltersButton />
                </div>
            ) : (
                <AnimationGird nouns={filteredNouns} />
            )}
        </>
    );
}
