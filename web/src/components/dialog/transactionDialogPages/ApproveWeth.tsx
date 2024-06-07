"use client";
import { ReactNode, useEffect } from "react";
import { CHAIN_CONFIG } from "@/config";
import { useApproveErc20 } from "@/hooks/transactions/useApproveErc20";
import Image from "next/image";
import { formatTokenAmount } from "@/utils/utils";
import { NATIVE_ASSET_DECIMALS } from "@/utils/constants";
import TransactionButton from "@/components/TransactionButton";

interface ApproveNounProps {
  amount: bigint;
  progressStepper: ReactNode;
}

export function ApproveWeth({ amount, progressStepper }: ApproveNounProps) {
  const { approveErc20, error, state } = useApproveErc20();

  // Autotrigger on mount
  useEffect(() => {
    approveErc20(CHAIN_CONFIG.addresses.wrappedNativeToken, CHAIN_CONFIG.addresses.nounsTreasury, amount);
  }, [approveErc20, amount]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Image src="/ethereum-logo.png" width={80} height={80} alt="WETH" />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Approve WETH</h4>
        <span className="text-content-secondary">
          Give the Nouns Treasury permission to withdraw the {formatTokenAmount(amount, NATIVE_ASSET_DECIMALS, 6)} WETH
          tip if the prop passes.
        </span>
      </div>
      {progressStepper}
      <div className="flex w-full flex-col gap-1">
        <TransactionButton
          txnState={state}
          onClick={() =>
            approveErc20(CHAIN_CONFIG.addresses.wrappedNativeToken, CHAIN_CONFIG.addresses.nounsTreasury, amount)
          }
          className="w-full"
        >
          Approve WETH
        </TransactionButton>
        <span className="paragraph-sm text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}
