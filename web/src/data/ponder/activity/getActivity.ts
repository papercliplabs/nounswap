"use server";
import { ActivitySelector } from "@/components/selectors/ActivitySelector";
import { getDeposits } from "./getDeposits";
import { getRedeems } from "./getRedeems";
import { getSwaps } from "./getSwaps";

type DepositActivity = { type: "deposit" } & Awaited<ReturnType<typeof getDeposits>>[0];
type RedeemActivity = { type: "redeem" } & Awaited<ReturnType<typeof getRedeems>>[0];
type SwapActivity = { type: "swap" } & Awaited<ReturnType<typeof getSwaps>>[0];

export type ActivityEntry = DepositActivity | RedeemActivity | SwapActivity;

export async function getActivity(): Promise<ActivityEntry[]> {
  const [deposits, redeems, swaps] = await Promise.all([getDeposits(), getRedeems(), getSwaps()]);

  const data: ActivityEntry[] = [
    ...deposits.map((deposit) => ({ ...deposit, type: "deposit" }) as any),
    ...redeems.map((redeem) => ({ ...redeem, type: "redeem" }) as any),
    ...swaps.map((swap) => ({ ...swap, type: "swap" }) as any),
  ];

  data.sort((a, b) => (Number(a.transaction.timestamp) > Number(b.transaction.timestamp) ? -1 : 1));

  return data;
}
