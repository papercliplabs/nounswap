"use server";
import { ProposalState, SwapNounProposal } from "../lib/types";
import { Address, createPublicClient, http } from "viem";
import getClientForChain from "./ApolloClient";
import { gql } from "./__generated__/gql";
import { getNounById } from "./getNounById";
import { ProposalStatus } from "./__generated__/graphql";
import { goerli, mainnet } from "viem/chains"; // TODO: need to remember to update!
import { washChainId } from "../lib/chainSpecificData";
import { split } from "postcss/lib/list";

const query = gql(`
    query NounSwapProposalsForProposer($proposerAsString: String!, $proposerAsBytes: Bytes!) {
        proposals(where: { proposer: $proposerAsString, title_contains: "NounSwap" }, first: 1000, orderBy: id, orderDirection: desc) {
            id
            title
            description
            status
            quorumVotes
            forVotes
            againstVotes
            endBlock
            startBlock
        }
        proposalCandidates(where: { proposer: $proposerAsBytes, slug_contains: "nounswap" }, first: 1000, orderBy: id, orderDirection: desc) {
            id
            slug
        }
    }
`);

export async function getNounSwapProposalsForProposer(
    address?: Address,
    chainId?: number
): Promise<SwapNounProposal[]> {
    if (address == undefined) {
        return [];
    }

    const washedChainId = washChainId(chainId);

    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(mainnet.rpcUrls.alchemy.http + "/" + process.env.NEXT_PUBLIC_ALCHEMY_ID),
        pollingInterval: 10_000,
    });

    // Nextjs is caching this...
    const currentBlock = await publicClient.getBlockNumber({ cacheTime: 10_000 });

    const proposer = address.toString().toLowerCase();

    const { data: queryResult } = await getClientForChain(washedChainId).query({
        query: query,
        variables: { proposerAsString: proposer, proposerAsBytes: proposer },
    });

    if (queryResult) {
        const proposals = queryResult.proposals;
        const proposalCandidates = queryResult.proposalCandidates;

        const swapNounProposals: SwapNounProposal[] = [];

        for (let proposal of proposals) {
            const title = proposal.title;

            let v0 = title.match(/NounSwap:/) != null;
            let v1 = title.match(/NounSwap v1:/) != null;

            let fromNounId = "";
            let toNounId = "";
            if (v0) {
                const match = title.match(/NounSwap: Swap Noun [0-9]* for Noun [0-9]*/); // NounSwap: Swap Noun XX for Noun YY
                if (match == null || match.length == 0) {
                    continue;
                }
                const split = match[0].split(" ");
                fromNounId = split[3];
                toNounId = split[6];
            } else {
                let match = title.match(/NounSwap v1: Swap Noun [0-9]* \+ [0-9]*\.?[0-9]*? WETH for Noun [0-9]*/); // NounSwap v1: Swap Noun XX + ZZ WETH for Noun YY
                if (match != null && match.length != 0) {
                    const split = match[0].split(" ");
                    fromNounId = split[4];
                    toNounId = split[10];
                } else {
                    match = title.match(/NounSwap v1: Swap Noun [0-9]* for Noun [0-9]*/); // NounSwap v1: Swap Noun XX for Noun YY (no WETH)
                    if(match == null || match.length == 0) {
                        continue
                    }

                    const split = match[0].split(" ");
                    fromNounId = split[4]
                    toNounId = split[7]
                }
            }


            const fromNoun = await getNounById(fromNounId, washedChainId);
            const toNoun = await getNounById(toNounId, washedChainId);

            const started = currentBlock > proposal.startBlock;
            const ended = currentBlock > proposal.endBlock;
            const passing = proposal.forVotes >= proposal.quorumVotes && proposal.forVotes > proposal.againstVotes;

            // Compute actual state, subgraph can't know with Active and Pending since no events
            let state: ProposalState = ProposalState.Cancelled;
            switch (proposal.status) {
                case ProposalStatus.Cancelled:
                    state = ProposalState.Cancelled;
                    break;
                case ProposalStatus.Executed:
                    state = ProposalState.Executed;
                    break;
                case ProposalStatus.Queued:
                    state = ProposalState.Queued;
                    break;
                case ProposalStatus.Vetoed:
                    state = ProposalState.Vetoed;
                    break;
                case ProposalStatus.Active:
                    if (ended) {
                        state = passing ? ProposalState.Succeeded : ProposalState.Defeated;
                    } else {
                        state = ProposalState.Active;
                    }
                    break;
                case ProposalStatus.Pending:
                    if (ended) {
                        state = ProposalState.Defeated;
                    } else if (started) {
                        state = ProposalState.Active;
                    } else {
                        state = ProposalState.Pending;
                    }
                    break;
            }

            swapNounProposals.push({
                id: Number(proposal.id),
                fromNoun: fromNoun,
                toNoun: toNoun,
                state: state,
            } as SwapNounProposal);
        }

        const swapNounCandidates: SwapNounProposal[] = [];
        for (let proposalCandidate of proposalCandidates) {
            // Only v1 supports candidates

            const match = proposalCandidate.slug.match(
                /nounswap-v1-swap-noun-[0-9]*--[0-9]*\.?[0-9]*?-weth-for-noun-[0-9]*/
            ); // NounSwap v1: Swap Noun XX + ZZ WETH for Noun YY

            let fromNounId = "";
            let toNounId = "";
            if (match != null && match.length != 0) {
                const split = match[0].split("-");
                fromNounId = split[4];
                toNounId = split[10];
            } else {
                const match = proposalCandidate.slug.match(
                    /nounswap-v1-swap-noun-[0-9]*-for-noun-[0-9]*/
                ); // NounSwap v1: Swap Noun XX + ZZ WETH for Noun YY
                if(match == null || match.length == 0) {
                    continue;
                }
                const split = match[0].split("-");
                fromNounId = split[4];
                toNounId = split[7];
            }

            const fromNoun = await getNounById(fromNounId, washedChainId);
            const toNoun = await getNounById(toNounId, washedChainId);

            swapNounCandidates.push({
                id: proposalCandidate.id,
                fromNoun: fromNoun,
                toNoun: toNoun,
                state: ProposalState.Candidate,
            } as SwapNounProposal);
        }

        return [...swapNounCandidates, ...swapNounProposals];
    } else {
        console.log(`getNounSwapProposalsForProposer: no proposals found - ${address}`);
        return [];
    }
}
