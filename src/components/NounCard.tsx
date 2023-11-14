import { Noun } from "@/common/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface NounCardProps {
    noun: Noun;
    size?: number;
    enableHover: boolean;
}

export default function NounCard({ noun, size, enableHover }: NounCardProps) {
    return (
        <div
            className={twMerge(
                "relative flex justify-center rounded-3xl overflow-hidden outline outline-4 outline-transparent aspect-square",
                enableHover && "hover:outline-blue-400 [&>span]:hover:block",
                size && size < 100 && "rounded-xl"
            )}
        >
            <Image
                src={noun.imageSrc}
                fill={size == undefined}
                width={size}
                height={size}
                alt=""
                // className="w-full h-full"
            />
            <span className="absolute bottom-[4px] bg-white rounded-full px-3 hidden text-gray-900">{noun.id}</span>
        </div>
    );
}
