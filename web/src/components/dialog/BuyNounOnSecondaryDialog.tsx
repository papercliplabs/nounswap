"use client";
import { useEffect, useMemo, useState } from "react";
import ProgressCircle from "../ProgressCircle";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialogBase";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { useAccount, useWalletClient } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import { Noun } from "@/data/noun/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDoesNounRequireApproval,
  getDoesNounRequireApprovalAndIsOwner,
} from "@/data/noun/getDoesNounRequireApproval";
import { ApproveNoun } from "./transactionDialogPages/ApproveNoun";
import { CreateInstantSwap } from "./transactionDialogPages/CreateInstantSwap";
import Icon from "../ui/Icon";
import { getClient, Execute, buyToken, createClient, reservoirChains } from "@reservoir0x/reservoir-sdk";
import { WalletClient } from "viem";

interface BuyOnSecondaryDialogProps {
  noun: Noun;
}

export default function BuyNounOnSecondaryDialog({ noun }: BuyOnSecondaryDialogProps) {
  const { address } = useAccount();

  // const step: 0 | 1 | undefined = useMemo(() => {
  //   if (nounRequiresApproval == undefined) {
  //     return undefined;
  //   }

  //   return nounRequiresApproval ? 0 : 1;
  // }, [nounRequiresApproval]);

  // const progressStepper = useMemo(
  //   () => (
  //     <div className="text-content-secondary flex w-full flex-col items-center justify-center gap-3 pt-3">
  //       {step != undefined && (
  //         <>
  //           <div className="paragraph-sm flex w-full flex-row items-center justify-center gap-3 px-10 pb-8">
  //             <div className="relative">
  //               <ProgressCircle state={step == 0 ? "active" : "completed"} />
  //               <div className="text-semantic-accent absolute top-6 w-fit -translate-x-[calc(50%-6px)] whitespace-nowrap">
  //                 Approve Noun
  //               </div>
  //             </div>
  //             <div className={twMerge("bg-background-disabled h-1 w-1/3", step > 0 && "bg-semantic-accent")} />
  //             <div className="relative">
  //               <ProgressCircle state={step == 0 ? "todo" : step == 1 ? "active" : "completed"} />
  //               <div
  //                 className={twMerge(
  //                   "absolute top-6 w-fit -translate-x-[calc(50%-6px)] whitespace-nowrap",
  //                   step > 0 && "text-semantic-accent"
  //                 )}
  //               >
  //                 Swap
  //               </div>
  //             </div>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   ),
  //   [step]
  // );

  const { data: walletClient } = useWalletClient();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full gap-[10px]" onClick={() => console.log(noun)} disabled>
          <Icon icon="lightning" size={20} className="fill-white" />
          Buy Noun (coming soon)
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12"
        onInteractOutside={(event) => event.preventDefault()}
      >
        {JSON.stringify(noun.secondaryListing)}
        {/* <Button
          onClick={() => {
            const ret = createClient({
              chains: [
                {
                  ...reservoirChains.sepolia,
                  active: true,
                },
              ],
              source: "reservoirkit.demo",
              synchronousStepItemExecution: true,
            }).actions.buyToken({
              items: [{ orderId: noun.secondaryListing!.orderId }],
              wallet: walletClient,
              onProgress: (steps: Execute["steps"]) => {
                console.log(steps);
              },
            });

            console.log("GOING", ret, getClient());
          }}
        >
          Go
        </Button> */}
        {/* {fromNoun && step == 0 && (
          <ApproveNoun
            noun={fromNoun}
            spender={CHAIN_CONFIG.addresses.nounsErc20}
            progressStepper={progressStepper}
            reason="This will give the $nouns ERC-20 contract permission to swap your Noun."
          />
        )}
        {fromNoun && step == 1 && (
          <CreateInstantSwap fromNoun={fromNoun} toNoun={toNoun} progressStepper={progressStepper} />
        )} */}
      </DialogContent>
    </Dialog>
  );
}
