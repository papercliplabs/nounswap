"use client";
import { NounTrait, NounTraitType } from "@/data/noun/types";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ONLY_TREASURY_NOUNS_FILTER_KEY } from "./TreasuryNounFilter";
import { X } from "lucide-react";
import { ACCESSORY_TRAITS, BACKGROUND_TRAITS, BODY_TRAITS, GLASSES_TRAITS, HEAD_TRAITS } from ".";

export function ActiveFilters() {
  const searchParams = useSearchParams();

  const {
    backgroundFilters,
    headFilters,
    glassesFilters,
    bodyFilters,
    accessoryFilters,
    treasuryNounsOnly,
    totalCount,
  } = useMemo(() => {
    const backgroundFilters = searchParams.getAll("background[]");
    const headFilters = searchParams.getAll("head[]");
    const glassesFilters = searchParams.getAll("glasses[]");
    const bodyFilters = searchParams.getAll("body[]");
    const accessoryFilters = searchParams.getAll("accessory[]");
    const treasuryNounsOnly = searchParams.get(ONLY_TREASURY_NOUNS_FILTER_KEY);

    const totalCount =
      backgroundFilters.length +
      headFilters.length +
      glassesFilters.length +
      bodyFilters.length +
      accessoryFilters.length +
      (treasuryNounsOnly ? 1 : 0);

    return {
      backgroundFilters,
      headFilters,
      glassesFilters,
      bodyFilters,
      accessoryFilters,
      treasuryNounsOnly,
      totalCount,
    };
  }, [searchParams]);

  return (
    <div className="sticky top-[66px] z-[10] flex w-screen min-w-0 -translate-x-1 flex-row items-center gap-2 bg-white py-2 pl-1 md:top-0 md:py-4">
      <h5>Filters</h5>
      <div className="bg-background-secondary text-content-secondary label-sm mr-2 flex h-6 w-6 items-center justify-center rounded-[4px]">
        {totalCount}
      </div>
      <div className="no-scrollbar flex w-full min-w-0 flex-row items-center gap-2 overflow-x-auto">
        {treasuryNounsOnly && <ActiveFilterItem seed={"1"} type="treasuryNounOnly" key={"treasuryNounOnly"} />}
        {backgroundFilters.map((seed) => (
          <ActiveFilterItem seed={seed} type="background" key={"background" + seed} />
        ))}
        {headFilters.map((seed) => (
          <ActiveFilterItem seed={seed} type="head" key={"head" + seed} />
        ))}
        {glassesFilters.map((seed) => (
          <ActiveFilterItem seed={seed} type="glasses" key={"glasses" + seed} />
        ))}
        {bodyFilters.map((seed) => (
          <ActiveFilterItem seed={seed} type="body" key={"body" + seed} />
        ))}
        {accessoryFilters.map((seed) => (
          <ActiveFilterItem seed={seed} type="accessory" key={"accessory" + seed} />
        ))}
      </div>
    </div>
  );
}

interface ActiveFilterItemInterface {
  type: NounTraitType | "treasuryNounOnly";
  seed: string;
}

function ActiveFilterItem({ type, seed }: ActiveFilterItemInterface) {
  const searchParams = useSearchParams();

  const removeFilter = useCallback(
    (type: NounTraitType | "treasuryNounOnly", seed: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (type == "treasuryNounOnly") {
        if (params.get(ONLY_TREASURY_NOUNS_FILTER_KEY) === "1") {
          params.delete(ONLY_TREASURY_NOUNS_FILTER_KEY);
          window.history.pushState(null, "", `?${params.toString()}`);
        }
      } else {
        const filterKey = type + "[]";
        const traitFilterParams = params.getAll(filterKey);

        const index = traitFilterParams.indexOf(seed.toString());
        if (index !== -1) {
          // Remove seed
          traitFilterParams.splice(index, 1);

          // Replace params
          params.delete(filterKey);
          traitFilterParams.forEach((value) => {
            params.append(filterKey, value);
          });

          window.history.pushState(null, "", `?${params.toString()}`);
        }
      }
    },
    [searchParams]
  );

  return (
    <button
      onClick={() => removeFilter(type, seed)}
      className="bg-background-secondary text-content-secondary label-sm flex items-center justify-center whitespace-pre rounded-[9px] px-[10px] py-2 hover:brightness-95"
    >
      {type === "treasuryNounOnly" ? (
        <span className="text-content-primary">Only Treasury</span>
      ) : (
        <>
          <span>{type}: </span>
          <span className="text-content-primary">{getNameForTrait(type, seed)}</span>
        </>
      )}
      <X size={16} strokeWidth={3} className="stroke-content-secondary ml-2" />
    </button>
  );
}

function getNameForTrait(traitType: NounTraitType, seed: string) {
  let traits: NounTrait[] = [];

  switch (traitType) {
    case "background":
      traits = BACKGROUND_TRAITS;
      break;
    case "head":
      traits = HEAD_TRAITS;
      break;
    case "glasses":
      traits = GLASSES_TRAITS;
      break;
    case "body":
      traits = BODY_TRAITS;
      break;
    case "accessory":
      traits = ACCESSORY_TRAITS;
      break;
  }

  return traits.find((trait) => trait.seed === parseInt(seed))?.name;
}
