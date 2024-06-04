"use client";
import { useSettleCurrentAndCreateNew } from "@/hooks/transactions/useSettleCurrentAndCreateNew";
import TransactionButton from "../TransactionButton";

export default function Settle() {
  const { settleCurrentAndCreateNew, error, state: txnState } = useSettleCurrentAndCreateNew();

  return (
    <div className="flex w-full flex-col gap-1">
      <TransactionButton onClick={settleCurrentAndCreateNew} txnState={txnState}>
        Start next auction
      </TransactionButton>
      <div className="text-semantic-negative caption">{error?.message}</div>
    </div>
  );
}
