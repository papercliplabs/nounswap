import { Noun } from "../../lib/types";
import useApproveNoun from "../../hooks/useApproveNoun";
import { useCreateSwapProp } from "../../hooks/useCreateSwapProp";
import { useEffect, useMemo, useState } from "react";
import { SendTransactionState } from "../../hooks/useSendTransaction";
import NounCard from "../NounCard";
import ProgressCircle from "../ui/ProgressCircle";
import SwapNounGraphic from "../SwapNounGraphic";
import { useRouter, useSearchParams } from "next/navigation";
import useChainSpecificData from "../../hooks/useChainSpecificData";
import { Dialog, DialogContent } from "../ui/dialogBase";
import { Button } from "../ui/button";
import useApproveErc20 from "@/hooks/useApproveErc20";
import getChainSpecificData from "@/lib/chainSpecificData";
import Image from "next/image";
import { formatTokenAmount } from "@/lib/utils";
import { NATIVE_ASSET_DECIMALS } from "@/lib/constants";

interface SwapTransactionDialogProps {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    tip?: bigint;
    reason?: string;
}

export default function SwapTransactionDialog({ userNoun, treasuryNoun, tip, reason }: SwapTransactionDialogProps) {
    const chainSpecificData = useChainSpecificData(treasuryNoun?.chainId);

    const approveNounTxn = useApproveNoun({
        noun: userNoun,
        spender: chainSpecificData.nounsTreasuryAddress,
        onReject: () => setIsOpen(false),
    });

    const approveWethTxn = useApproveErc20({
        chainId: userNoun?.chainId,
        tokenAddress: getChainSpecificData(userNoun?.chainId).wrappedNativeTokenAddress,
        spender: getChainSpecificData(userNoun?.chainId).nounsTreasuryAddress,
        amount: tip ? BigInt(tip) : undefined,
        onReject: () => setIsOpen(false),
    });

    const createSwapPropTxn = useCreateSwapProp({
        userNoun,
        treasuryNoun,
        tip,
        reason,
        onReject: () => setIsOpen(false),
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            if (approveNounTxn.requiresApproval) {
                if (approveNounTxn.state == SendTransactionState.Idle) {
                    approveNounTxn.send?.();
                } else if (approveNounTxn.state == SendTransactionState.Rejected) {
                    approveNounTxn.reset();
                }
            } else if (approveWethTxn.requiresApproval) {
                if (approveWethTxn.state == SendTransactionState.Idle) {
                    approveWethTxn.send?.();
                } else if (approveWethTxn.state == SendTransactionState.Rejected) {
                    approveWethTxn.reset();
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
    }, [isOpen, approveNounTxn, createSwapPropTxn, approveWethTxn, router, searchParams]);

    console.log("Approve txn state", approveNounTxn.state);
    console.log("Create prop txn state", createSwapPropTxn.state);

    console.log(userNoun, treasuryNoun, tip, reason);

    const focusedTxn = useMemo(() => {
        return approveNounTxn.requiresApproval ? approveNounTxn : createSwapPropTxn;
    }, [approveNounTxn, createSwapPropTxn]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <Button
                onClick={() => setIsOpen(true)}
                disabled={!userNoun || !treasuryNoun || tip == undefined || reason == undefined || reason == ""}
            >
                Create Swap Prop
            </Button>
            <DialogContent>
                <div className="px-6 pt-12">
                    {!userNoun || !treasuryNoun ? (
                        "Invalid nouns selected"
                    ) : (
                        <div className="flex flex-col gap-6 justify-center items-center">
                            {approveNounTxn.requiresApproval ? (
                                <>
                                    <NounCard noun={userNoun} size={80} enableHover={false} />
                                    <div className="flex flex-col justify-center items-center text-center gap-2">
                                        <h4>Approve Noun {userNoun.id}</h4>
                                        <span className="text-secondary">
                                            This will give the Nouns Treasury permission to swap your Noun if the prop
                                            passes.{" "}
                                        </span>
                                    </div>
                                </>
                            ) : approveWethTxn.requiresApproval ? (
                                <>
                                    <Image src="/ethereum-logo.png" width={80} height={80} alt="WETH" />
                                    <div className="flex flex-col justify-center items-center text-center gap-2">
                                        <h4>Approve WETH</h4>
                                        <span className="text-secondary">
                                            Give the Nouns Treasury permission to withdraw{" "}
                                            {formatTokenAmount(tip, NATIVE_ASSET_DECIMALS, 6)} WETH if the prop passes.
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <SwapNounGraphic fromNoun={userNoun} toNoun={treasuryNoun} />
                                    <div className="flex flex-col justify-center items-center text-center gap-2 ">
                                        <h4>Create a Swap Prop</h4>
                                        <span className="text-secondary">
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
                            {focusedTxn.state == SendTransactionState.PendingWalletSignature &&
                                "Proceed in your wallet"}
                            {focusedTxn.state == SendTransactionState.PendingTransaction && "Pending transaction"}
                            {focusedTxn.state == SendTransactionState.Failed && "Transaction failed!"}{" "}
                            {/** TODO: remove */}
                        </div>
                        <div className="flex flex-row gap-[7px] justify-center items-center">
                            <ProgressCircle state={approveNounTxn.requiresApproval ? "active" : "completed"} />
                            <ProgressCircle
                                state={
                                    approveNounTxn.requiresApproval
                                        ? "todo"
                                        : approveWethTxn.requiresApproval
                                        ? "active"
                                        : "completed"
                                }
                            />
                            <ProgressCircle
                                state={
                                    approveNounTxn.requiresApproval || approveWethTxn.requiresApproval
                                        ? "todo"
                                        : "active"
                                }
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
