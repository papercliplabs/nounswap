import { onchainTable, relations } from "ponder";

export const transactions = onchainTable("transactions", (t) => ({
  hash: t.hex().notNull().primaryKey(),
  blockNumber: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  from: t.hex().notNull(),
  to: t.hex(),
  value: t.bigint().notNull(),
  gas: t.bigint().notNull(),
  gasPrice: t.bigint(),
}));

export const transactionsRelations = relations(transactions, ({ many }) => ({
  nounsNftTransfers: many(nounsNftTransfers),
  nounsErc20Deposits: many(nounsErc20Deposits),
  nounsErc20Redeems: many(nounsErc20Redeems),
  nounsErc20Swaps: many(nounsErc20Swaps),
}));

export const accounts = onchainTable("accounts", (t) => ({
  address: t.hex().notNull().primaryKey(),

  delegateAccountId: t.hex(), // Id of account their votes are delegated to, undefined if self

  // Nouns balances
  nounsNftBalance: t.bigint(),
  nounsErc20MainnetBalance: t.bigint(),
  nounsErc20BaseBalance: t.bigint(),

  // Derived
  effectiveNounsBalance: t.bigint(), // (nounsErc20MainnetBalance + nounsErc20BaseBalance) + (nounsNftBalance * 1M * 10^18) -> scaled to ERC20 units to maintain precision
}));

export const accountsRelations = relations(accounts, ({ many, one }) => ({
  delegateAccount: one(accounts, { fields: [accounts.delegateAccountId], references: [accounts.address] }),
  nounsNftFromTransfers: many(nounsNftTransfers),
  nounsNftToTransfers: many(nounsNftTransfers),
  nounsNftsOwned: many(nounsNfts),
  nounsErc20MainnetFromTransfers: many(nounsErc20MainnetTransfers),
  nounsErc20MainnetToTransfers: many(nounsErc20MainnetTransfers),
  nounsErc20BaseFromTransfers: many(nounsErc20BaseTransfers),
  nounsErc20BaseToTransfers: many(nounsErc20BaseTransfers),
  delegatedAccounts: many(accounts),
}));

export const nounsNfts = onchainTable("nouns_nfts", (t) => ({
  id: t.bigint().notNull().primaryKey(), // tokenId
  ownerAccountAddress: t.hex().notNull(),
}));

export const nounsNftsRelations = relations(nounsNfts, ({ one, many }) => ({
  owner: one(accounts, { fields: [nounsNfts.ownerAccountAddress], references: [accounts.address] }),
  transfers: many(nounsNftTransfers),
}));

export const nounsNftTransfers = onchainTable("nouns_nft_transfers", (t) => ({
  id: t.text().primaryKey(), // tx hash + log index
  transactionHash: t.hex().notNull(),
  nounId: t.bigint().notNull(),
  fromAccountAddress: t.hex().notNull(),
  toAccountAddress: t.hex().notNull(),
}));

export const nounsNftTransfersRelations = relations(nounsNftTransfers, ({ one }) => ({
  transaction: one(transactions, { fields: [nounsNftTransfers.transactionHash], references: [transactions.hash] }),
  fromAccount: one(accounts, { fields: [nounsNftTransfers.fromAccountAddress], references: [accounts.address] }),
  toAccount: one(accounts, { fields: [nounsNftTransfers.toAccountAddress], references: [accounts.address] }),
  noun: one(nounsNfts, { fields: [nounsNftTransfers.nounId], references: [nounsNfts.id] }),
}));

export const nounsErc20MainnetTransfers = onchainTable("nouns_erc20_mainnet_transfers", (t) => ({
  id: t.text().notNull().primaryKey(), // tx hash + log index
  transactionHash: t.hex().notNull(),
  fromAccountAddress: t.hex().notNull(),
  toAccountAddress: t.hex().notNull(),
  amount: t.bigint(),
}));

export const nounsErc20MainnetTransfersRelations = relations(nounsErc20MainnetTransfers, ({ one }) => ({
  transaction: one(transactions, {
    fields: [nounsErc20MainnetTransfers.transactionHash],
    references: [transactions.hash],
  }),
  fromAccount: one(accounts, {
    fields: [nounsErc20MainnetTransfers.fromAccountAddress],
    references: [accounts.address],
  }),
  toAccount: one(accounts, { fields: [nounsErc20MainnetTransfers.toAccountAddress], references: [accounts.address] }),
}));

export const nounsErc20BaseTransfers = onchainTable("nouns_erc20_base_transfers", (t) => ({
  id: t.text().notNull().primaryKey(), // tx hash + log index + array index
  transactionHash: t.hex().notNull(),
  fromAccountAddress: t.hex().notNull(),
  toAccountAddress: t.hex().notNull(),
  amount: t.bigint().notNull(),
}));

