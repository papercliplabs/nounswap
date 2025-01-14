import { dailyFinancialSnapshot } from "ponder:schema";
import { SECONDS_PER_DAY } from "../utils/constants";

export const createFinancialSnapshotParams: Omit<(typeof dailyFinancialSnapshot)["$inferSelect"], "id" | "timestamp"> =
  {
    treasuryBalanceInEth: 0,
    treasuryBalanceInUsd: 0,

    // Gets populated in auction settled handler
    auctionRevenueInEth: 0,
    auctionRevenueInUsd: 0,

    // Gets populated in prop executed handler
    propSpendInEth: 0,
    propSpendInUsd: 0,
  };

export function getDayId(timestamp: bigint) {
  return Math.floor(Number(timestamp) / SECONDS_PER_DAY) * SECONDS_PER_DAY;
}
