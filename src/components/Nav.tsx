"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

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
                    <Link href={info.href} className={twMerge("py-4 text-gray-600", active && "text-black")} key={i}>
                        {info.name}
                    </Link>
                );
            })}
        </div>
    );
}
