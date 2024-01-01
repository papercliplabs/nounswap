import { Noun } from "../lib/types";
import NounCard from "./NounCard";
import Icon from "./ui/Icon";

interface SwapNounGraphicProps {
    fromNoun: Noun;
    toNoun: Noun;
}

export default function SwapNounGraphic({ fromNoun, toNoun }: SwapNounGraphicProps) {
    return (
        <div className="flex flex-row gap-5">
            <div className="relative">
                <NounCard noun={fromNoun} size={80} enableHover={false} />
                <div className="absolute right-0 top-1/2 translate-x-[calc(50%+10px)] -translate-y-1/2 z-40">
                    <Icon icon="repeat" size={36} className="p-2 rounded-full bg-secondary border-2 border-white" />
                </div>
            </div>
            <NounCard noun={toNoun} size={80} enableHover={false} />
        </div>
    );
}
