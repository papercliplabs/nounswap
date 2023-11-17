"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LinkRetainParams(props: React.ComponentProps<typeof Link>) {
    const searchParams = useSearchParams();
    const url = props.href.toString() + "?" + searchParams.toString();
    return <Link {...props} href={url} />;
}
