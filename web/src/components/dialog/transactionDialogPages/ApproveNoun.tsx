"use client";
import NounCard from "@/components/NounCard";
import { Noun } from "@/data/noun/types";
import { useApproveNoun } from "@/hooks/transactions/useApproveNoun";
import { ReactNode, useEffect } from "react";
import TransactionButton from "@/components/TransactionButton";
import { Address } from "viem";

interface ApproveNounProps {
  noun: Noun;
  spender: Address;
  progressStepper: ReactNode;
  reason: string;
}

export function ApproveNoun({ noun, progressStepper, reason, spender }: ApproveNounProps) {
  const { approveNoun, error, state } = useApproveNoun();

  // Autotrigger on mount
  useEffect(() => {
    approveNoun(BigInt(noun.id), spender);
  }, [approveNoun, noun.id, spender]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <NounCard noun={noun} size={80} enableHover={false} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Approve Noun {noun.id}</h4>
        <span className="text-content-secondary">{reason}</span>
      </div>
      {progressStepper}
      <div className="flex w-full flex-col gap-1">
        <TransactionButton txnState={state} onClick={() => approveNoun(BigInt(noun.id), spender)} className="w-full">
          Approve Noun
        </TransactionButton>
        <span className="paragraph-sm text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}
