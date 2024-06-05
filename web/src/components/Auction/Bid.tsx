"use client";
import { formatEther, parseEther } from "viem";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useCreateBid } from "@/hooks/transactions/useCreateBid";
import TransactionButton from "../TransactionButton";

const BID_DECIMAL_PRECISION = 2;

interface BidProps {
  nounId: bigint;
  nextMinBid: bigint;
}

export default function Bid({ nounId, nextMinBid }: BidProps) {
  const { createBid, error: createBidError, state: txnState, reset: resetCreateBid } = useCreateBid();

  // Used to restrict user input
  const [bidAmount, setBidAmount] = useState("");
  function handleBidAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const regex = new RegExp(`^\\d*\\.?\\d{0,${BID_DECIMAL_PRECISION}}$`);
    if (regex.test(value)) {
      resetCreateBid();
      setBidAmount(value);
    }
  }

  async function onSubmit(formData: FormData) {
    const parsedBidAmount = parseEther(formData.get("bidAmount") as string);
    createBid(nounId, parsedBidAmount);
  }

  // Clear on successful txn
  useEffect(() => {
    if (txnState === "success") {
      resetCreateBid();
      setBidAmount("");
    }
  }, [txnState, resetCreateBid]);

  const nextMinBidFormatted = useMemo(() => {
    return Math.ceil(Number(formatEther(nextMinBid)) * 10 ** BID_DECIMAL_PRECISION) / 10 ** BID_DECIMAL_PRECISION;
  }, [nextMinBid]);

  return (
    <div className="flex w-full flex-col gap-1">
      <form action={onSubmit} className="flex flex-col gap-2 md:flex-row md:gap-4">
        <Input
          placeholder={`Ξ ${nextMinBidFormatted} or more`}
          className="h-full"
          name="bidAmount"
          value={bidAmount}
          onChange={handleBidAmountChange}
          disabled={txnState != "idle"}
        />
        <TransactionButton type="submit" disabled={nextMinBid == undefined || bidAmount == ""} txnState={txnState}>
          Place Bid
        </TransactionButton>
      </form>
      <div className="text-semantic-negative paragraph-sm">{createBidError?.message}</div>
    </div>
  );
}
