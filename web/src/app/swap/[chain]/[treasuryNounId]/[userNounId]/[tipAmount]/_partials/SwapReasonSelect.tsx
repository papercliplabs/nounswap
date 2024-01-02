"use client";

import { Noun } from "@/lib/types";
import SwapTransactionDialog from "../../../../../../../components/dialog/SwapTransactionDialog";
import { useState } from "react";
import Icon from "../../../../../../../components/ui/Icon";
import { Input } from "../../../../../../../components/ui/input";
import NounCard from "../../../../../../../components/NounCard";
import Image from "next/image";
import { formatTokenAmount } from "@/lib/utils";
import { NATIVE_ASSET_DECIMALS } from "@/lib/constants";
import { Textarea } from "../../../../../../../components/ui/textarea";

interface SwapReasonSelectProps {
    userNoun: Noun;
    treasuryNoun: Noun;
    tip: bigint;
}

export default function SwapReasonSelect({ userNoun, treasuryNoun, tip }: SwapReasonSelectProps) {
    const [reason, setReason] = useState<string>("");

    return (
        <>
            <div className="flex flex-col grow justify-between md:pb-[72px] items-center">
                <div className="flex flex-col md:flex-row w-full grow justify-center max-w-[1200px] p-4 gap-6">
                    <div className="flex-[2] flex flex-col gap-4">
                        <div className="bg-accent-light w-full rounded-2xl p-4 gap-2 flex flex-row items-center caption">
                            <Icon icon="questionCircle" size={16} className="shrink-0" />
                            This will show up in the prop. Be honest and be detailed.
                        </div>
                        <h5 className="pt-2">Why do you want Noun {treasuryNoun.id}?</h5>
                        <Textarea
                            className="grow justify-start text-base p-6"
                            placeholder={`The reason I want to swap for Noun ${treasuryNoun.id} is because...`}
                            onChange={(event) => setReason(event.target.value)}
                            value={reason}
                        />
                    </div>
                    <div className="flex-1 flex flex-col bg-secondary h-fit p-1 pt-4 rounded-3xl items-center gap-1 ">
                        <h6 className="pb-2">Review</h6>
                        <div className="flex flex-col bg-primary rounded-[20px] w-full px-4 pt-4 pb-8 justify-center items-center text-secondary gap-4 relative">
                            You offer
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <NounCard noun={userNoun} size={100} enableHover={false} alwaysShowNumber />
                                <Icon icon="plus" size={20} className="fill-gray-600" />
                                <div className="h-[100px] flex justify-center items-center bg-secondary px-4 py-2 gap-3 rounded-xl">
                                    <h6 className="text-primary">
                                        {formatTokenAmount(tip, NATIVE_ASSET_DECIMALS, 6)} WETH
                                    </h6>
                                </div>
                            </div>
                            <Icon
                                icon="repeat"
                                size={52}
                                className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full p-3 bg-primary border-4 border-secondary"
                            />
                        </div>
                        <div className="flex flex-col bg-primary rounded-[20px] w-full px-4 pt-8 pb-4 justify-center items-center text-secondary gap-4">
                            For
                            <NounCard noun={treasuryNoun} size={100} enableHover={false} alwaysShowNumber />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row w-full justify-end px-4 md:px-10 py-4 md:py-2 item-center items-center gap-6 text-secondary md:fixed md:bottom-0 md:bg-white md:border-t-4 border-secondary">
                    <span>Creates a prop in Nouns governance.</span>
                    <SwapTransactionDialog userNoun={userNoun} treasuryNoun={treasuryNoun} tip={tip} reason={reason} />
                </div>
            </div>
        </>
    );
}
