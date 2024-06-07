"use client";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

interface NavProps {
  navInfo: {
    name: string;
    href: string;
  }[];
}

export default function Nav({ navInfo }: NavProps) {
  const pathName = usePathname();

  return (
    <div className="flex w-full flex-row gap-2 md:w-auto md:gap-12">
      {navInfo.map((info, i) => {
        const active = info.href == pathName;
        return (
          <Suspense key={i} fallback={<LoadingSpinner />}>
            <Link
              href={info.href}
              className={twMerge(
                "text-content-secondary flex grow flex-row justify-center py-4",
                active && "text-content-primary rounded-2xl bg-white md:bg-transparent"
              )}
            >
              <h6>{info.name}</h6>
            </Link>
          </Suspense>
        );
      })}
    </div>
  );
}
