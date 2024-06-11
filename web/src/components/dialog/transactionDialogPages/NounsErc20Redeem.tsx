"use client";
import NounCard from "@/components/NounCard";
import { Noun } from "@/data/noun/types";
import { ReactNode, useEffect } from "react";
import TransactionButton from "@/components/TransactionButton";
import { useNounsErc20Deposit } from "@/hooks/transactions/useNounsErc20Deposit";
import { forceAllNounRevalidation } from "@/data/noun/getAllNouns";
import ConvertNounGraphic from "@/components/ConvertNounGraphic";
import { useNounsErc20Redeem } from "@/hooks/transactions/useNounsErc20Redeem";
import { useRouter } from "next/navigation";

interface NounsErc20RedeemProps {
  noun: Noun;
}

export function NounsErc20Redeem({ noun }: NounsErc20RedeemProps) {
  const { redeem, error, state } = useNounsErc20Redeem();
  const router = useRouter();

  // Autotrigger on mount
  useEffect(() => {
    redeem(BigInt(noun.id));
  }, [redeem, noun.id]);

  // Push to swap success page
  useEffect(() => {
    if (state == "success") {
      forceAllNounRevalidation(); // Force revalidation so will update explore
      router.push(`/convert/success/redeem/${noun.id}`);
    }
  }, [state, router, noun.id]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ConvertNounGraphic noun={noun} action="redeem" />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Confirm Conversion</h4>
        <span className="text-content-secondary">This will redeem 1,000,000 $nouns for Noun 730.</span>
      </div>
      <div className="flex w-full flex-col gap-1">
        <TransactionButton txnState={state} onClick={() => redeem(BigInt(noun.id))} className="w-full">
          Convert
        </TransactionButton>
        <span className="paragraph-sm text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}
