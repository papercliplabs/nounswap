"use client";
import { cn } from "@/utils/shadcn";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function LinkExternal(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={twMerge("text-semantic-accent hover:text-semantic-accent-dark", props.className)}
    />
  );
}

interface LinkShallowProps extends HTMLAttributes<HTMLButtonElement> {
  searchParam: { name: string; value: string };
}

export function LinkShallow({ searchParam, children, className, ...props }: LinkShallowProps) {
  const searchParams = useSearchParams();

  return (
    <button
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(searchParam.name, searchParam.value);
        window.history.pushState(null, "", `?${params.toString()}`);
        // router.push(`?${params.toString()}`);
      }}
      className={cn("clickable-active", className)}
      {...props}
    >
      {children}
    </button>
  );
}
