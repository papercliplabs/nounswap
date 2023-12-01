import { Noun } from "../common/types";
import Modal from "./Modal";
import useApproveNoun from "../hooks/useApproveNoun";
import { useCreateSwapProp } from "../hooks/useCreateSwapProp";
import { useEffect, useMemo } from "react";
import { SendTransactionState } from "../hooks/useSendTransaction";
import NounCard from "./NounCard";
import ProgressCircle from "./ProgressCircle";
import SwapNounGraphic from "./SwapNounGraphic";
import { useRouter, useSearchParams } from "next/navigation";
import useChainSpecificData from "../hooks/useChainSpecificData";

interface SwapTransactionModalProps {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    isOpen: boolean;
    onClose: () => void;
}

export default function SwapTransactionModal({ userNoun, treasuryNoun, isOpen, onClose }: SwapTransactionModalProps) {
    const chainSpecificData = useChainSpecificData(treasuryNoun?.chainId);
    const approveNounTxn = useApproveNoun({
        noun: userNoun,
        spender: chainSpecificData.nounsTreasuryAddress,
        onReject: onClose,
    });
    const createSwapPropTxn = useCreateSwapProp({ userNoun, treasuryNoun, onReject: onClose });
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isOpen) {
            if (approveNounTxn.requiresApproval) {
                if (approveNounTxn.state == SendTransactionState.Idle) {
                    approveNounTxn.send?.();
                } else if (approveNounTxn.state == SendTransactionState.Rejected) {
                    approveNounTxn.reset();
                }
            } else {
                if (createSwapPropTxn.state == SendTransactionState.Idle) {
                    createSwapPropTxn.send?.();
                } else if (createSwapPropTxn.state == SendTransactionState.Rejected) {
                    createSwapPropTxn.reset();
                }
            }
        }

        if (createSwapPropTxn.state == SendTransactionState.Success) {
            // Push over to proposals page on success
            router.push("/proposals" + "?" + searchParams.toString());
        }
    }, [isOpen, approveNounTxn, createSwapPropTxn, router, searchParams]);

    console.log("Approve txn state", approveNounTxn.state);
    console.log("Create prop txn state", createSwapPropTxn.state);

    const focusedTxn = useMemo(() => {
        return approveNounTxn.requiresApproval ? approveNounTxn : createSwapPropTxn;
    }, [approveNounTxn, createSwapPropTxn]);

    if (!userNoun || !treasuryNoun) {
        return <></>; // Ignore for now...
    }

    return (
        <Modal title="" isOpen={isOpen} onClose={onClose}>
            <div className="px-6">
                {!userNoun || !treasuryNoun ? (
                    "Invalid nouns selected"
                ) : (
                    <div className="flex flex-col gap-6 justify-center items-center">
                        {approveNounTxn.requiresApproval ? (
                            <>
                                <NounCard noun={userNoun} size={80} enableHover={false} />
                                <div className="flex flex-col justify-center items-center text-center gap-2">
                                    <h4>Approve Noun {userNoun.id}</h4>
                                    <span className="text-gray-600">
                                        This will give the Nouns Treasury permission to swap your Noun if the prop
                                        passes.{" "}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <SwapNounGraphic fromNoun={userNoun} toNoun={treasuryNoun} />
                                <div className="flex flex-col justify-center items-center text-center gap-2 ">
                                    <h4>Create a Swap Prop</h4>
                                    <span className="text-gray-600">
                                        This will create a prop in the Nouns DAO to swap Noun {userNoun.id} for Noun{" "}
                                        {treasuryNoun.id}.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-4 pt-12 pb-6 text-gray-600 justify-center items-center">
                    <div className="flex flex-row">
                        {focusedTxn.state == SendTransactionState.PendingWalletSignature && "Proceed in your wallet"}
                        {focusedTxn.state == SendTransactionState.PendingTransaction && "Pending transaction"}
                        {focusedTxn.state == SendTransactionState.Failed && "Transaction failed!"} {/** TODO: remove */}
                    </div>
                    <div className="flex flex-row gap-[7px] justify-center items-center">
                        <ProgressCircle state={approveNounTxn.requiresApproval ? "active" : "completed"} />
                        <ProgressCircle state={approveNounTxn.requiresApproval ? "todo" : "active"} />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
