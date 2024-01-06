"use client";
import { useEffect } from "react";
import { watchAccount } from "@wagmi/core";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParam";

export default function UrlManager() {
    const updateSearchParams = useUpdateSearchParams();

    useEffect(() => {
        watchAccount((account) => {
            updateSearchParams([{ name: "address", value: account.address ?? null }]);
        });
    });

    return <></>;
}
