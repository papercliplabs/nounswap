import { Noun } from "../common/types";
import NounCard from "./NounCard";
import { Suspense, useMemo } from "react";
import LinkRetainParams from "./LinkRetainParams";
import LoadingSpinner from "./LoadingSpinner";

interface NounGridInterface {
    nouns: Noun[];
    onClearAllFilters: () => void;
}

export default function NounGrid({ nouns, onClearAllFilters }: NounGridInterface) {
    const nounCards = useMemo(() => {
        return nouns.map((noun, i) => (
            <Suspense key={i} fallback={<LoadingSpinner />}>
                <LinkRetainParams
                    href={`/swap/${noun.chainId}/${noun.id}`}
                    key={i}
                    className="active:clickable-active "
                >
                    <NounCard noun={noun} enableHover key={i} />
                </LinkRetainParams>
            </Suspense>
        ));
    }, [nouns]);

    return (
        <>
            {nounCards.length == 0 ? (
                <div className="flex flex-col border-4 rounded-3xl border-gray-200 grow py-24 h-fit justify-center items-center gap-2">
                    <h4>No Nouns found.</h4>
                    <button className="text-blue-500 hover:brightness-[85%]" onClick={onClearAllFilters}>
                        Clear all filters
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
