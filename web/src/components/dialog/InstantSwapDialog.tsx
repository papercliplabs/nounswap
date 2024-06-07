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
import { getDoesNounRequireApproval } from "@/data/noun/getDoesNounRequireApproval";
import { ApproveNoun } from "./transactionDialogPages/ApproveNoun";
import { CreateInstantSwap } from "./transactionDialogPages/CreateInstantSwap";

interface InstantSwapDialogProps {
  fromNoun?: Noun;
  toNoun: Noun;
}

export default function InstantSwapDialog({ fromNoun, toNoun }: InstantSwapDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address } = useAccount();

  // Latch approval since on transfer will lose approval
  const [latchedRequiresApprove, setLatchedRequiresApprove] = useState<boolean>(true);

  const { data: nounRequiresApproval } = useQuery({
    queryKey: ["get-does-noun-require-approval", fromNoun?.id, CHAIN_CONFIG.addresses.nounsErc20],
    queryFn: () => getDoesNounRequireApproval(fromNoun!.id, CHAIN_CONFIG.addresses.nounsErc20),
    refetchInterval: 1000 * 2,
    enabled: fromNoun != undefined,
  });

  // Latch false once no longer required
  useEffect(() => {
    setLatchedRequiresApprove((prev) => prev && (nounRequiresApproval ?? true));
  }, [nounRequiresApproval, setLatchedRequiresApprove]);

  // Clear latch if fromNoun changes
  useEffect(() => {
    setLatchedRequiresApprove(true);
  }, [fromNoun, setLatchedRequiresApprove]);

  const step: 0 | 1 | undefined = useMemo(() => {
    if (nounRequiresApproval == undefined) {
      return undefined;
    }

    return latchedRequiresApprove ? 0 : 1;
  }, [latchedRequiresApprove, nounRequiresApproval]);

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
                  Swap
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
        disabled={fromNoun == undefined || address == undefined}
      >
        Swap
      </Button>
      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12">
        {fromNoun && step == 0 && (
          <ApproveNoun
            noun={fromNoun}
            spender={CHAIN_CONFIG.addresses.nounsErc20}
            progressStepper={progressStepper}
            reason="This will give the $nouns ERC-20 contract permission to swap your Noun."
          />
        )}
        {fromNoun && step == 1 && (
          <CreateInstantSwap fromNoun={fromNoun} toNoun={toNoun} progressStepper={progressStepper} />
        )}
      </DialogContent>
    </Dialog>
  );
}
