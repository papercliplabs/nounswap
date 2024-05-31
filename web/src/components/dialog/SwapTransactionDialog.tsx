import useApproveNoun from "../../hooks/useApproveNoun";
// import { useCreateSwapPropOrCandidate } from "../../hooks/useCreateSwapPropOrCandidate";
import { useEffect, useMemo, useState } from "react";
import { SendTransactionState } from "../../hooks/useSendTransaction";
import NounCard from "../NounCard";
import ProgressCircle from "../ProgressCircle";
import SwapNounGraphic from "../SwapNounGraphic";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialogBase";
import { Button } from "../ui/button";
import useApproveErc20 from "@/hooks/useApproveErc20";
import Image from "next/image";
import { formatTokenAmount } from "@/utils/utils";
import { NATIVE_ASSET_DECIMALS } from "@/utils/constants";
import { twMerge } from "tailwind-merge";
import LoadingSpinner from "../LoadingSpinner";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { track } from "@vercel/analytics";
import { CHAIN_CONFIG } from "@/utils/config";
import { Noun } from "@/data/noun/types";

interface SwapTransactionDialogProps {
  userNoun?: Noun;
  treasuryNoun?: Noun;
  tip?: bigint;
  reason?: string;
}

export default function SwapTransactionDialog({ userNoun, treasuryNoun, tip, reason }: SwapTransactionDialogProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const approveNounTxn = useApproveNoun({
    noun: userNoun,
    spender: CHAIN_CONFIG.addresses.nounsTreasury,
    onReject: () => setIsOpen(false),
  });

  const approveWethTxn = useApproveErc20({
    tokenAddress: CHAIN_CONFIG.wrappedNativeTokenAddress,
    spender: CHAIN_CONFIG.addresses.nounsTreasury,
    amount: tip ? BigInt(tip) : undefined,
    onReject: () => setIsOpen(false),
  });

  // const createSwapPropTxn = useCreateSwapPropOrCandidate({
  //   userNoun,
  //   treasuryNoun,
  //   tip,
  //   reason,
  //   onReject: () => setIsOpen(false),
  // });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (approveNounTxn.requiresApproval) {
        if (approveNounTxn.state == SendTransactionState.Idle) {
          track("InitNounApproval");
          approveNounTxn.send?.();
        } else if (approveNounTxn.state == SendTransactionState.Rejected) {
          approveNounTxn.reset();
        }
      } else if (approveWethTxn.requiresApproval) {
        if (approveWethTxn.state == SendTransactionState.Idle) {
          track("InitWethApproval");
          approveWethTxn.send?.();
        } else if (approveWethTxn.state == SendTransactionState.Rejected) {
          approveWethTxn.reset();
        }
      } else {
        // if (createSwapPropTxn.state == SendTransactionState.Idle) {
        //   track("InitPropApproval");
        //   createSwapPropTxn.send?.();
        // } else if (createSwapPropTxn.state == SendTransactionState.Rejected) {
        //   createSwapPropTxn.reset();
        // }
      }
    }

    // if (createSwapPropTxn.state == SendTransactionState.Success) {
    //   // Push over to proposals page on success
    //   router.push("/proposals" + "?" + searchParams.toString());
    // }
  }, [isOpen, approveNounTxn, approveWethTxn, router, searchParams]);

  useEffect(() => {
    if (isConnected && address != userNoun?.owner) {
      // Go back to last page, need to select a new Noun...
      router.back();
    }
  });

  console.log("Approve Noun txn state", approveNounTxn.state);
  console.log("Approve WETH txn state", approveWethTxn.state);
  // console.log("Create prop txn state", createSwapPropTxn.state);

  const { step, focusedTxn } = useMemo(() => {
    const step = approveNounTxn.requiresApproval ? 0 : approveWethTxn.requiresApproval ? 1 : 2;
    return { step, focusedTxn: step == 0 ? approveNounTxn : step == 1 ? approveWethTxn : approveWethTxn }; // TODO
  }, [approveNounTxn, approveWethTxn]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      {isConnected ? (
        <Button
          onClick={() => setIsOpen(true)}
          disabled={!userNoun || !treasuryNoun || tip == undefined || reason == undefined || reason == ""}
        >
          Create Swap Prop
        </Button>
      ) : (
        <Button onClick={() => openConnectModal?.()}>Connect Wallet</Button>
      )}

      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12">
        {!userNoun || !treasuryNoun ? (
          "Invalid nouns selected"
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            {approveNounTxn.requiresApproval ? (
              <>
                <NounCard noun={userNoun} size={80} enableHover={false} />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <h4>Approve Noun {userNoun.id}</h4>
                  <span className="text-secondary">
                    This will give the Nouns Treasury permission to swap your Noun if the prop passes.{" "}
                  </span>
                </div>
              </>
            ) : approveWethTxn.requiresApproval ? (
              <>
                <Image src="/ethereum-logo.png" width={80} height={80} alt="WETH" />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <h4>Approve WETH</h4>
                  <span className="text-secondary">
                    Give the Nouns Treasury permission to withdraw the{" "}
                    {formatTokenAmount(tip, NATIVE_ASSET_DECIMALS, 6)} WETH tip if the prop passes.
                  </span>
                </div>
              </>
            ) : (
              <>
                <SwapNounGraphic fromNoun={userNoun} toNoun={treasuryNoun} />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  {/* <h4>Create a Swap Prop {createSwapPropTxn.requiresPropCandidate && "Candidate"}</h4> */}
                  <span className="text-secondary">
                    {/* This will create a prop {createSwapPropTxn.requiresPropCandidate && "candidate"} in the Nouns DAO to */}
                    swap Noun {userNoun.id} for Noun {treasuryNoun.id}.
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3 text-secondary">
          <div className="caption flex w-full flex-row justify-center gap-2 py-3">
            {focusedTxn.state == SendTransactionState.PendingWalletSignature && "Proceed in your wallet"}
            {focusedTxn.state == SendTransactionState.PendingTransaction && (
              <>
                <div className="flex items-center justify-center">
                  <LoadingSpinner size={16} className="fill-gray-600" />
                </div>
                Pending transaction
              </>
            )}
            {focusedTxn.state == SendTransactionState.Failed && "Transaction failed!"}{" "}
          </div>
          <div className="flex w-full flex-row items-center justify-between px-10">
            <ProgressCircle state={step == 0 ? "active" : "completed"} />
            <div className={twMerge("h-1 w-1/3 bg-disabled", step > 0 && "bg-accent")} />
            <ProgressCircle state={step == 0 ? "todo" : step == 1 ? "active" : "completed"} />
            <div className={twMerge("h-1 w-1/3 bg-disabled", step > 1 && "bg-accent")} />
            <ProgressCircle state={step < 2 ? "todo" : "active"} />
          </div>
          <div className="caption flex w-full flex-row justify-between">
            <div className="text-accent">Approve Noun</div>
            <div className={twMerge(step > 0 && "text-accent")}>Approve WETH</div>
            <div className={twMerge(step > 1 && "text-accent")}>Create Prop</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
