import { Address } from "wagmi";
import WalletButton from "@/components/WalletButton";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { NOUNS_WTF_PROP_URL } from "@/common/constants";
import { twMerge } from "tailwind-merge";
import { getNounSwapProposalsForDelegate } from "@/data/getNounSwapProposalsForDelegate";
import LinkRetainParams from "@/components/LinkRetainParams";

export default async function Proposals({ searchParams }: { searchParams: { address?: Address; chain?: string } }) {
    const proposals = await getNounSwapProposalsForDelegate(searchParams.address);

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
                            <LinkRetainParams
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
                                        (proposal.status == "CANCELLED" || proposal.status == "VETOED") && "bg-red-500"
                                    )}
                                >
                                    {proposal.status}
                                </div>
                            </LinkRetainParams>
                        );
                    })}
                </>
            )}
        </div>
    );
}
