import { LinkExternal } from "@/components/ui/link";
import { CHAIN_CONFIG } from "@/config";
import TimeSelector from "@/components/selectors/TimeSelector";
import CurrencySelector from "@/components/selectors/CurrencySelector";
import { getDailyFinancialSnapshots } from "@/data/ponder/financial/getDailyFinancialSnapshots";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TreasuryStats from "./TreasuryStats";
import { SECONDS_PER_DAY } from "@/utils/constants";

export default function TreasuryPage() {
  return (
    <>
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <h4>Treasury Stats</h4>
          <span>
            Data and insights for the{" "}
            <LinkExternal
              href={
                CHAIN_CONFIG.chain.blockExplorers?.default.url +
                `/tokenholdings?a=${CHAIN_CONFIG.addresses.nounsTreasury}`
              }
              className="underline"
            >
              Nouns treasury
            </LinkExternal>
            .
          </span>
        </div>
        <div className="flex w-full justify-start gap-2 bg-white py-2 md:w-fit md:justify-end md:self-end md:py-0">
          <Suspense>
            <CurrencySelector />
            <TimeSelector />
          </Suspense>
        </div>
      </div>
      <Suspense
        fallback={
          <>
            <div className="flex h-[97px] flex-col gap-4 md:flex-row">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton className="h-full flex-1 rounded-2xl" key={i} />
                ))}
            </div>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton className="h-[341px] rounded-2xl" key={i} />
              ))}
          </>
        }
      >
        <TreasuryDataWrapper />
      </Suspense>
    </>
  );
}

async function TreasuryDataWrapper() {
  const data = await getDailyFinancialSnapshots();
  return <TreasuryStats data={data} />;
}

export const revalidate = SECONDS_PER_DAY / 2;
