"use client";
import NounCard from "@/components/NounCard";
import { Noun } from "@/data/noun/types";
import { ReactNode, useEffect } from "react";
import TransactionButton from "@/components/TransactionButton";
import { useNounsErc20Deposit } from "@/hooks/transactions/useNounsErc20Deposit";
import { forceAllNounRevalidation } from "@/data/noun/getAllNouns";
import ConvertNounGraphic from "@/components/ConvertNounGraphic";
import { useRouter } from "next/navigation";

interface NounsErc20DepositNounProps {
  noun: Noun;
  progressStepper: ReactNode;
}

export function NounsErc20DepositNoun({ noun, progressStepper }: NounsErc20DepositNounProps) {
  const { deposit, error, state } = useNounsErc20Deposit();
  const router = useRouter();

  // Autotrigger on mount
  useEffect(() => {
    deposit(BigInt(noun.id));
  }, [deposit, noun.id]);

  // Push to swap success page
  useEffect(() => {
    if (state == "success") {
      forceAllNounRevalidation(); // Force revalidation so will update explore
      router.push(`/convert/success/deposit/${noun.id}`);
    }
  }, [state, router, noun.id]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ConvertNounGraphic noun={noun} action="deposit" />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Confirm Conversion</h4>
        <span className="text-content-secondary">
          This will deposit Noun {noun.id} into the $nouns ERC-20 contract, giving you 1,000,000 $nouns.
        </span>
      </div>
      {progressStepper}
      <div className="flex w-full flex-col gap-1">
        <TransactionButton txnState={state} onClick={() => deposit(BigInt(noun.id))} className="w-full">
          Convert
        </TransactionButton>
        <span className="paragraph-sm text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}
