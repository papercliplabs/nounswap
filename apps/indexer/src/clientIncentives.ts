import { ponder } from "@/generated";

ponder.on("NounsClientIncentives:ClientRegistered", async ({ event, context }) => {
  const { Client } = context.db;

  await Client.create({
    id: event.args.clientId,
    data: {
      name: event.args.name,
      rewardAmount: BigInt(0),
      auctionsWon: 0,
      proposalsCreated: 0,
      votesCast: 0,
      approved: false,
    },
  });
});

ponder.on("NounsClientIncentives:ClientUpdated", async ({ event, context }) => {
  const { Client } = context.db;

  await Client.update({
    id: event.args.clientId,
    data: {
      name: event.args.name,
    },
  });
});

ponder.on("NounsClientIncentives:ClientApprovalSet", async ({ event, context }) => {
  const { Client } = context.db;

  await Client.update({
    id: event.args.clientId,
    data: {
      approved: event.args.approved,
    },
  });
});

ponder.on("NounsClientIncentives:ClientRewarded", async ({ event, context }) => {
  const { Client } = context.db;

  await Client.update({
    id: event.args.clientId,
    data: ({ current }) => ({
      rewardAmount: current.rewardAmount + event.args.amount,
    }),
  });
});

ponder.on("NounsAuctionHouse:AuctionSettledWithClientId", async ({ event, context }) => {
  const { Client } = context.db;

  try {
    await Client.update({
      id: event.args.clientId,
      data: ({ current }) => ({
        auctionsWon: current.auctionsWon + 1,
      }),
    });
  } catch (e) {
    console.error("Error updating client auctions won", e);
  }
});

// 2 Events with same name, this is the one we care about
ponder.on(
  "NounsDaoProxy:ProposalCreatedWithRequirements(uint256 id, address[] signers, uint256 updatePeriodEndBlock, uint256 proposalThreshold, uint256 quorumVotes, uint32 indexed clientId)",
  async ({ event, context }) => {
    const { Client } = context.db;

    try {
      await Client.update({
        id: event.args.clientId,
        data: ({ current }) => ({
          proposalsCreated: current.proposalsCreated + 1,
        }),
      });
    } catch (e) {
      console.error("Error updating client props created", e);
    }
  }
);

ponder.on("NounsDaoProxy:VoteCastWithClientId", async ({ event, context }) => {
  const { Client } = context.db;

  try {
    await Client.update({
      id: event.args.clientId,
      data: ({ current }) => ({
        votesCast: current.votesCast + 1,
      }),
    });
  } catch (e) {
    console.error("Error updating client votes cast", e);
  }
});
