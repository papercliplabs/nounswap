import { BigIntString } from "@/utils/types";
import { Address, Hex } from "viem";

export interface Bid {
  transactionHash: Hex;
  bidderAddress: Address;
  amount: BigIntString;
}

export interface Auction {
  nounId: BigIntString;

  startTime: BigIntString;
  endTime: BigIntString;

  state: "live" | "ended-unsettled" | "ended-settled";

  bids: Bid[]; // Ordered most recent to oldest, highest bid is bids[0] (could be empty)
}
