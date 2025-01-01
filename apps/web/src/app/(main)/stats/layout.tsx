import StatsNav from "@/components/StatsNav";
import { CHAIN_CONFIG } from "@/config";
import { ReactNode } from "react";

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-[880px] flex-col gap-4 p-6 pb-[90px] md:gap-6 md:p-10">
      <h2>Stats</h2>
      <StatsNav />
      {CHAIN_CONFIG.chain.testnet ? (
        <div className="flex w-full items-center justify-center label-lg">
          Stats are not yet available on testnet.
        </div>
      ) : (
        children
      )}
    </div>
  );
}
