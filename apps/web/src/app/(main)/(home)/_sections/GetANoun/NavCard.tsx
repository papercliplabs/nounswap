"use client";
import NavButton from "@/components/NavButton";
import { cn } from "@/utils/shadcn";
import Link from "next/link";
import { HTMLAttributes, ReactNode, useRef } from "react";

interface NavCardProps extends HTMLAttributes<HTMLDivElement> {
  href: string;
  iconSrc: string;
  buttonLabel: string;
  description: string;
  children: ReactNode;
}

export default function NavCard({
  href,
  iconSrc,
  buttonLabel,
  description,
  className,
  children,
  ...props
}: NavCardProps) {
  const hoverRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={href} className="w-full flex-1">
      <div
        ref={hoverRef}
        className={cn(
          "relative flex h-full w-full min-w-0 flex-col items-center justify-between gap-4 overflow-hidden rounded-[32px] transition-all hover:brightness-90",
          className,
        )}
        {...props}
      >
        <div className="flex w-full flex-col gap-4 px-8 pt-8 md:px-10 md:pt-10">
          <NavButton
            variant="secondary"
            iconSrc={iconSrc}
            className="w-fit rounded-full border-none stroke-content-primary px-4 label-lg hover:bg-white"
            hoverRef={hoverRef}
          >
            {buttonLabel}
          </NavButton>
          <h5>{description}</h5>
        </div>
        {children}
      </div>
    </Link>
  );
}
