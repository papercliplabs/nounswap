import { Event, Context, Schema } from "@/generated";
import { bigIntMax } from "../utils/bigInt";
import { Address, formatUnits, parseUnits } from "viem";
import { NOUNS_ERC20_DECIMALS, NOUNS_ERC20_PER_NOUNS_NFT } from "../utils/constants";

export const createAccountParams: Omit<Schema["Account"], "id"> = {
  nounsNftBalance: 0n,
  nounsErc20BaseBalance: 0n,
  nounsErc20MainnetBalance: 0n,
  effectiveNounsBalance: 0n,
  delegateId: undefined,
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
}): Promise<Schema["Account"]> {
  const { Account } = context.db;

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
  return await Account.upsert({
    id: address,
    create: {
      nounsNftBalance: nounsNftBalanceDelta,
      nounsErc20MainnetBalance: nounsErc20MainnetBalanceDelta,
      nounsErc20BaseBalance: nounsErc20BaseBalanceDelta,
      effectiveNounsBalance: effectiveNounsBalanceDelta,
    },
    update: ({ current }) => ({
      nounsNftBalance: current.nounsNftBalance + nounsNftBalanceDelta,
      nounsErc20MainnetBalance: current.nounsErc20MainnetBalance + nounsErc20MainnetBalanceDelta,
      nounsErc20BaseBalance: current.nounsErc20BaseBalance + nounsErc20BaseBalanceDelta,
      effectiveNounsBalance: current.effectiveNounsBalance + effectiveNounsBalanceDelta,
    }),
  });
}
