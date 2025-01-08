import { Event, Context } from "ponder:registry";
import { account } from "ponder:schema";
import { Address, parseUnits } from "viem";
import { NOUNS_ERC20_DECIMALS, NOUNS_ERC20_PER_NOUNS_NFT } from "../utils/constants";

export const createAccountParams: Omit<(typeof account)["$inferInsert"], "address"> = {
  nounsNftBalance: 0n,
  nounsErc20BaseBalance: 0n,
  nounsErc20MainnetBalance: 0n,
  effectiveNounsBalance: 0n,
};

export async function upsertAccountWithBalanceDeltas({
  address,
  deltas,
  event,
  context,
}: {
  address: Address;
  deltas?: {
    nounsNftBalance?: bigint;
    nounsErc20MainnetBalance?: bigint;
    nounsErc20BaseBalance?: bigint;
  };
  event: Event;
  context: Context;
}): Promise<(typeof account)["$inferInsert"]> {
  const nounsNftBalanceDelta = deltas?.nounsNftBalance ?? 0n;
  const nounsErc20MainnetBalanceDelta = deltas?.nounsErc20MainnetBalance ?? 0n;
  const nounsErc20BaseBalanceDelta = deltas?.nounsErc20BaseBalance ?? 0n;

  const effectiveNounsBalanceDelta =
    nounsErc20MainnetBalanceDelta +
    nounsErc20BaseBalanceDelta +
    parseUnits((nounsNftBalanceDelta * NOUNS_ERC20_PER_NOUNS_NFT).toString(), NOUNS_ERC20_DECIMALS);

  // All will be positive balances except for zero address which will show negative
  // For ERC-20, another special address is the bridge address on mainnet

  // Special addresses:
  // * Zero address: will show negative balances for circulating supply for mainnet
  // * Superchain bridge mainnet: locks $nouns on mainnet (will equal base supply)
  // * $nouns contract: locks Nouns and mints $nouns
  return await context.db
    .insert(account)
    .values({
      address,
      nounsNftBalance: nounsNftBalanceDelta,
      nounsErc20BaseBalance: nounsErc20BaseBalanceDelta,
      nounsErc20MainnetBalance: nounsErc20MainnetBalanceDelta,
      effectiveNounsBalance: effectiveNounsBalanceDelta,
    })
    .onConflictDoUpdate((row) => {
      return {
        nounsNftBalance: row.nounsNftBalance + nounsNftBalanceDelta,
        nounsErc20BaseBalance: row.nounsErc20BaseBalance + nounsErc20BaseBalanceDelta,
        nounsErc20MainnetBalance: row.nounsErc20MainnetBalance + nounsErc20MainnetBalanceDelta,
        effectiveNounsBalance: row.effectiveNounsBalance + effectiveNounsBalanceDelta,
      };
    });
}
