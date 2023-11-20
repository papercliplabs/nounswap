import { Noun } from "../common/types";
import NounCard from "./NounCard";
import { useMemo } from "react";
import LinkRetainParams from "./LinkRetainParams";

interface NounGridInterface {
    nouns: Noun[];
}

export default function NounGrid({ nouns }: NounGridInterface) {
    const nounCards = useMemo(() => {
        return nouns.map((noun, i) => (
            <LinkRetainParams href={`/swap/${noun.id}`} key={i} className="active:clickable-active ">
                <NounCard noun={noun} enableHover key={i} />
            </LinkRetainParams>
        ));
    }, [nouns]);

    return (
        <div className=" justify-stretch items-stretch gap-6 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] auto-rows-min grow text-gray-600">
            {nounCards.length == 0 ? "None matching filter" : nounCards}
        </div>
    );
}
