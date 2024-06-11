"use client";
import { useEffect, useMemo, useState } from "react";
import ProgressCircle from "../ProgressCircle";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialogBase";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { Noun } from "@/data/noun/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDoesNounRequireApproval,
  getDoesNounRequireApprovalAndIsOwner,
} from "@/data/noun/getDoesNounRequireApproval";
import { ApproveNoun } from "./transactionDialogPages/ApproveNoun";
import { CreateInstantSwap } from "./transactionDialogPages/CreateInstantSwap";
import { NounsErc20DepositNoun } from "./transactionDialogPages/NounsErc20DepositNoun";

interface NounToErc20DialogProps {
  depositNoun?: Noun;
}

export default function NounToErc20Dialog({ depositNoun }: NounToErc20DialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address } = useAccount();

  const { data: nounRequiresApproval } = useQuery({
    queryKey: [
      "get-does-noun-require-approval-and-is-owner",
      depositNoun?.id,
      address,
      CHAIN_CONFIG.addresses.nounsErc20,
    ],
    queryFn: () => getDoesNounRequireApprovalAndIsOwner(depositNoun!.id, address!, CHAIN_CONFIG.addresses.nounsErc20),
    refetchInterval: 1000 * 2,
    enabled: depositNoun != undefined && address != undefined,
  });

  const step: 0 | 1 | undefined = useMemo(() => {
    if (nounRequiresApproval == undefined) {
      return undefined;
    }

    return nounRequiresApproval ? 0 : 1;
  }, [nounRequiresApproval]);

  const progressStepper = useMemo(
    () => (
      <div className="text-content-secondary flex w-full flex-col items-center justify-center gap-3 pt-3">
        {step != undefined && (
          <>
            <div className="paragraph-sm flex w-full flex-row items-center justify-center gap-3 px-10 pb-8">
              <div className="relative">
                <ProgressCircle state={step == 0 ? "active" : "completed"} />
                <div className="text-semantic-accent absolute top-6 w-fit -translate-x-[calc(50%-6px)] whitespace-nowrap">
                  Approve Noun
                </div>
              </div>
              <div className={twMerge("bg-background-disabled h-1 w-1/3", step > 0 && "bg-semantic-accent")} />
              <div className="relative">
                <ProgressCircle state={step == 0 ? "todo" : step == 1 ? "active" : "completed"} />
                <div
                  className={twMerge(
                    "absolute top-6 w-fit -translate-x-[calc(50%-6px)] whitespace-nowrap",
                    step > 0 && "text-semantic-accent"
                  )}
                >
                  Convert
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    ),
    [step]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button
        className="w-full md:w-fit"
        onClick={() => setIsOpen(true)}
        disabled={depositNoun == undefined || address == undefined}
      >
        Convert to $nouns
      </Button>
      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12">
        {depositNoun && step == 0 && (
          <ApproveNoun
            noun={depositNoun}
            spender={CHAIN_CONFIG.addresses.nounsErc20}
            progressStepper={progressStepper}
            reason="This will give the $nouns ERC-20 contract permission to deposit your Noun."
          />
        )}
        {depositNoun && step == 1 && <NounsErc20DepositNoun noun={depositNoun} progressStepper={progressStepper} />}
      </DialogContent>
    </Dialog>
  );
}
