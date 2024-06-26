import { LinkExternal } from "@/components/ui/link";
import { CHAIN_CONFIG } from "@/config";
import TimeSelector from "@/components/selectors/TimeSelector";
import CurrencySelector from "@/components/selectors/CurrencySelector";
import Stats from "./Stats";
import { getDailyFinancialSnapshots } from "@/data/ponder/financial/getDailyFinancialSnapshots";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestPage() {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4 self-center pb-[90px] md:gap-6">
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <h2>Stats</h2>
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
        <StatsWrapper />
      </Suspense>
    </div>
  );
}

async function StatsWrapper() {
  if (CHAIN_CONFIG.chain.testnet) {
    return (
      <div className="label-lg flex w-full items-center justify-center self-center">
        Stats are not available yet on testnet.
      </div>
    );
  }

  const data = await getDailyFinancialSnapshots();
  return <Stats data={data} />;
}
