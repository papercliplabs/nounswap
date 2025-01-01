import { upsertTransaction } from "./helpers/transaction";
import { createAccountParams, upsertAccountWithBalanceDeltas } from "./helpers/account";

import { ponder } from "ponder:registry";
import { account, nounsNft, nounsNftTransfer } from "ponder:schema";

// ponder.on("NounsNFT:Transfer", async ({ event, context }) => {
//   const { db } = context;

//   const fromAddress = event.args.from;
//   const toAddress = event.args.to;

//   const transaction = await upsertTransaction({ event, context });

//   const fromAccount = await upsertAccountWithBalanceDeltas({
//     address: fromAddress,
//     deltas: {
//       nounsNftBalance: -1n,
//     },
//     event,
//     context,
//   });

//   const toAccount = await upsertAccountWithBalanceDeltas({
//     address: toAddress,
//     deltas: {
//       nounsNftBalance: 1n,
//     },
//     event,
//     context,
//   });

//   const nft = await db
//     .insert(nounsNft)
//     .values({
//       id: event.args.tokenId,
//       ownerAccountAddress: toAccount.address,
//     })
//     .onConflictDoUpdate((row) => ({ ownerAccountAddress: toAccount.address }));

//   await db.insert(nounsNftTransfer).values({
//     id: event.transaction.hash + "-" + event.log.logIndex,
//     transactionHash: transaction.hash,
//     nounId: nft.id,
//     fromAccountAddress: fromAccount.address,
//     toAccountAddress: toAccount.address,
//   });
// });

// ponder.on("NounsNFT:DelegateChanged", async ({ event, context }) => {
//   const { db } = context;

//   // Delegate account
//   const delegateAddress = event.args.toDelegate;
//   const delegateAccount = await db
//     .insert(account)
//     .values({
//       address: delegateAddress,
//       ...createAccountParams,
//     })
//     .onConflictDoUpdate((row) => ({}));

//   // Delegator account
//   const delegatorAddress = event.args.delegator;
//   const selfDelegate = delegatorAddress == delegateAddress;
//   await db
//     .insert(account)
//     .values({
//       address: delegatorAddress,
//       ...createAccountParams,
//       delegateAccountAddress: selfDelegate ? null : delegateAccount.address, // undefined if self
//     })
//     .onConflictDoUpdate((row) => ({
//       delegateAccountAddress: selfDelegate ? null : delegateAccount.address, // undefined if self
//     }));
// });
