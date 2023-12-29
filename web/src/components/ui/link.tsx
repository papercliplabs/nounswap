"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function LinkInternal(props: React.ComponentProps<typeof Link>) {
    const searchParams = useSearchParams();
    const url = props.href.toString() + "?" + searchParams.toString();
    return <Link {...props} href={url} />;
}

export function LinkExternal(props: React.ComponentProps<typeof Link>) {
    return <Link {...props} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark" />;
}
