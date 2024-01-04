"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogBase";
import Icon from "../ui/Icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { NATIVE_ASSET_DECIMALS } from "@/lib/constants";
import { mainnet } from "wagmi";
import getChainSpecificData from "@/lib/chainSpecificData";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { formatTokenAmount } from "@/lib/utils";
import { LinkExternal } from "../ui/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface UserTipDialogProps {
    connected: boolean;
    userBalance?: bigint;
    swapUrl: string;

    tip?: bigint;
    setTipCallback: (amount?: bigint) => void;
}

export default function UserTipDialog({ connected, userBalance, swapUrl, tip, setTipCallback }: UserTipDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [formattedInputValue, setFormattedInputValue] = useState<string | undefined>(undefined);

    const { openConnectModal } = useConnectModal();

    const insufficientBalance = useMemo(() => {
        if (userBalance != undefined && formattedInputValue != undefined) {
            return userBalance < parseEther(formattedInputValue);
        } else {
            false;
        }
    }, [userBalance, formattedInputValue]);

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <>
                {tip != undefined ? (
                    <div className="relative hover:cursor-pointer">
                        <button
                            onClick={() => setOpen(true)}
                            className="flex flex-col bg-secondary w-[200px] h-[200px] rounded-3xl justify-center items-center gap-4"
                        >
                            <Image src="/ethereum-logo.png" width={64} height={64} alt="WETH" />
                            <h5>{formatTokenAmount(tip, NATIVE_ASSET_DECIMALS, 6)} WETH</h5>
                        </button>
                        <button
                            onClick={() => setTipCallback(undefined)}
                            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
                        >
                            <Icon
                                icon="xCircle"
                                size={40}
                                className="border-4 rounded-full border-white fill-gray-600"
                            />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => (connected ? setOpen(true) : openConnectModal?.())}
                        className="h-[200px] w-[200px] border-4 border-dashed rounded-[20px] p-8 flex flex-col gap-2 text-secondary justify-center items-center hover:brightness-[85%] bg-ternary"
                    >
                        <Image src="/tip.png" width={64} height={64} alt="" />
                        <h6>Add a tip</h6>
                    </button>
                )}
            </>

            <DialogContent className="max-w-[425px] max-h-[80vh] flex flex-col overflow-y-auto">
                <h4>Add a tip</h4>
                <div className="flex flex-col gap-4">
                    <div>
                        Incentivize the DAO to accept the Swap Prop. <br />
                        You only pay this if the prop passes.
                    </div>
                    <div>
                        <div className="relative">
                            <Input
                                placeholder="0.00"
                                value={formattedInputValue}
                                className={twMerge("pr-24", insufficientBalance && "border-negative")}
                                onChange={(e) => {
                                    // Only positive decimal number inputs
                                    const regex = /^(0|0[.][0-9]*|[1-9][0-9]*[.]?[0-9]*)$/;
                                    if (e.target.value == "" || regex.test(e.target.value)) {
                                        setFormattedInputValue(e.target.value);
                                    }
                                }}
                            />
                            <div
                                className={twMerge(
                                    "absolute pl-4 right-5 top-1/2 -translate-y-1/2 border-l-2 h-full flex items-center  text-secondary",
                                    insufficientBalance && "border-negative"
                                )}
                            >
                                WETH
                            </div>
                        </div>
                        <div className={twMerge("text-negative hidden", insufficientBalance && "flex")}>
                            Insufficient WETH balance.
                        </div>
                    </div>
                    <div className="text-secondary">
                        Balance:{" "}
                        <span className="font-bold">
                            {userBalance != undefined ? formatTokenAmount(userBalance, NATIVE_ASSET_DECIMALS, 6) : "--"}{" "}
                            WETH{" "}
                            <button
                                onClick={() =>
                                    userBalance != undefined ? setFormattedInputValue(formatEther(userBalance)) : {}
                                }
                                className="text-accent hover:text-accent-dark"
                            >
                                (Max)
                            </button>
                        </span>
                    </div>

                    <div className="flex flex-row p-4 bg-accent-light rounded-xl gap-3 items-center ">
                        <Icon icon="questionCircle" size={16} className="shrink-0" />
                        <div className="caption">
                            Make sure you have enough WETH in your wallet when the prop executes.
                            <div className="flex flex-row justify-between pt-2 ">
                                <Tooltip>
                                    <TooltipTrigger className="text-secondary underline ">
                                        <div>Why Wrapped ETH?</div>
                                    </TooltipTrigger>
                                    <TooltipContent className="flex flex-col gap-2 max-w-[270px]">
                                        <h6>Why WETH instead of ETH?</h6>
                                        <div>
                                            Using ETH as the tip would require sending it with the creation or execution
                                            transaction, and additional smart contract logic to ensure it is the correct
                                            amount for the proposal.
                                        </div>
                                        <div>
                                            In contrast, WETH can be pre-approved, then the transfer is executed and
                                            enforced as a transaction within the proposal.
                                        </div>
                                        <LinkExternal href={swapUrl} className="underline">
                                            Get Wrapped ETH
                                        </LinkExternal>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            setTipCallback(
                                formattedInputValue != undefined
                                    ? parseUnits(formattedInputValue, NATIVE_ASSET_DECIMALS)
                                    : undefined
                            );
                            setOpen(false);
                        }}
                        disabled={insufficientBalance || formattedInputValue == undefined || formattedInputValue == ""}
                    >
                        Add tip
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
