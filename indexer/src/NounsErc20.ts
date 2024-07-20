import { ponder } from "@/generated";
import { createAccountParams, upsertAccountWithBalanceDeltas } from "./helpers/account";
import { upsertTransaction } from "./helpers/transaction";

ponder.on("NounsERC20:Transfer", async ({ event, context }) => {
  const { NounsErc20MainnetTransfer } = context.db;

  const fromAddress = event.args.from;
  const toAddress = event.args.to;
  const amount = event.args.value;

  const transaction = await upsertTransaction({ event, context });

  const fromAccount = await upsertAccountWithBalanceDeltas({
    address: fromAddress,
    deltas: {
      nounsErc20MainnetBalance: -amount,
    },
    event,
    context,
  });

  const toAccount = await upsertAccountWithBalanceDeltas({
    address: toAddress,
    deltas: {
      nounsErc20MainnetBalance: amount,
    },
    event,
    context,
  });

  await NounsErc20MainnetTransfer.create({
    id: event.log.transactionHash + "-" + event.log.logIndex,
    data: {
      transactionId: transaction.id,
      fromId: fromAccount.id,
      toId: toAccount.id,
      amount,
    },
  });
});

ponder.on("NounsErc20Base:Transfer", async ({ event, context }) => {
  const { NounsErc20BaseTransfer } = context.db;

  const fromAddress = event.args.from;
  const toAddress = event.args.to;
  const amount = event.args.value;

  const transaction = await upsertTransaction({ event, context });

  const fromAccount = await upsertAccountWithBalanceDeltas({
    address: fromAddress,
    deltas: {
      nounsErc20BaseBalance: -amount,
    },
    event,
    context,
  });

  const toAccount = await upsertAccountWithBalanceDeltas({
    address: toAddress,
    deltas: {
      nounsErc20BaseBalance: amount,
    },
    event,
    context,
  });

  await NounsErc20BaseTransfer.create({
    id: event.log.transactionHash + "-" + event.log.logIndex,
    data: {
      transactionId: transaction.id,
      fromId: fromAccount.id,
      toId: toAccount.id,
      amount,
    },
  });
});

ponder.on("NounsERC20:Deposit", async ({ event, context }) => {
  const { NounsErc20Deposit, Account, NounsNft } = context.db;

  const depositorAddress = event.args.to;
  const nounsNftIds = event.args.tokenIds;

  const transaction = await upsertTransaction({ event, context });

  const depositor = await Account.upsert({
    id: depositorAddress,
    create: createAccountParams,
    update: {},
  });

  for (let i = 0; i < nounsNftIds.length; i++) {
    await NounsErc20Deposit.create({
      id: event.log.transactionHash + "-" + event.log.logIndex + "-" + i,
      data: {
        transactionId: transaction.id,
        depositorId: depositor.id,
        nounsNftId: nounsNftIds[i]!,
      },
    });
  }
});

ponder.on("NounsERC20:Redeem", async ({ event, context }) => {
  const { NounsErc20Redeem, Account, NounsNft } = context.db;

  const redeemerAddress = event.args.to;
  const nounsNftIds = event.args.tokenIds;

  const transaction = await upsertTransaction({ event, context });

  const redeemer = await Account.upsert({
    id: redeemerAddress,
    create: createAccountParams,
    update: {},
  });

  for (let i = 0; i < nounsNftIds.length; i++) {
    await NounsErc20Redeem.create({
      id: event.log.transactionHash + "-" + event.log.logIndex + "-" + i,
      data: {
        transactionId: transaction.id,
        redeemerId: redeemer.id,
        nounsNftId: nounsNftIds[i]!,
      },
    });
  }
});

ponder.on("NounsERC20:Swap", async ({ event, context }) => {
  const { NounsErc20Swap, Account } = context.db;

  const swapperAddress = event.args.to;
  const inputNounsNftIds = event.args.tokensIn;
  const outputNounsNftIds = event.args.tokensOut;

  const transaction = await upsertTransaction({ event, context });

  const swapper = await Account.upsert({
    id: swapperAddress,
    create: createAccountParams,
    update: {},
  });

  for (let i = 0; i < inputNounsNftIds.length; i++) {
    await NounsErc20Swap.create({
      id: event.log.transactionHash + "-" + event.log.logIndex + "-" + i,
      data: {
        transactionId: transaction.id,
        swapperId: swapper.id,
        fromNounsNftId: inputNounsNftIds[i]!,
        toNounsNftId: outputNounsNftIds[i]!,
      },
    });
  }
});