export const nounsErc20BaseTransfersRelations = relations(nounsErc20BaseTransfers, ({ one }) => ({
  transaction: one(transactions, {
    fields: [nounsErc20BaseTransfers.transactionHash],
    references: [transactions.hash],
  }),
  fromAccount: one(accounts, {
    fields: [nounsErc20BaseTransfers.fromAccountAddress],
    references: [accounts.address],
  }),
  toAccount: one(accounts, { fields: [nounsErc20BaseTransfers.toAccountAddress], references: [accounts.address] }),
}));

export const nounsErc20Deposits = onchainTable("nouns_erc20_deposits", (t) => ({
  id: t.text().notNull().primaryKey(), // tx hash + log index
  transactionHash: t.hex().notNull(),
  depositorAccountAddress: t.hex().notNull(),
  nounsNftId: t.bigint().notNull(),
}));

export const nounsErc20DepositsRelations = relations(nounsErc20Deposits, ({ one }) => ({
  transaction: one(transactions, {
    fields: [nounsErc20Deposits.transactionHash],
    references: [transactions.hash],
  }),
  depositor: one(accounts, {
    fields: [nounsErc20Deposits.depositorAccountAddress],
    references: [accounts.address],
  }),
  nounsNft: one(nounsNfts, { fields: [nounsErc20Deposits.nounsNftId], references: [nounsNfts.id] }),
}));

export const nounsErc20Redeems = onchainTable("nouns_erc20_redeems", (t) => ({
  id: t.text().primaryKey(), // tx hash + log index + array index
  transactionHash: t.hex().notNull(),
  redeemerAccountAddress: t.hex().notNull(),
  nounsNftId: t.bigint().notNull(),
}));

export const nounsErc20RedeemsRelations = relations(nounsErc20Redeems, ({ one }) => ({
  transaction: one(transactions, {
    fields: [nounsErc20Redeems.transactionHash],
    references: [transactions.hash],
  }),
  redeemer: one(accounts, {
    fields: [nounsErc20Redeems.redeemerAccountAddress],
    references: [accounts.address],
  }),
  nounsNft: one(nounsNfts, { fields: [nounsErc20Redeems.nounsNftId], references: [nounsNfts.id] }),
}));

export const nounsErc20Swaps = onchainTable("nouns_erc20_swaps", (t) => ({
  id: t.text().primaryKey(), // tx hash + log index + array index
  transactionHash: t.hex().notNull(),
  swapperAccountAddress: t.hex().notNull(),
  fromNounsNftId: t.bigint().notNull(),
  toNounsNftId: t.bigint().notNull(),
}));

export const nounsErc20SwapsRelations = relations(nounsErc20Swaps, ({ one }) => ({
  transaction: one(transactions, {
    fields: [nounsErc20Swaps.transactionHash],
    references: [transactions.hash],
  }),
  swapper: one(accounts, {
    fields: [nounsErc20Swaps.swapperAccountAddress],
    references: [accounts.address],
  }),
  fromNounsNft: one(nounsNfts, { fields: [nounsErc20Swaps.fromNounsNftId], references: [nounsNfts.id] }),
  toNounsNft: one(nounsNfts, { fields: [nounsErc20Swaps.toNounsNftId], references: [nounsNfts.id] }),
}));

export const treasuryBalances = onchainTable("treasury_balances", (t) => ({
  timestamp: t.integer().primaryKey(),
  balanceInUsd: t.real(),
  balanceInEth: t.real(),
}));

export const auctions = onchainTable("auctions", (t) => ({
  id: t.bigint().primaryKey(), // nounId
  nounsNftId: t.bigint().notNull(),

  timestamp: t.integer().notNull(),

  winnerAccountAddress: t.hex().notNull(),
  winningBidInEth: t.real().notNull(),
  winningBidInUsd: t.real().notNull(),
}));

export const auctionsRelations = relations(auctions, ({ one }) => ({
  nounsNft: one(nounsNfts, { fields: [auctions.nounsNftId], references: [nounsNfts.id] }),
  winner: one(accounts, { fields: [auctions.winnerAccountAddress], references: [accounts.address] }),
}));

export const executedProposals = onchainTable("executed_proposals", (t) => ({
  id: t.bigint().primaryKey(), // proposalId
  timestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
  amountInEth: t.real().notNull(),
  amountInUsd: t.real().notNull(),
}));

export const dailyFinancialSnapshots = onchainTable("daily_financial_snapshots", (t) => ({
  id: t.integer().primaryKey(), // day number

  timestamp: t.integer().notNull(),

  treasuryBalanceInEth: t.real().notNull(),
  treasuryBalanceInUsd: t.real().notNull(),

  auctionRevenueInEth: t.real().notNull(),
  auctionRevenueInUsd: t.real().notNull(),

  propSpendInEth: t.real().notNull(),
  propSpendInUsd: t.real().notNull(),
}));

export const clients = onchainTable("clients", (t) => ({
  id: t.integer().primaryKey(),

  name: t.text().notNull(),

  rewardAmount: t.bigint().notNull(),

  auctionsWon: t.integer().notNull(),
  proposalsCreated: t.integer().notNull(),
  votesCast: t.integer().notNull(),

  approved: t.boolean().notNull(),
}));
