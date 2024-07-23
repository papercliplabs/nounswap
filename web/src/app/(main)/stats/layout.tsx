import StatsNav from "@/components/StatsNav";
import { CHAIN_CONFIG } from "@/config";
import { ReactNode } from "react";

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4 self-center pb-[90px] md:gap-6">
      <h2>Stats</h2>
      <StatsNav />
      {CHAIN_CONFIG.chain.testnet ? (
        <div className="label-lg flex w-full items-center justify-center self-center">
          Stats are not yet available on testnet.
        </div>
      ) : (
        children
      )}
    </div>
  );
}
