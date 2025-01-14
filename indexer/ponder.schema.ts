import { onchainTable, relations } from "ponder";
import { mainnet } from "viem/chains";

export const transaction = onchainTable("transaction", (t) => ({
  hash: t.hex().notNull().primaryKey(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  from: t.hex().notNull(),
  to: t.hex(),
  value: t.bigint().notNull(),
  gas: t.bigint().notNull(),
  gasPrice: t.bigint(),
}));

export const transactionRelations = relations(transaction, ({ many }) => ({
  nounsNftTransfers: many(nounsNftTransfer),
  nounsErc20Deposits: many(nounsErc20Deposit),
  nounsErc20Redeems: many(nounsErc20Redeem),
  nounsErc20Swaps: many(nounsErc20Swap),
}));

export const account = onchainTable("account", (t) => ({
  address: t.hex().notNull().primaryKey(),

  delegateAccountAddress: t.hex(), // Id of account their votes are delegated to, undefined if self

  // Nouns balances
  nounsNftBalance: t.bigint().notNull(),
  nounsErc20MainnetBalance: t.bigint().notNull(),
  nounsErc20BaseBalance: t.bigint().notNull(),

  // Derived
  effectiveNounsBalance: t.bigint().notNull(), // (nounsErc20MainnetBalance + nounsErc20BaseBalance) + (nounsNftBalance * 1M * 10^18) -> scaled to ERC20 units to maintain precision
}));

export const accountRelations = relations(account, ({ many, one }) => ({
  delegateAccount: one(account, { fields: [account.delegateAccountAddress], references: [account.address] }),
  nounsNftFromTransfers: many(nounsNftTransfer),
  nounsNftToTransfers: many(nounsNftTransfer),
  nounsNftsOwned: many(nounsNft),
  nounsErc20MainnetFromTransfers: many(nounsErc20MainnetTransfer),
  nounsErc20MainnetToTransfers: many(nounsErc20MainnetTransfer),
  nounsErc20BaseFromTransfers: many(nounsErc20BaseTransfer),
  nounsErc20BaseToTransfers: many(nounsErc20BaseTransfer),
  delegatedAccounts: many(account),
}));

export const nounsNft = onchainTable("nouns_nft", (t) => ({
  id: t.bigint().notNull().primaryKey(), // tokenId
  ownerAccountAddress: t.hex().notNull(),
}));

export const nounsNftRelations = relations(nounsNft, ({ one, many }) => ({
  owner: one(account, { fields: [nounsNft.ownerAccountAddress], references: [account.address] }),
  transfers: many(nounsNftTransfer),
}));

export const nounsNftTransfer = onchainTable("nouns_nft_transfer", (t) => ({
  id: t.text().primaryKey(), // tx hash + log index
  transactionHash: t.hex().notNull(),
  nounId: t.bigint().notNull(),
  fromAccountAddress: t.hex().notNull(),
  toAccountAddress: t.hex().notNull(),
}));

export const nounsNftTransferRelations = relations(nounsNftTransfer, ({ one }) => ({
  transaction: one(transaction, { fields: [nounsNftTransfer.transactionHash], references: [transaction.hash] }),
  fromAccount: one(account, { fields: [nounsNftTransfer.fromAccountAddress], references: [account.address] }),
  toAccount: one(account, { fields: [nounsNftTransfer.toAccountAddress], references: [account.address] }),
  noun: one(nounsNft, { fields: [nounsNftTransfer.nounId], references: [nounsNft.id] }),
}));

export const nounsErc20MainnetTransfer = onchainTable("nouns_erc20_mainnet_transfer", (t) => ({
  id: t.text().notNull().primaryKey(), // tx hash + log index
  transactionHash: t.hex().notNull(),
  fromAccountAddress: t.hex().notNull(),
  toAccountAddress: t.hex().notNull(),
  amount: t.bigint(),
}));

export const nounsErc20MainnetTransferRelations = relations(nounsErc20MainnetTransfer, ({ one }) => ({
  transaction: one(transaction, {
    fields: [nounsErc20MainnetTransfer.transactionHash],
    references: [transaction.hash],
  }),
  fromAccount: one(account, {
    fields: [nounsErc20MainnetTransfer.fromAccountAddress],
    references: [account.address],
  }),
  toAccount: one(account, { fields: [nounsErc20MainnetTransfer.toAccountAddress], references: [account.address] }),
}));

export const nounsErc20BaseTransfer = onchainTable("nouns_erc20_base_transfer", (t) => ({
  id: t.text().notNull().primaryKey(), // tx hash + log index + array index
  transactionHash: t.hex().notNull(),
  fromAccountAddress: t.hex().notNull(),
  toAccountAddress: t.hex().notNull(),
  amount: t.bigint().notNull(),
}));

export const nounsErc20BaseTransferRelations = relations(nounsErc20BaseTransfer, ({ one }) => ({
  transaction: one(transaction, {
    fields: [nounsErc20BaseTransfer.transactionHash],
    references: [transaction.hash],
  }),
  fromAccount: one(account, {
    fields: [nounsErc20BaseTransfer.fromAccountAddress],
    references: [account.address],
  }),
  toAccount: one(account, { fields: [nounsErc20BaseTransfer.toAccountAddress], references: [account.address] }),
}));

export const nounsErc20Deposit = onchainTable("nouns_erc20_deposit", (t) => ({
  id: t.text().notNull().primaryKey(), // tx hash + log index
  transactionHash: t.hex().notNull(),
  depositorAccountAddress: t.hex().notNull(),
  nounsNftId: t.bigint().notNull(),
}));

export const nounsErc20DepositRelations = relations(nounsErc20Deposit, ({ one }) => ({
  transaction: one(transaction, {
    fields: [nounsErc20Deposit.transactionHash],
    references: [transaction.hash],
  }),
  depositor: one(account, {
    fields: [nounsErc20Deposit.depositorAccountAddress],
    references: [account.address],
  }),
  nounsNft: one(nounsNft, { fields: [nounsErc20Deposit.nounsNftId], references: [nounsNft.id] }),
}));

export const nounsErc20Redeem = onchainTable("nouns_erc20_redeem", (t) => ({
  id: t.text().primaryKey(), // tx hash + log index + array index
  transactionHash: t.hex().notNull(),
  redeemerAccountAddress: t.hex().notNull(),
  nounsNftId: t.bigint().notNull(),
}));

export const nounsErc20RedeemRelations = relations(nounsErc20Redeem, ({ one }) => ({
  transaction: one(transaction, {
    fields: [nounsErc20Redeem.transactionHash],
    references: [transaction.hash],
  }),
  redeemer: one(account, {
    fields: [nounsErc20Redeem.redeemerAccountAddress],
    references: [account.address],
  }),
  nounsNft: one(nounsNft, { fields: [nounsErc20Redeem.nounsNftId], references: [nounsNft.id] }),
}));

export const nounsErc20Swap = onchainTable("nouns_erc20_swap", (t) => ({
  id: t.text().primaryKey(), // tx hash + log index + array index
  transactionHash: t.hex().notNull(),
  swapperAccountAddress: t.hex().notNull(),
  fromNounsNftId: t.bigint().notNull(),
  toNounsNftId: t.bigint().notNull(),
}));

export const nounsErc20SwapRelations = relations(nounsErc20Swap, ({ one }) => ({
  transaction: one(transaction, {
    fields: [nounsErc20Swap.transactionHash],
    references: [transaction.hash],
  }),
  swapper: one(account, {
    fields: [nounsErc20Swap.swapperAccountAddress],
    references: [account.address],
  }),
  fromNounsNft: one(nounsNft, { fields: [nounsErc20Swap.fromNounsNftId], references: [nounsNft.id] }),
  toNounsNft: one(nounsNft, { fields: [nounsErc20Swap.toNounsNftId], references: [nounsNft.id] }),
}));

export const treasuryBalance = onchainTable("treasury_balance", (t) => ({
  timestamp: t.integer().primaryKey(),
  balanceInUsd: t.real(),
  balanceInEth: t.real(),
}));

export const auction = onchainTable("auction", (t) => ({
  nounsNftId: t.bigint().primaryKey(),

  timestamp: t.integer().notNull(),

  winnerAccountAddress: t.hex().notNull(),
  winningBidInEth: t.real().notNull(),
  winningBidInUsd: t.real().notNull(),
}));

export const auctionRelations = relations(auction, ({ one }) => ({
  nounsNft: one(nounsNft, { fields: [auction.nounsNftId], references: [nounsNft.id] }),
  winner: one(account, { fields: [auction.winnerAccountAddress], references: [account.address] }),
}));

export const executedProposal = onchainTable("executed_proposal", (t) => ({
  id: t.bigint().primaryKey(), // proposalId
  timestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
  amountInEth: t.real().notNull(),
  amountInUsd: t.real().notNull(),
}));

export const dailyFinancialSnapshot = onchainTable("daily_financial_snapshot", (t) => ({
  id: t.integer().primaryKey(), // day number

  timestamp: t.integer().notNull(),

  treasuryBalanceInEth: t.real().notNull(),
  treasuryBalanceInUsd: t.real().notNull(),

  auctionRevenueInEth: t.real().notNull(),
  auctionRevenueInUsd: t.real().notNull(),

  propSpendInEth: t.real().notNull(),
  propSpendInUsd: t.real().notNull(),
}));

export const client = onchainTable("client", (t) => ({
  id: t.integer().primaryKey(),

  name: t.text().notNull(),

  rewardAmount: t.bigint().notNull(),

  auctionsWon: t.integer().notNull(),
  proposalsCreated: t.integer().notNull(),
  votesCast: t.integer().notNull(),

  approved: t.boolean().notNull(),
}));

export const nounsErc20DailyVolume = onchainTable("noun_erc20_daily_volume", (t) => ({
  dayTimestamp: t.integer().primaryKey(),

  baseVolume: t.bigint().notNull(),
  mainnetVolume: t.bigint().notNull(),
}));
