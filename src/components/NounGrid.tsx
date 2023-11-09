import { Noun } from "@/common/types";
import NounCard from "./NounCard";
import { useMemo } from "react";

interface NounGridInterface {
    nouns: Noun[];
}

export default function NounGrid({ nouns }: NounGridInterface) {
    const nounCards = useMemo(() => {
        return nouns.map((noun, i) => <NounCard noun={noun} key={i} />);
    }, [nouns]);

    return <div className="flex flex-wrap">{nounCards.length == 0 ? "None found matching filter" : nounCards}</div>;
}
