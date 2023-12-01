import { Address } from "wagmi";
import WalletButton from "../../../components/WalletButton";
import SwapNounGraphic from "../../../components/SwapNounGraphic";
import { twMerge } from "tailwind-merge";
import { getNounSwapProposalsForDelegate } from "../../../data/getNounSwapProposalsForDelegate";
import LinkRetainParams from "../../../components/LinkRetainParams";
import Link from "next/link";
import { ProposalState } from "../../../common/types";
import getChainSpecificData from "../../../common/chainSpecificData";

export default async function Proposals({ searchParams }: { searchParams: { address?: Address; chain?: number } }) {
    const proposals = await getNounSwapProposalsForDelegate(searchParams.address, searchParams.chain);
    const chainSpecificData = getChainSpecificData(searchParams.chain);

    return (
        <div className="flex flex-col gap-4 w-full justify-center items-center text-gray-600">
            {searchParams.address == undefined ? (
                <>
                    <div>Connect your wallet to view your proposals</div>
                    <WalletButton />
                </>
            ) : proposals.length == 0 ? (
                <div>
                    No NounSwap proposals found, you can create one from the{" "}
                    <LinkRetainParams href="/" className="inline">
                        Explore Page
                    </LinkRetainParams>
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
