import { Address } from "wagmi";
import WalletButton from "@/components/WalletButton";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { twMerge } from "tailwind-merge";
import { getNounSwapProposalsForDelegate } from "@/data/getNounSwapProposalsForDelegate";
import { LinkExternal, LinkInternal } from "@/components/ui/link";
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
        <div className="flex flex-col gap-4 w-full justify-center items-center text-secondary">
            {address == undefined ? (
                <div className="flex flex-col py-24 justify-center items-center text-center gap-6 rounded-3xl border-4 w-full">
                    <h4 className="text-primary">Connect your wallet to view your props</h4>
                    <WalletButton />
                </div>
            ) : proposals.length == 0 ? (
                <div className="flex flex-col py-24 justify-center items-center text-center gap-2 rounded-3xl border-4 w-full">
                    <h4 className="text-primary">You don{"'"}t have any Swap Props</h4>
                    <span>
                        You can create one from the{" "}
                        <Suspense fallback={<LoadingSpinner />}>
                            <LinkInternal href="/" className="inline text-accent hover:text-accent-dark">
                                Explore Page
                            </LinkInternal>
                        </Suspense>
                    </span>
                </div>
            ) : (
                <>
                    {proposals.map((proposal, i) => {
                        return (
                            <LinkExternal
                                href={chainSpecificData.nounsFrontendUrl + "/vote/" + proposal.id}
                                className="flex flex-col md:flex-row w-full border-2 border-secondary p-6 rounded-2xl text-secondary hover:bg-secondary text-center md:text-start md:justify-start items-center gap-4 "
                                key={i}
                            >
                                <SwapNounGraphic fromNoun={proposal.fromNoun} toNoun={proposal.toNoun} />
                                <div className="flex flex-col justify-center md:justify-start">
                                    <h4 className="text-primary">Prop {proposal.id}</h4>
                                    <div className="text-secondary">
                                        Swap Noun {proposal.fromNoun.id} for Noun {proposal.toNoun.id}
                                    </div>
                                </div>
                                <div
                                    className={twMerge(
                                        "flex bg-disabled px-8 py-4 rounded-2xl text-white justify-self-end ml-auto w-full md:w-auto justify-center font-londrina",
                                        (proposal.state == ProposalState.Active ||
                                            proposal.state == ProposalState.Pending) &&
                                            "bg-positive",
                                        (proposal.state == ProposalState.Defeated ||
                                            proposal.state == ProposalState.Vetoed) &&
                                            "bg-negative",
                                        (proposal.state == ProposalState.Executed ||
                                            proposal.state == ProposalState.Succeeded) &&
                                            "bg-accent"
                                    )}
                                >
                                    {proposal.state}
                                </div>
                            </LinkExternal>
                        );
                    })}
                </>
            )}
        </div>
    );
}
