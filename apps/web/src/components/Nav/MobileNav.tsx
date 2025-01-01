"use client";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Icon from "../ui/Icon";
import clsx from "clsx";
import { NAV_ITEMS } from "./navConfig";

export default function MobileNav() {
  const pathName = usePathname();

  return (
    // <div className="fixed bottom-0 left-0 right-0 z-[12] flex flex-row gap-2 border-t-2 border-border-secondary px-4 py-2 shadow-fixed-bottom md:static md:w-auto md:gap-12 md:border-none md:p-0 md:shadow-none pwa:pb-6">
    <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 bg-white px-4 shadow-fixed-bottom md:hidden pwa:pb-6">
      {NAV_ITEMS.map((item, i) => {
        const active =
          item.href == "/"
            ? pathName == item.href
            : pathName.includes(item.href);
        return (
          <Link
            href={item.href}
            className={twMerge(
              "flex grow flex-col items-center justify-center gap-1 px-2.5 py-2",
              active ? "text-content-primary" : "text-content-secondary",
            )}
            key={i}
          >
            <Icon
              icon={item.icon}
              size={24}
              className={clsx(
                active ? "fill-content-primary" : "fill-background-disabled",
              )}
            />
            <span className="text-[12px] font-bold leading-[16px] md:label-md">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
