import WalletButton from "@/components/WalletButton";
import SwapNounGraphic from "@/components/SwapNounGraphic";
import { twMerge } from "tailwind-merge";
import { getNounSwapProposalsForProposer } from "@/data/getNounSwapProposalsForProposer";
import { LinkExternal, LinkInternal } from "@/components/ui/link";
import { ProposalState } from "@/utils/types";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CHAIN_CONFIG } from "@/utils/config";
import { Address } from "viem";

export default function Proposals({ searchParams }: { searchParams: { address?: Address; chain?: number } }) {
  return (
    <div className="flex w-full max-w-4xl flex-col items-start justify-start self-center">
      <h1>My Props</h1>
      <span className="pb-10">All of your Swap Props created with NounSwap</span>
      <Suspense fallback={<LoadingSpinner />}>
        <ProposalsTable address={searchParams.address} chain={searchParams.chain} />
      </Suspense>
    </div>
  );
}

async function ProposalsTable({ address, chain }: { address?: Address; chain?: number }) {
  const proposals = await getNounSwapProposalsForProposer(address);
  const chainSpecificData = CHAIN_CONFIG;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 text-secondary">
      {address == undefined ? (
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl border-4 py-24 text-center">
          <h4 className="text-primary">Connect your wallet to view your props</h4>
          <WalletButton />
        </div>
      ) : proposals.length == 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-4 py-24 text-center">
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
                href={
                  proposal.state == ProposalState.Candidate
                    ? chainSpecificData.nounsFrontendUrl + "/candidates/" + proposal.id
                    : chainSpecificData.nounsFrontendUrl + "/vote/" + proposal.id
                }
                className="flex w-full flex-col items-center gap-4 rounded-2xl border-2 border-secondary p-6 text-center text-secondary hover:bg-secondary md:flex-row md:justify-start md:text-start"
                key={i}
              >
                <SwapNounGraphic fromNoun={proposal.fromNoun} toNoun={proposal.toNoun} />
                <div className="flex flex-col justify-center md:justify-start">
                  <h4 className="text-primary">
                    Prop {proposal.state == ProposalState.Candidate ? "Candidate" : proposal.id}
                  </h4>
                  <div className="text-secondary">
                    Swap Noun {proposal.fromNoun.id} for Noun {proposal.toNoun.id}
                  </div>
                </div>
                <div
                  className={twMerge(
                    "ml-auto flex w-full justify-center justify-self-end rounded-2xl bg-disabled px-8 py-4 font-londrina text-white md:w-auto",
                    (proposal.state == ProposalState.Active || proposal.state == ProposalState.Pending) &&
                      "bg-positive",
                    (proposal.state == ProposalState.Defeated || proposal.state == ProposalState.Vetoed) &&
                      "bg-negative",
                    (proposal.state == ProposalState.Executed || proposal.state == ProposalState.Succeeded) &&
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
