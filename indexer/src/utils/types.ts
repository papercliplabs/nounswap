import { Event } from "ponder:registry";

export type LogEvent = {
  block: Event<"NounsAuctionHouse:AuctionBid">["block"];
  transaction: Event<"NounsAuctionHouse:AuctionBid">["transaction"];
  transactionReceipt?: Event<"NounsAuctionHouse:AuctionBid">["transactionReceipt"];
};
