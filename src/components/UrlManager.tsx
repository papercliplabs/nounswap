"use client";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UrlManager() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { address } = useAccount();
    const { chain } = useNetwork();

    useEffect(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        if (chain != undefined) {
            params.set("chain", chain.id.toString());
        } else {
            params.delete("chain");
        }

        if (address != undefined) {
            params.set("address", address);
        } else {
            params.delete("address");
        }

        router.replace(`${pathname}?${params}`);
    }, [address, chain, pathname, router]);

    return <></>;
}
