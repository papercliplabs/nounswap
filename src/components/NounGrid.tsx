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
            <Link href={`/swap/${noun.id}`} key={i} className="active:clickable-active">
                <NounCard noun={noun} size={128} enableHover key={i} />
            </Link>
        ));
    }, [nouns]);

    return (
        <div className="justify-between gap-6 grid grid-cols-[repeat(auto-fill,_128px)] w-full text-gray-600">
            {nounCards.length == 0 ? "None matching filter" : nounCards}
        </div>
    );
}
