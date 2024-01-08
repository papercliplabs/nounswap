import { Noun } from "../../lib/types";
import useApproveNoun from "../../hooks/useApproveNoun";
import { useCreateSwapPropOrCandidate } from "../../hooks/useCreateSwapPropOrCandidate";
import { useEffect, useMemo, useState } from "react";
import { SendTransactionState } from "../../hooks/useSendTransaction";
import NounCard from "../NounCard";
import ProgressCircle from "../ProgressCircle";
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
import { twMerge } from "tailwind-merge";
import LoadingSpinner from "../LoadingSpinner";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { track } from "@vercel/analytics";

interface SwapTransactionDialogProps {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    tip?: bigint;
    reason?: string;
}

export default function SwapTransactionDialog({ userNoun, treasuryNoun, tip, reason }: SwapTransactionDialogProps) {
    const chainSpecificData = useChainSpecificData(treasuryNoun?.chainId);

    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { openConnectModal } = useConnectModal();
    const { switchNetwork } = useSwitchNetwork();

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

    const createSwapPropTxn = useCreateSwapPropOrCandidate({
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
                if (createSwapPropTxn.state == SendTransactionState.Idle) {
                    track("InitPropApproval");
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

    useEffect(() => {
        if (isConnected && address != userNoun?.owner) {
            // Go back to last page, need to select a new Noun...
            router.back();
        }
    });

    console.log("Approve Noun txn state", approveNounTxn.state);
    console.log("Approve WETH txn state", approveWethTxn.state);
    console.log("Create prop txn state", createSwapPropTxn.state);

    const { step, focusedTxn } = useMemo(() => {
        const step = approveNounTxn.requiresApproval ? 0 : approveWethTxn.requiresApproval ? 1 : 2;
        return { step, focusedTxn: step == 0 ? approveNounTxn : step == 1 ? approveWethTxn : createSwapPropTxn };
    }, [approveNounTxn, approveWethTxn, createSwapPropTxn]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            {isConnected ? (
                chain?.id == userNoun?.chainId ? (
                    <Button
                        onClick={() => setIsOpen(true)}
                        disabled={!userNoun || !treasuryNoun || tip == undefined || reason == undefined || reason == ""}
                    >
                        Create Swap Prop
                    </Button>
                ) : (
                    <Button variant="negative" onClick={() => switchNetwork?.(userNoun?.chainId)}>
                        Wrong Network
                    </Button>
                )
            ) : (
                <Button onClick={() => openConnectModal?.()}>Connect Wallet</Button>
            )}

            <DialogContent className="max-w-[425px] max-h-[80vh] flex flex-col overflow-y-auto pt-12">
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
                                        Give the Nouns Treasury permission to withdraw the{" "}
                                        {formatTokenAmount(tip, NATIVE_ASSET_DECIMALS, 6)} WETH tip if the prop passes.
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <SwapNounGraphic fromNoun={userNoun} toNoun={treasuryNoun} />
                                <div className="flex flex-col justify-center items-center text-center gap-2 ">
                                    <h4>Create a Swap Prop {createSwapPropTxn.requiresPropCandidate && "Candidate"}</h4>
                                    <span className="text-secondary">
                                        This will create a prop {createSwapPropTxn.requiresPropCandidate && "candidate"}{" "}
                                        in the Nouns DAO to swap Noun {userNoun.id} for Noun {treasuryNoun.id}.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-3 text-secondary justify-center items-center">
                    <div className="flex flex-row py-3 w-full justify-center gap-2 caption">
                        {focusedTxn.state == SendTransactionState.PendingWalletSignature && "Proceed in your wallet"}
                        {focusedTxn.state == SendTransactionState.PendingTransaction && (
                            <>
                                <div className="flex justify-center items-center">
                                    <LoadingSpinner size={16} className=" fill-gray-600" />
                                </div>
                                Pending transaction
                            </>
                        )}
                        {focusedTxn.state == SendTransactionState.Failed && "Transaction failed!"}{" "}
                    </div>
                    <div className="flex flex-row w-full justify-between px-10 items-center">
                        <ProgressCircle state={step == 0 ? "active" : "completed"} />
                        <div className={twMerge("h-1 bg-disabled w-1/3", step > 0 && "bg-accent")} />
                        <ProgressCircle state={step == 0 ? "todo" : step == 1 ? "active" : "completed"} />
                        <div className={twMerge("h-1 bg-disabled w-1/3", step > 1 && "bg-accent")} />
                        <ProgressCircle state={step < 2 ? "todo" : "active"} />
                    </div>
                    <div className="flex flex-row w-full justify-between  caption">
                        <div className="text-accent">Approve Noun</div>
                        <div className={twMerge(step > 0 && "text-accent")}>Approve WETH</div>
                        <div className={twMerge(step > 1 && "text-accent")}>Create Prop</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
