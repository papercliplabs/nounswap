import { Suspense } from "react";
import ByTheNumbersData from "./ByTheNumbersData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { currentAuctionIdQuery } from "@/data/tanstackQueries";
import { getCurrentAuctionNounId } from "@/data/auction/getCurrentAuctionNounId";
import { getAccountLeaderboard } from "@/data/ponder/leaderboard/getAccountLeaderboard";
import { getDailyFinancialSnapshots } from "@/data/ponder/financial/getDailyFinancialSnapshots";
import { getTreasurySummary } from "@/data/ponder/financial/getTreasurySummart";

export default function ByTheNumbers() {
  return (
    <section className="flex w-full min-w-0 max-w-[1680px] flex-col items-center justify-center gap-8 px-6 md:gap-16 md:px-10">
      <div className="flex flex-col items-center justify-center gap-2 px-6 text-center md:px-10">
        <h2>Nouns by the Numbers</h2>
        <div className="max-w-[480px] paragraph-lg">
          Nouns empower creativity and subcultures, with millions in funding
          distributed to hundreds of ideas, all governed by Noun holders.
        </div>
      </div>
      <Suspense fallback={null}>
        <ByTheNumbersDataWrapper />
      </Suspense>
      <Link href="/stats">
        <Button className="rounded-full">Explore Stats</Button>
      </Link>
    </section>
  );
}

async function ByTheNumbersDataWrapper() {
  // TODO: fetch actual number for this
  const ideasFunded = 408;

  const [currentAuctionId, leaderboard, treasurySummary] = await Promise.all([
    getCurrentAuctionNounId(),
    getAccountLeaderboard(),
    getTreasurySummary(),
  ]);

  return (
    <ByTheNumbersData
      nounsCreated={Number(currentAuctionId) + 1}
      nounOwners={leaderboard.length}
      ideasFunded={ideasFunded}
      treasuryDeployedUsd={treasurySummary.propSpendInUsd}
    />
  );
}
