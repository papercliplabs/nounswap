import { ponder } from "ponder:registry";
import { client } from "ponder:schema";

// ponder.on("NounsClientIncentives:ClientRegistered", async ({ event, context }) => {
//   const { db } = context;

//   await db.insert(client).values({
//     id: event.args.clientId,
//     name: event.args.name,
//     rewardAmount: BigInt(0),
//     auctionsWon: 0,
//     proposalsCreated: 0,
//     votesCast: 0,
//     approved: false,
//   });
// });

// ponder.on("NounsClientIncentives:ClientUpdated", async ({ event, context }) => {
//   const { db } = context;

//   await db.update(client, { id: event.args.clientId }).set({
//     name: event.args.name,
//   });
// });

// ponder.on("NounsClientIncentives:ClientApprovalSet", async ({ event, context }) => {
//   const { db } = context;

//   await db.update(client, { id: event.args.clientId }).set({ approved: event.args.approved });
// });

// ponder.on("NounsClientIncentives:ClientRewarded", async ({ event, context }) => {
//   const { db } = context;

//   await db
//     .update(client, { id: event.args.clientId })
//     .set((current) => ({ rewardAmount: current.rewardAmount + event.args.amount }));
// });

// ponder.on("NounsAuctionHouse:AuctionSettledWithClientId", async ({ event, context }) => {
//   const { db } = context;

//   try {
//     await db.update(client, { id: event.args.clientId }).set((current) => ({ auctionsWon: current.auctionsWon + 1 }));
//   } catch (e) {
//     console.error("Error updating client auctions won", e);
//   }
// });

// // 2 Events with same name, this is the one we care about
// ponder.on(
//   "NounsDaoProxy:ProposalCreatedWithRequirements(uint256 id, address[] signers, uint256 updatePeriodEndBlock, uint256 proposalThreshold, uint256 quorumVotes, uint32 indexed clientId)",
//   async ({ event, context }) => {
//     const { db } = context;

//     try {
//       await db
//         .update(client, { id: event.args.clientId })
//         .set((current) => ({ proposalsCreated: current.proposalsCreated + 1 }));
//     } catch (e) {
//       console.error("Error updating client props created", e);
//     }
//   }
// );

// ponder.on("NounsDaoProxy:VoteCastWithClientId", async ({ event, context }) => {
//   const { db } = context;

//   try {
//     await db.update(client, { id: event.args.clientId }).set((current) => ({ votesCast: current.votesCast + 1 }));
//   } catch (e) {
//     console.error("Error updating client votes cast", e);
//   }
// });
