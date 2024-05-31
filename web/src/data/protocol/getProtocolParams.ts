import { CHAIN_CONFIG } from "@/utils/config";
import { multicall } from "viem/actions";
import { nounsAuctionHouseConfig } from "../generated/wagmi";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { BigIntString } from "@/utils/types";

interface ProtocolParams {
  reservePrice: BigIntString;
  minBidIncrementPercentage: number;
}

async function getProtocolParamsUncached(): Promise<ProtocolParams> {
  const [reservePrice, minBidIncrementPercentage] = await multicall(CHAIN_CONFIG.publicClient, {
    contracts: [
      { ...nounsAuctionHouseConfig, functionName: "reservePrice" },
      { ...nounsAuctionHouseConfig, functionName: "minBidIncrementPercentage" },
    ],
    allowFailure: false,
  });

  return {
    reservePrice: reservePrice.toString(),
    minBidIncrementPercentage,
  };
}

export const getProtocolParams = unstable_cache(getProtocolParamsUncached, ["get-protocol-params"], {
  revalidate: SECONDS_PER_DAY,
});
