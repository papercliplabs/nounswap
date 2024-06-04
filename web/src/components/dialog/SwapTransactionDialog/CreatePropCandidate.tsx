"use client";
import { ReactNode, useEffect } from "react";
import TransactionButton from "@/components/TransactionButton";
import { Noun } from "@/data/noun/types";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { useCreateSwapPropCandidate } from "@/hooks/transactions/useCreateSwapPropCandidate";

interface ApproveNounProps {
  userNoun: Noun;
  treasuryNoun: Noun;
  tip: bigint;
  reason: string;
  progressStepper: ReactNode;
}

export function CreatePropCandidate({ userNoun, treasuryNoun, tip, reason, progressStepper }: ApproveNounProps) {
  const { createCandidate, error, state } = useCreateSwapPropCandidate();

  // Autotrigger on mount
  useEffect(() => {
    createCandidate(userNoun, treasuryNoun, tip, reason);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <SwapNounGraphic fromNoun={userNoun} toNoun={treasuryNoun} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h4>Create a Swap Prop Candidate</h4>
        <span className="text-content-secondary">
          This will create a prop candidate in the Nouns DAO to swap Noun {userNoun.id} for Noun {treasuryNoun.id}.
        </span>
      </div>
      {progressStepper}
      <div className="flex w-full flex-col gap-1">
        <TransactionButton
          txnState={state}
          onClick={() => createCandidate(userNoun, treasuryNoun, tip, reason)}
          className="w-full"
        >
          Create Prop Candidate
        </TransactionButton>
        <span className="caption text-semantic-negative">{error?.message}</span>
      </div>
    </div>
  );
}

// TODO: move parsing receipt to the component

// const propNumber = useMemo(() => {
//     const log = sendTxnData.receipt?.logs.find((log) => true); // First event is ProposalCreated
//     if (log == undefined) {
//         return undefined;
//     }

//     const event = decodeEventLog({
//         abi: nounsDoaLogicAbi,
//         eventName: "ProposalCreated",
//         data: log.data,
//         topics: log.topics,
//     });

//     return Number((event.args as any)["id"]);
// }, [sendTxnData]);
