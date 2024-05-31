import { BigIntString } from "@/utils/types";
import { Address } from "viem";

export interface Bid {
  bidderAddress: Address;
  amount: BigIntString;
}

export interface Auction {
  nounId: BigIntString;

  startTime: BigIntString;
  endTime: BigIntString;

  settled: boolean;

  bids: Bid[]; // Ordered most recent to oldest, highest bid is bids[0] (could be empty)
}
