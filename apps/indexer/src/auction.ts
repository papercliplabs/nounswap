import { ponder } from "ponder:registry";
import { auction, dailyFinancialSnapshot, nounsNft } from "ponder:schema";
import { upsertAccountWithBalanceDeltas } from "./helpers/account";
import { getEthAmountInUsd } from "./utils/priceOracle";
import { formatEther } from "viem";
import { desc } from "ponder";

// ponder.on("NounsAuctionHouse:AuctionSettled", async ({ event, context }) => {
//   const { db } = context;

//   const nounId = event.args.nounId;
//   const winnerAddress = event.args.winner;
//   const winningBid = event.args.amount;

//   const noun = await db.find(nounsNft, { id: nounId })!; // Must have been minted already, will exist
//   const account = await upsertAccountWithBalanceDeltas({ address: winnerAddress, event, context });

//   const winningBidInUsd = await getEthAmountInUsd({ amount: winningBid, context });
//   const winningBidInEth = Number(formatEther(winningBid));

//   await db.insert(auction).values({
//     nounsNftId: noun!.id,

//     timestamp: parseInt(event.block.timestamp.toString()),

//     winnerAccountAddress: account.address,
//     winningBidInEth,
//     winningBidInUsd,
//   });

//   const { id } = (
//     await db.sql
//       .select({ id: dailyFinancialSnapshot.id })
//       .from(dailyFinancialSnapshot)
//       .limit(1)
//       .orderBy(desc(dailyFinancialSnapshot.id))
//   )[0]!;
//   await db.update(dailyFinancialSnapshot, { id }).set((row) => ({
//     auctionRevenueInEth: row.auctionRevenueInEth + winningBidInEth,
//     auctionRevenueInUsd: row.auctionRevenueInUsd + winningBidInUsd,
//   }));
// });
