"use client";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { NAV_ITEMS } from "./navConfig";

export default function DesktopNav() {
  const pathName = usePathname();

  // Don't render the home link for desktop nav
  const filteredItems = NAV_ITEMS.filter((item) => item.href != "/");

  return (
    <div className="hidden gap-2 md:flex">
      {filteredItems.map((item, i) => {
        const active =
          item.href == "/"
            ? pathName == item.href
            : pathName.includes(item.href);
        return (
          <Link
            href={item.href}
            className={twMerge(
              "px-[20px] py-1 transition-all",
              active
                ? "text-content-primary"
                : "text-content-secondary hover:text-content-primary",
            )}
            key={i}
          >
            <span className="text-[12px] font-bold leading-[16px] md:label-md">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
