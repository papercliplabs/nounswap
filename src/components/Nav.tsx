"use client";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import LinkRetainParams from "./LinkRetainParams";

interface NavProps {
    navInfo: {
        name: string;
        href: string;
    }[];
}

export default function Nav({ navInfo }: NavProps) {
    const pathName = usePathname();

    return (
        <div className="flex flex-row gap-12">
            {navInfo.map((info, i) => {
                const active = info.href == pathName;
                return (
                    <LinkRetainParams
                        href={info.href}
                        className={twMerge("py-4 text-gray-600", active && "text-gray-900")}
                        key={i}
                    >
                        {info.name}
                    </LinkRetainParams>
                );
            })}
        </div>
    );
}
