"use client";
import { ButtonHTMLAttributes, useCallback } from "react";
import { ONLY_TREASURY_NOUNS_FILTER_KEY } from "./TreasuryNounFilter";
import { useSearchParams } from "next/navigation";

export function ClearAllFiltersButton({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const searchParams = useSearchParams();

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(ONLY_TREASURY_NOUNS_FILTER_KEY);
    params.delete("background[]");
    params.delete("head[]");
    params.delete("glasses[]");
    params.delete("accessory[]");
    params.delete("body[]");
    window.history.pushState(null, "", `?${params.toString()}`);
  }, [searchParams]);

  return <button onClick={() => clearAllFilters()} {...props} />;
}
