import { Noun } from "../lib/types";
import NounCard from "./NounCard";
import { Suspense, useMemo } from "react";
import { LinkInternal } from "@/components/ui/link";
import LoadingSpinner from "./ui/LoadingSpinner";

interface NounGridInterface {
    nouns: Noun[];
    onClearAllFilters: () => void;
}

export default function NounGrid({ nouns, onClearAllFilters }: NounGridInterface) {
    const nounCards = useMemo(() => {
        return nouns.map((noun, i) => (
            <Suspense key={i} fallback={<LoadingSpinner />}>
                <LinkInternal href={`/swap/${noun.chainId}/${noun.id}`} key={i} className="active:clickable-active ">
                    <NounCard noun={noun} enableHover key={i} />
                </LinkInternal>
            </Suspense>
        ));
    }, [nouns]);

    return (
        <>
            {nounCards.length == 0 ? (
                <div className="flex flex-col border-4 rounded-3xl border-gray-200 grow py-24 h-fit justify-center items-center gap-2">
                    <h4>No Nouns found.</h4>
                    <button className="text-accent hover:brightness-[85%]" onClick={onClearAllFilters}>
                        <h6>Clear all filters</h6>
                    </button>
                </div>
            ) : (
                <div className="justify-stretch items-stretch gap-6 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] auto-rows-min grow text-gray-600">
                    {nounCards}
                </div>
            )}
        </>
    );
}
