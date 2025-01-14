import StatsNav from "@/components/StatsNav";
import { CHAIN_CONFIG } from "@/config";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NounSwap Stats - Track Noun DAO and $nouns Metrics",
  description:
    "Stay updated with Nouns DAO stats. Track Nouns Treasury activity, proposal spending, circulating Nouns, and $nouns trading volume. Real-time insights, all in one place.",
};

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-[880px] flex-col gap-4 p-6 pb-[90px] md:gap-6 md:p-10">
      <h2>Stats</h2>
      <StatsNav />
      <>
        {CHAIN_CONFIG.chain.testnet ? (
          <div className="flex w-full items-center justify-center label-lg">
            Stats are not yet available on testnet.
          </div>
        ) : (
          children
        )}
      </>
    </div>
  );
}
