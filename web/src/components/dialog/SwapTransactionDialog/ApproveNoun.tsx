"use client";
import NounCard from "@/components/NounCard";
import { Noun } from "@/data/noun/types";
import { useApproveNoun } from "@/hooks/transactions/useApproveNoun";
import { ReactNode, useEffect } from "react";
import { CHAIN_CONFIG } from "@/config";
import TransactionButton from "@/components/TransactionButton";

interface ApproveNounProps {
  noun: Noun;
  progressStepper: ReactNode;
}

export function ApproveNoun({ noun, progressStepper }: ApproveNounProps) {
  const { approveNoun, error, state } = useApproveNoun();

  // Autotrigger on mount
  useEffect(() => {
    approveNoun(BigInt(noun.id), CHAIN_CONFIG.addresses.nounsTreasury);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <NounCard noun={noun} size={80} enableHover={false} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Approve Noun {noun.id}</h4>
        <span className="text-content-secondary">
          This will give the Nouns Treasury permission to swap your Noun if the prop passes.
        </span>
      </div>
      {progressStepper}
      <div className="flex w-full flex-col gap-1">
        <TransactionButton
          txnState={state}
          onClick={() => approveNoun(BigInt(noun.id), CHAIN_CONFIG.addresses.nounsTreasury)}
          className="w-full"
        >
          Approve Noun
        </TransactionButton>
        <span className="caption text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}
