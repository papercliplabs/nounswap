"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

const NAV_INFO = [
  { name: "Treasury", href: "/stats/treasury" },
  { name: "Leaderboard", href: "/stats/leaderboard" },
  //   { name: "Activity", href: "/stats/activity" },
];

export default function StatsNav() {
  const pathname = usePathname();

  return (
    <div className="border-border-secondary sticky top-0 z-50 flex w-full gap-10 border-b-2 bg-white md:static">
      {NAV_INFO.map((info, i) => {
        const selected = info.href == pathname;
        return (
          <Link
            href={info.href}
            className={clsx("relative py-4", selected ? "text-content-primary" : "text-content-secondary")}
            key={i}
          >
            {info.name}
            {selected && (
              <motion.div
                className="bg-background-dark absolute bottom-[-2px] h-[2px] w-full"
                layoutId="underline"
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
