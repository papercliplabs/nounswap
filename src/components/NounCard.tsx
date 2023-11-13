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
                "relative flex justify-center rounded-3xl overflow-hidden outline outline-4 outline-transparent w-fit",
                enableHover && "hover:outline-blue-400 [&>span]:hover:block",
                size < 100 && "rounded-xl"
            )}
        >
            <Image src={noun.imageSrc} width={size} height={size} className="" alt="" />
            <span className="absolute bottom-[4px] bg-white rounded-full px-3 hidden text-black">{noun.id}</span>
        </div>
    );
}
