"use client";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParam";
import { NounFeatureFilterOption } from "@/lib/types";

export default function ClearNounFiltersButton() {
    const updateSearchParams = useUpdateSearchParams();

    return (
        <button
            className="text-accent hover:brightness-[85%]"
            onClick={() => {
                updateSearchParams(
                    [
                        { name: NounFeatureFilterOption.Head, value: null },
                        { name: NounFeatureFilterOption.Glasses, value: null },
                        { name: NounFeatureFilterOption.Accessory, value: null },
                        { name: NounFeatureFilterOption.Body, value: null },
                        { name: NounFeatureFilterOption.Background, value: null },
                    ],
                    true
                );
            }}
        >
            Clear filters
        </button>
    );
}
