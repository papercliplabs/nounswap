import { Noun } from "@/common/types";
import Image from "next/image";

interface NounCardProps {
    noun: Noun;
}

export default function NounCard({ noun }: NounCardProps) {
    return (
        <div className="w-[128px] h-[128px] relative flex justify-center rounded-xl overflow-hidden hover:border-solid border-4 hover:border-blue-400 border-transparent [&>span]:hover:block">
            <Image src={noun.imageSrc} width={128} height={128} className="" alt="" />
            <span className="absolute bottom-[4px] bg-white rounded-full px-1 hidden">{noun.id}</span>
        </div>
    );
}
