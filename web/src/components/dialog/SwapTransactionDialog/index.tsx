import { useEffect, useMemo, useState } from "react";
import ProgressCircle from "../../ProgressCircle";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../../ui/dialogBase";
import { Button } from "../../ui/button";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { Noun } from "@/data/noun/types";
import { useQuery } from "@tanstack/react-query";
import { getDoesNounRequireApproval } from "@/data/noun/getDoesNounRequireApproval";
import { ApproveNoun } from "./ApproveNoun";
import { getDoesErc20RequireApproval } from "@/data/erc20/getDoesNounRequireApproval";
import { ApproveWeth } from "./ApproveWeth";
import { CreatePropCandidate } from "./CreatePropCandidate";

interface SwapTransactionDialogProps {
  userNoun: Noun;
  treasuryNoun: Noun;
  tip: bigint;
  reason: string;
}

export default function SwapTransactionDialog({ userNoun, treasuryNoun, tip, reason }: SwapTransactionDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  const { data: nounRequiresApproval } = useQuery({
    queryKey: ["get-does-noun-require-approval", userNoun.id, CHAIN_CONFIG.addresses.nounsTreasury],
    queryFn: () => getDoesNounRequireApproval(userNoun.id, CHAIN_CONFIG.addresses.nounsTreasury),
    refetchInterval: 1000 * 2,
  });

  const { data: wethRequiresApproval } = useQuery({
    queryKey: ["get-does-erc20-require-approval", userNoun.id, CHAIN_CONFIG.addresses.nounsTreasury],
    queryFn: () =>
      getDoesErc20RequireApproval(
        CHAIN_CONFIG.wrappedNativeTokenAddress,
        userNoun.owner,
        CHAIN_CONFIG.addresses.nounsTreasury,
        tip.toString()
      ),
    refetchInterval: 1000 * 2,
  });

  useEffect(() => {
    if (isConnected && address != userNoun?.owner) {
      // Go back to last page, need to select a new Noun...
      router.back();
    }
  });

  const step: 0 | 1 | 2 | undefined = useMemo(() => {
    if (nounRequiresApproval == undefined || wethRequiresApproval == undefined) {
      return undefined;
    }

    return nounRequiresApproval ? 0 : wethRequiresApproval ? 1 : 2;
  }, [nounRequiresApproval, wethRequiresApproval]);

  const progressStepper = useMemo(
    () => (
      <div className="flex w-full flex-col items-center justify-center gap-3 pt-3 text-content-secondary">
        {step != undefined && (
          <>
            <div className="flex w-full flex-row items-center justify-between px-10">
              <ProgressCircle state={step == 0 ? "active" : "completed"} />
              <div className={twMerge("h-1 w-1/3 bg-background-disabled", step > 0 && "bg-semantic-accent")} />
              <ProgressCircle state={step == 0 ? "todo" : step == 1 ? "active" : "completed"} />
              <div className={twMerge("h-1 w-1/3 bg-background-disabled", step > 1 && "bg-semantic-accent")} />
              <ProgressCircle state={step < 2 ? "todo" : "active"} />
            </div>
            <div className="paragraph-sm flex w-full flex-row justify-between">
              <div className="text-semantic-accent">Approve Noun</div>
              <div className={twMerge(step > 0 && "text-semantic-accent")}>Approve WETH</div>
              <div className={twMerge(step > 1 && "text-semantic-accent")}>Create Prop</div>
            </div>
          </>
        )}
      </div>
    ),
    [step]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button onClick={() => setIsOpen(true)} disabled={reason == undefined || reason == ""}>
        Create Swap Prop
      </Button>

      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12">
        {step == 0 && <ApproveNoun noun={userNoun} progressStepper={progressStepper} />}
        {step == 1 && <ApproveWeth amount={tip} progressStepper={progressStepper} />}
        {step == 2 && (
          <CreatePropCandidate
            userNoun={userNoun}
            treasuryNoun={treasuryNoun}
            tip={tip}
            reason={reason}
            progressStepper={progressStepper}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
