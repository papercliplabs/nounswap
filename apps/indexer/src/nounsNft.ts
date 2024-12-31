import { ponder } from "@/generated";
import { upsertTransaction } from "./helpers/transaction";
import { createAccountParams, upsertAccountWithBalanceDeltas } from "./helpers/account";

ponder.on("NounsNFT:Transfer", async ({ event, context }) => {
  const { NounsNftTransfer, NounsNft } = context.db;

  const fromAddress = event.args.from;
  const toAddress = event.args.to;

  const transaction = await upsertTransaction({ event, context });

  const fromAccount = await upsertAccountWithBalanceDeltas({
    address: fromAddress,
    deltas: {
      nounsNftBalance: -1n,
    },
    event,
    context,
  });

  const toAccount = await upsertAccountWithBalanceDeltas({
    address: toAddress,
    deltas: {
      nounsNftBalance: 1n,
    },
    event,
    context,
  });

  const nounsNft = await NounsNft.upsert({
    id: event.args.tokenId,
    create: {
      ownerId: toAccount.id,
    },
    update: {
      ownerId: toAccount.id,
    },
  });

  await NounsNftTransfer.create({
    id: event.log.transactionHash + "-" + event.log.logIndex,
    data: {
      transactionId: transaction.id,
      nounId: nounsNft.id,
      fromId: fromAccount.id,
      toId: toAccount.id,
    },
  });
});

ponder.on("NounsNFT:DelegateChanged", async ({ event, context }) => {
  const { Account } = context.db;

  // Delegate account
  const delegateAddress = event.args.toDelegate;
  const delegateAccount = await Account.upsert({
    id: delegateAddress,
    create: createAccountParams,
    update: {},
  });

  // Delegator account
  const delegatorAddress = event.args.delegator;
  const selfDelegate = delegatorAddress == delegateAddress;
  await Account.upsert({
    id: delegatorAddress,
    create: {
      ...createAccountParams,
      delegateId: selfDelegate ? undefined : delegateAccount.id, // undefined if self
    },
    update: {
      delegateId: selfDelegate ? undefined : delegateAccount.id, // undefined if self
    },
  });
});
