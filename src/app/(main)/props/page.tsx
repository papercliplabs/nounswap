"use client";
import { useAccount, Address } from "wagmi";
import { SwapNounProposal } from "@/common/types";
import { useEffect, useMemo, useState } from "react";
import { ProposalStatus, getBuiltGraphSDK } from "../../../../.graphclient";
import Icon from "@/components/Icon";
import WalletButton from "@/components/WalletButton";
import Link from "next/link";
import { getNounById, getNounSwapProposalsForDelegate } from "@/common/dataFetch";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { NOUNS_WTF_PROP_URL } from "@/common/constants";
import { twMerge } from "tailwind-merge";

export default function Props() {
    const [proposals, setProposals] = useState<SwapNounProposal[] | undefined>(undefined);
    const { address } = useAccount();

    // Client side fetch cuz we need address
    useEffect(() => {
        async function fetchProps() {
            if (address) {
                const proposals = await getNounSwapProposalsForDelegate(address);
                setProposals(proposals);
            }
        }

        fetchProps();
    }, [address, setProposals]);

    return (
        <div className="flex flex-col justify-start items-start w-full max-w-4xl self-center">
            <h1>My Props</h1>
            <span className="pb-10">All of your Swap Props created with NounSwap</span>

            <div className="flex flex-col gap-4 w-full justify-center items-center text-gray-600">
                {address == undefined ? (
                    <>
                        <div>Connect your wallet to view your proposals</div>
                        <WalletButton />
                    </>
                ) : proposals == undefined ? (
                    <>
                        <Icon
                            icon="pending"
                            size={100}
                            className="animate-spin flex flex-row justify-center w-full fill-gray-600"
                        />
                    </>
                ) : proposals.length == 0 ? (
                    <div>
                        No NounSwap proposals found, you can create one from the{" "}
                        <Link href="/" className="inline">
                            Explore Page
                        </Link>
                    </div>
                ) : (
                    <>
                        {proposals.map((proposal, i) => {
                            return (
                                <Link
                                    href={NOUNS_WTF_PROP_URL + "/" + proposal.id}
                                    className="flex flex-row w-full border-2 border-gray-200 p-6 rounded-2xl gap-4 text-gray-600 hover:bg-gray-100 justify-between items-center"
                                    key={i}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="flex flex-row gap-4">
                                        <SwapNounGraphic fromNoun={proposal.fromNoun} toNoun={proposal.toNoun} />
                                        <div className="flex flex-col justify-center ">
                                            <h4 className="text-gray-900">Prop {proposal.id}</h4>
                                            <div>
                                                Swap Noun {proposal.fromNoun.id} for Noun {proposal.toNoun.id}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={twMerge(
                                            "flex justify-end bg-green-600 px-8 py-4 shrink rounded-2xl text-white h-min ",
                                            (proposal.status == "CANCELLED" || proposal.status == "VETOED") &&
                                                "bg-red-500"
                                        )}
                                    >
                                        {proposal.status}
                                    </div>
                                </Link>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
