"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useUpdateSearchParams(): (params: { name: string; value: string | null }[]) => void {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const updateSearchParams = useCallback(
        (params: { name: string; value: string | null }[]) => {
            const newParams = new URLSearchParams(Array.from(searchParams.entries()));

            for (const param of params) {
                if (param.value == null) {
                    newParams.delete(param.name);
                } else {
                    newParams.set(param.name, param.value);
                }
            }

            if (newParams.toString() != searchParams.toString()) {
                router.replace(`${pathname}?${newParams}`, { scroll: false });
            }
        },
        [router, searchParams, pathname]
    );

    return updateSearchParams;
}
