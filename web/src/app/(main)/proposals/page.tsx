import { Address } from "wagmi";
import WalletButton from "@/components/WalletButton";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { twMerge } from "tailwind-merge";
import { getNounSwapProposalsForDelegate } from "@/data/getNounSwapProposalsForDelegate";
import LinkRetainParams from "@/components/LinkRetainParams";
import Link from "next/link";
import { ProposalState } from "@/lib/types";
import getChainSpecificData from "@/lib/chainSpecificData";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Proposals({ searchParams }: { searchParams: { address?: Address; chain?: number } }) {
    return (
        <div className="flex flex-col justify-start items-start w-full max-w-4xl self-center">
            <h1>My Props</h1>
            <span className="pb-10">All of your Swap Props created with NounSwap</span>
            <Suspense fallback={<LoadingSpinner />}>
                <ProposalsTable address={searchParams.address} chain={searchParams.chain} />
            </Suspense>
        </div>
    );
}

async function ProposalsTable({ address, chain }: { address?: Address; chain?: number }) {
    const proposals = await getNounSwapProposalsForDelegate(address, chain);
    const chainSpecificData = getChainSpecificData(chain);

    return (
        <div className="flex flex-col gap-4 w-full justify-center items-center text-gray-600">
            {address == undefined ? (
                <div className="flex flex-col py-24 justify-center items-center text-center gap-6 rounded-3xl border-4 border-gray-200 w-full">
                    <h4 className="text-gray-900">Connect your wallet to view your props</h4>
                    <WalletButton />
                </div>
            ) : proposals.length == 0 ? (
                <div className="flex flex-col py-24 justify-center items-center text-center gap-2 rounded-3xl border-4 border-gray-200 w-full">
                    <h4 className="text-gray-900">You don{"'"}t have any Swap Props</h4>
                    <span>
                        You can create one from the{" "}
                        <Suspense fallback={<LoadingSpinner />}>
                            <LinkRetainParams href="/" className="inline">
                                Explore Page
                            </LinkRetainParams>
                        </Suspense>
                    </span>
                </div>
            ) : (
                <>
                    {proposals.map((proposal, i) => {
                        return (
                            <Link
                                href={chainSpecificData.nounsFrontendUrl + "/vote/" + proposal.id}
                                className="flex flex-col md:flex-row w-full border-2 border-gray-200 p-6 rounded-2xl text-gray-600 hover:bg-gray-100 text-center md:text-start md:justify-start items-center gap-4 "
                                key={i}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <SwapNounGraphic fromNoun={proposal.fromNoun} toNoun={proposal.toNoun} />
                                <div className="flex flex-col justify-center md:justify-start">
                                    <h4 className="text-gray-900">Prop {proposal.id}</h4>
                                    <div>
                                        Swap Noun {proposal.fromNoun.id} for Noun {proposal.toNoun.id}
                                    </div>
                                </div>
                                <div
                                    className={twMerge(
                                        "flex bg-gray-400 px-8 py-4 rounded-2xl text-white justify-self-end ml-auto w-full md:w-auto justify-center",
                                        (proposal.state == ProposalState.Active ||
                                            proposal.state == ProposalState.Pending) &&
                                            "bg-green-500",
                                        (proposal.state == ProposalState.Defeated ||
                                            proposal.state == ProposalState.Vetoed) &&
                                            "bg-red-500",
                                        (proposal.state == ProposalState.Executed ||
                                            proposal.state == ProposalState.Succeeded) &&
                                            "bg-blue-500"
                                    )}
                                >
                                    {proposal.state}
                                </div>
                            </Link>
                        );
                    })}
                </>
            )}
        </div>
    );
}
