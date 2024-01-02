import { Noun } from "../lib/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface NounCardProps {
    noun: Noun;
    size?: number;
    enableHover: boolean;
    alwaysShowNumber?: boolean;
}

export default function NounCard({ noun, size, enableHover, alwaysShowNumber }: NounCardProps) {
    return (
        <div
            className={twMerge(
                "relative flex justify-center rounded-3xl overflow-hidden outline outline-[5px] outline-transparent -outline-offset-1 aspect-square",
                enableHover && "hover:outline-blue-400 [&>h6]:hover:block",
                alwaysShowNumber && "[&>h6]:block",
                size && size <= 100 && "rounded-xl",
                size && size <= 50 && "rounded-lg"
            )}
        >
            <Image
                src={noun.imageSrc}
                fill={size == undefined}
                width={size}
                height={size}
                alt=""
                className="outline outline-4 outline-transparent"
            />
            <h6
                className={twMerge(
                    "absolute bottom-[8px] bg-white rounded-full px-3 py-0.5 hidden text-primary shadow-lg",
                    size && size <= 100 && "bottom-[4px] px-2 text-sm"
                )}
            >
                {noun.id}
            </h6>
        </div>
    );
}
