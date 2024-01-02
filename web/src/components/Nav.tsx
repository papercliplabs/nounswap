"use client";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { LinkInternal } from "@/components/ui/link";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface NavProps {
    navInfo: {
        name: string;
        href: string;
    }[];
}

export default function Nav({ navInfo }: NavProps) {
    const pathName = usePathname();

    return (
        <div className="flex-row gap-2 md:gap-12 flex w-full md:w-auto">
            {navInfo.map((info, i) => {
                const active = info.href == pathName;
                return (
                    <Suspense key={i} fallback={<LoadingSpinner />}>
                        <LinkInternal
                            href={info.href}
                            className={twMerge(
                                "py-4 text-secondary grow flex flex-row justify-center",
                                active && "text-primary bg-white md:bg-transparent rounded-2xl"
                            )}
                        >
                            <h6>{info.name}</h6>
                        </LinkInternal>
                    </Suspense>
                );
            })}
        </div>
    );
}
