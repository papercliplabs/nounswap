import NounCard from "../../../../components/NounCard";
import { Suspense, useMemo } from "react";
import { LinkInternal } from "@/components/ui/link";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Noun } from "@/data/noun/types";

interface NounGridInterface {
  nouns: Noun[];
  onClearAllFilters: () => void;
}

export default function NounGrid({ nouns, onClearAllFilters }: NounGridInterface) {
  const nounCards = useMemo(() => {
    return nouns.map((noun, i) => (
      <Suspense key={i} fallback={<LoadingSpinner />}>
        <LinkInternal href={`/swap/${noun}/${noun.id}`} key={i} className="active:clickable-active">
          <NounCard noun={noun} enableHover key={i} />
        </LinkInternal>
      </Suspense>
    ));
  }, [nouns]);

  return (
    <>
      {nounCards.length == 0 ? (
        <div className="border-gray-200 flex h-fit grow flex-col items-center justify-center gap-2 rounded-3xl border-4 py-24">
          <h4>No Nouns found.</h4>
          <button className="text-accent hover:brightness-[85%]" onClick={onClearAllFilters}>
            <h6>Clear all filters</h6>
          </button>
        </div>
      ) : (
        <div className="text-gray-600 grid grow auto-rows-min grid-cols-[repeat(auto-fill,minmax(130px,1fr))] items-stretch justify-stretch gap-6">
          {nounCards}
        </div>
      )}
    </>
  );
}
