import { ponder } from "@/generated";
import { upsertAccountWithBalanceDeltas } from "./helpers/account";
import { formatEther } from "viem";
import { getEthAmountInUsd } from "./utils/priceOracle";

ponder.on("NounsAuctionHouse:AuctionSettled", async ({ event, context }) => {
  const { Auction, NounsNft, DailyFinancialSnapshot } = context.db;

  const nounId = event.args.nounId;
  const winnerAddress = event.args.winner;
  const winningBid = event.args.amount;

  const noun = await NounsNft.findUnique({ id: nounId }); // Must have been minted alread, will exist
  const account = await upsertAccountWithBalanceDeltas({ address: winnerAddress, event, context });

  const winningBidInUsd = await getEthAmountInUsd({ amount: winningBid, context });
  const winningBidInEth = Number(formatEther(winningBid));

  await Auction.create({
    id: nounId,
    data: {
      nounsNftId: noun!.id,

      timestamp: parseInt(event.block.timestamp.toString()),

      winnerId: account.id,
      winningBidInEth,
      winningBidInUsd,
    },
  });

  const snapshot = (await DailyFinancialSnapshot.findMany({ orderBy: { id: "desc" }, limit: 1 })).items[0]!;
  await DailyFinancialSnapshot.update({
    id: snapshot.id,
    data: ({ current }) => ({
      auctionRevenueInEth: current.auctionRevenueInEth + winningBidInEth,
      auctionRevenueInUsd: current.auctionRevenueInUsd + winningBidInUsd,
    }),
  });
});
