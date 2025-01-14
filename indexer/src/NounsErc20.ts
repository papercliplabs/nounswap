import { ponder } from "ponder:registry";
import { createAccountParams, upsertAccountWithBalanceDeltas } from "./helpers/account";
import { upsertTransaction } from "./helpers/transaction";
import {
  account,
  nounsErc20Deposit,
  nounsErc20MainnetTransfer,
  nounsErc20BaseTransfer,
  nounsErc20Redeem,
  nounsErc20Swap,
  nounsErc20DailyVolume,
} from "ponder:schema";
import { isAddressEqual, zeroAddress } from "viem";
import { SECONDS_PER_DAY } from "./utils/constants";

ponder.on("NounsERC20:Transfer", async ({ event, context }) => {
  const { db } = context;

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

  await db.insert(nounsErc20MainnetTransfer).values({
    id: event.transaction.hash + "-" + event.log.logIndex,
    transactionHash: transaction.hash,
    fromAccountAddress: fromAccount.address,
    toAccountAddress: toAccount.address,
    amount,
  });

  if (!isAddressEqual(fromAddress, zeroAddress) && !isAddressEqual(toAddress, zeroAddress)) {
    const dayTimestamp = Math.floor(Number(event.block.timestamp) / SECONDS_PER_DAY) * SECONDS_PER_DAY;

    await db
      .insert(nounsErc20DailyVolume)
      .values({
        dayTimestamp,
        baseVolume: BigInt(0),
        mainnetVolume: amount,
      })
      .onConflictDoUpdate((row) => ({
        mainnetVolume: row.mainnetVolume + amount,
      }));
  }
});

ponder.on("NounsErc20Base:Transfer", async ({ event, context }) => {
  const { db } = context;

  const fromAddress = event.args.from;
  const toAddress = event.args.to;
  const amount = event.args.value;

  await upsertTransaction({ event, context });
  await upsertAccountWithBalanceDeltas({
    address: fromAddress,
    deltas: {
      nounsErc20BaseBalance: -amount,
    },
    event,
    context,
  });
  await upsertAccountWithBalanceDeltas({
    address: toAddress,
    deltas: {
      nounsErc20BaseBalance: amount,
    },
    event,
    context,
  });

  await db.insert(nounsErc20BaseTransfer).values({
    id: event.transaction.hash + "-" + event.log.logIndex,
    transactionHash: event.transaction.hash,
    fromAccountAddress: fromAddress,
    toAccountAddress: toAddress,
    amount,
  });

  if (!isAddressEqual(fromAddress, zeroAddress) && !isAddressEqual(toAddress, zeroAddress)) {
    const dayTimestamp = Math.floor(Number(event.block.timestamp) / SECONDS_PER_DAY) * SECONDS_PER_DAY;

    await db
      .insert(nounsErc20DailyVolume)
      .values({
        dayTimestamp,
        baseVolume: amount,
        mainnetVolume: BigInt(0),
      })
      .onConflictDoUpdate((row) => ({
        baseVolume: row.baseVolume + amount,
      }));
  }
});

ponder.on("NounsERC20:Deposit", async ({ event, context }) => {
  const { db } = context;

  const depositorAddress = event.args.to;
  const nounsNftIds = event.args.tokenIds;

  const transaction = await upsertTransaction({ event, context });

  await db
    .insert(account)
    .values({
      address: depositorAddress,
      ...createAccountParams,
    })
    .onConflictDoNothing();

  for (let i = 0; i < nounsNftIds.length; i++) {
    await db.insert(nounsErc20Deposit).values({
      id: event.transaction.hash + "-" + event.log.logIndex + "-" + i,
      transactionHash: transaction.hash,
      depositorAccountAddress: depositorAddress,
      nounsNftId: nounsNftIds[i]!,
    });
  }
});

ponder.on("NounsERC20:Redeem", async ({ event, context }) => {
  const { db } = context;

  const redeemerAddress = event.args.to;
  const nounsNftIds = event.args.tokenIds;

  const transaction = await upsertTransaction({ event, context });

  await db
    .insert(account)
    .values({
      address: redeemerAddress,
      ...createAccountParams,
    })
    .onConflictDoNothing();

  for (let i = 0; i < nounsNftIds.length; i++) {
    await await db.insert(nounsErc20Redeem).values({
      id: event.transaction.hash + "-" + event.log.logIndex + "-" + i,
      transactionHash: transaction.hash,
      redeemerAccountAddress: redeemerAddress,
      nounsNftId: nounsNftIds[i]!,
    });
  }
});

ponder.on("NounsERC20:Swap", async ({ event, context }) => {
  const { db } = context;

  const swapperAddress = event.args.to;
  const inputNounsNftIds = event.args.tokensIn;
  const outputNounsNftIds = event.args.tokensOut;

  const transaction = await upsertTransaction({ event, context });

  await db
    .insert(account)
    .values({
      address: swapperAddress,
      ...createAccountParams,
    })
    .onConflictDoNothing();

  for (let i = 0; i < inputNounsNftIds.length; i++) {
    await await db.insert(nounsErc20Swap).values({
      id: event.transaction.hash + "-" + event.log.logIndex + "-" + i,
      transactionHash: transaction.hash,
      swapperAccountAddress: swapperAddress,
      fromNounsNftId: inputNounsNftIds[i]!,
      toNounsNftId: outputNounsNftIds[i]!,
    });
  }
});
