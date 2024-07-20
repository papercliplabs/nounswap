import { createSchema } from "@ponder/core";

export default createSchema((p) => {
  return {
    Transaction: p.createTable({
      id: p.hex(), // hash
      blockNumber: p.bigint(),
      timestamp: p.bigint(),
      from: p.hex(),
      to: p.hex().optional(),
      value: p.bigint(),
      gas: p.bigint(),
      gasPrice: p.bigint().optional(),

      // Virtual relationships
      nounsNftTransfers: p.many("NounsNftTransfer.transactionId"),
      nounsErc20Deposits: p.many("NounsErc20Deposit.transactionId"),
      nounsErc20Redeems: p.many("NounsErc20Redeem.transactionId"),
      nounsErc20Swaps: p.many("NounsErc20Swap.transactionId"),
    }),
    Account: p.createTable({
      id: p.hex(), // address
      delegateId: p.hex().references("Account.id").optional(), // Id of account their votes are delegated to, undefined if self

      // Nouns balances
      nounsNftBalance: p.bigint(),
      nounsErc20MainnetBalance: p.bigint(),
      nounsErc20BaseBalance: p.bigint(),

      // Derived
      effectiveNounsBalance: p.bigint(), // (nounsErc20MainnetBalance + nounsErc20BaseBalance) + (nounsNftBalance * 1M * 10^18) -> scaled to ERC20 units to maintain precision

      // Virtual relationships
      nounsNftsOwned: p.many("NounsNft.ownerId"),
      delegate: p.one("delegateId"),

      nounsNftFromTransfers: p.many("NounsNftTransfer.fromId"),
      nounsNftToTransfers: p.many("NounsNftTransfer.toId"),

      nounsErc20MainnetFromTransfers: p.many("NounsErc20MainnetTransfer.fromId"),
      nounsErc20MainnetToTransfers: p.many("NounsErc20MainnetTransfer.toId"),
      nounsErc20BaseFromTransfers: p.many("NounsErc20BaseTransfer.fromId"),
      nounsErc20BaseToTransfers: p.many("NounsErc20BaseTransfer.toId"),

      delegatedAccounts: p.many("Account.delegateId"), // Id of accounts that have delegated to this account
    }),
    NounsNft: p.createTable({
      id: p.bigint(), // tokenId
      ownerId: p.hex().references("Account.id"),

      // Virtual relationships
      owner: p.one("ownerId"),
      transfers: p.many("NounsNftTransfer.nounId"),
    }),
    NounsNftTransfer: p.createTable({
      id: p.string(), // tx hash + log index
      transactionId: p.hex().references("Transaction.id"),
      nounId: p.bigint().references("NounsNft.id"),
      fromId: p.hex().references("Account.id"),
      toId: p.hex().references("Account.id"),

      // Virtual relationships
      transaction: p.one("transactionId"),
      noun: p.one("nounId"),
      from: p.one("fromId"),
      to: p.one("toId"),
    }),
    NounsErc20MainnetTransfer: p.createTable({
      id: p.string(), // tx hash + log index
      transactionId: p.hex().references("Transaction.id"),
      fromId: p.hex().references("Account.id"),
      toId: p.hex().references("Account.id"),
      amount: p.bigint(),

      // Virtual relationships
      transaction: p.one("transactionId"),
      from: p.one("fromId"),
      to: p.one("toId"),
    }),
    NounsErc20BaseTransfer: p.createTable({
      id: p.string(), // tx hash + log index + array index
      transactionId: p.hex().references("Transaction.id"),
      fromId: p.hex().references("Account.id"),
      toId: p.hex().references("Account.id"),
      amount: p.bigint(),

      // Virtual relationships
      transaction: p.one("transactionId"),
      from: p.one("fromId"),
      to: p.one("toId"),
    }),
    NounsErc20Deposit: p.createTable({
      id: p.string(), // tx hash + log index
      transactionId: p.hex().references("Transaction.id"),
      depositorId: p.hex().references("Account.id"),
      nounsNftId: p.bigint().references("NounsNft.id"),

      // Virtual relationships
      transaction: p.one("transactionId"),
      depositor: p.one("depositorId"),
      nounsNft: p.one("nounsNftId"),
    }),
    NounsErc20Redeem: p.createTable({
      id: p.string(), // tx hash + log index + array index
      transactionId: p.hex().references("Transaction.id"),
      redeemerId: p.hex().references("Account.id"),
      nounsNftId: p.bigint().references("NounsNft.id"),

      // Virtual relationships
      transaction: p.one("transactionId"),
      redeemer: p.one("redeemerId"),
      nounsNft: p.one("nounsNftId"),
    }),
    NounsErc20Swap: p.createTable({
      id: p.string(), // tx hash + log index + array index
      transactionId: p.hex().references("Transaction.id"),
      swapperId: p.hex().references("Account.id"),
      fromNounsNftId: p.bigint().references("NounsNft.id"),
      toNounsNftId: p.bigint().references("NounsNft.id"),

      // Virtual relationships
      transaction: p.one("transactionId"),
      swapper: p.one("swapperId"),
      fromNounsNft: p.one("fromNounsNftId"),
      toNounsNft: p.one("toNounsNftId"),
    }),
    TreasuryBalance: p.createTable({
      id: p.bigint(), // block number
      timestamp: p.int(),
      balanceInUsd: p.float(),
      balanceInEth: p.float(),
    }),
    Auction: p.createTable({
      id: p.bigint(), // nounId
      nounsNftId: p.bigint().references("NounsNft.id"),

      timestamp: p.int(),

      winnerId: p.hex().references("Account.id"),
      winningBidInEth: p.float(),
      winningBidInUsd: p.float(),

      // Virtual relationships
      nounsNft: p.one("nounsNftId"),
      winner: p.one("winnerId"),
    }),
    ExecutedProposal: p.createTable({
      id: p.bigint(), // proposalId

      timestamp: p.int(),
      transactionHash: p.hex(),

      amountInEth: p.float(),
      amountInUsd: p.float(),
    }),
    DailyFinancialSnapshot: p.createTable({
      id: p.int(), // day number

      timestamp: p.int(),

      treasuryBalanceInEth: p.float(),
      treasuryBalanceInUsd: p.float(),

      auctionRevenueInEth: p.float(),
      auctionRevenueInUsd: p.float(),

      propSpendInEth: p.float(),
      propSpendInUsd: p.float(),
    }),
  };
});
