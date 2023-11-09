import { Noun } from "@/common/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface NounCardProps {
    noun: Noun;
    size: number;
    enableHover: boolean;
}

export default function NounCard({ noun, size, enableHover }: NounCardProps) {
    return (
        <div
            className={twMerge(
                "relative flex justify-center rounded-3xl overflow-hidden hover:border-solid border-4 border-transparent",
                enableHover && "hover:border-blue-400 [&>span]:hover:block"
            )}
        >
            <Image src={noun.imageSrc} width={size} height={size} className="" alt="" />
            <span className="absolute bottom-[4px] bg-white rounded-full px-1 hidden">{noun.id}</span>
        </div>
    );
}
