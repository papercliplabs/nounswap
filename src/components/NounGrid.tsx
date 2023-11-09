import { Noun } from "@/common/types";
import NounCard from "./NounCard";
import { useMemo } from "react";
import Link from "next/link";

interface NounGridInterface {
    nouns: Noun[];
}

export default function NounGrid({ nouns }: NounGridInterface) {
    const nounCards = useMemo(() => {
        return nouns.map((noun, i) => (
            <Link href={`/swap/${noun.id}`} key={i}>
                <NounCard noun={noun} size={128} enableHover key={i} />
            </Link>
        ));
    }, [nouns]);

    return <div className="flex flex-wrap">{nounCards.length == 0 ? "None found matching filter" : nounCards}</div>;
}
