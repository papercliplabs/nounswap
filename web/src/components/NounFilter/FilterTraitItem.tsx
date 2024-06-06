"use client";
import { NounTrait, NounTraitType } from "@/data/noun/types";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FilterItemButton } from "./FilterItemButton";

export interface FilterTraitItemProps {
  traitType: NounTraitType;
  trait: NounTrait;
}

export function FilterTraitItem({ traitType, trait }: FilterTraitItemProps) {
  const searchParams = useSearchParams();

  const filterKey = useMemo(() => traitType + "[]", [traitType]);

  const isChecked = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const traitFilterParams = params.getAll(filterKey);
    return traitFilterParams.includes(trait.seed.toString());
  }, [searchParams]);

  const handleCheckChange = useCallback(
    (checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const traitFilterParams = params.getAll(filterKey);

      const index = traitFilterParams.indexOf(trait.seed.toString());
      if (checked && index === -1) {
        traitFilterParams.push(trait.seed.toString());
      } else if (!checked && index !== -1) {
        traitFilterParams.splice(index, 1);
      } else {
        // No work to do
        return;
      }

      params.delete(filterKey);

      // Re-add the updated values to the URLSearchParams
      traitFilterParams.forEach((value) => {
        params.append(filterKey, value);
      });

      window.history.pushState(null, "", `?${params.toString()}`);
    },
    [searchParams, filterKey]
  );

  return (
    <FilterItemButton isChecked={isChecked} onClick={() => handleCheckChange(!isChecked)}>
      {trait.name}
    </FilterItemButton>
  );
}
