"use client";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import Icon, { IconType } from "../ui/Icon";
import clsx from "clsx";

export interface NavProps {
  navInfo: {
    name: string;
    icon: IconType;
    href: string;
  }[];
}

export default function Nav({ navInfo }: NavProps) {
  const pathName = usePathname();

  return (
    <div className="border-border-secondary shadow-fixed-bottom pwa:pb-6 fixed bottom-0 left-0 right-0 z-[12] flex flex-row gap-2 border-t-2 bg-white px-4 py-2 md:static md:w-auto md:gap-12 md:border-none md:p-0 md:shadow-none">
      {navInfo.map((info, i) => {
        const active = info.href == "/" ? pathName == info.href : pathName.includes(info.href);
        return (
          <Suspense key={i} fallback={<LoadingSpinner />}>
            <Link
              href={info.href}
              className={twMerge(
                "md:text-content-secondary flex grow flex-col items-center justify-center px-[10px] py-1 md:p-0",
                active && "md:text-content-primary md:bg-transparent",
                active && "bg-content-primary rounded-lg text-white"
              )}
            >
              <Icon
                icon={info.icon}
                size={24}
                className={clsx("flex md:hidden", active ? "fill-white" : "fill-content-primary")}
              />
              <span className="md:label-md text-[12px] font-bold leading-[16px]">{info.name}</span>
            </Link>
          </Suspense>
        );
      })}
    </div>
  );
}
