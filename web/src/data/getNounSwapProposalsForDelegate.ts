"use server";
import { ProposalState, SwapNounProposal } from "../lib/types";
import { Address, createPublicClient, http } from "viem";
import getClientForChain from "./ApolloClient";
import { gql } from "./__generated__/gql";
import { getNounById } from "./getNounById";
import { ProposalStatus } from "./__generated__/graphql";
import { goerli } from "viem/chains"; // TODO: need to remember to update!
import { washChainId } from "../lib/chainSpecificData";

const query = gql(`
    query NounSwapProposalsForDelegate($id: ID!) {
        delegate(id: $id) {
            proposals(where: { title_contains: "NounSwap" }, first: 1000, orderBy: id, orderDirection: desc) {
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
        }
    }
`);

export async function getNounSwapProposalsForDelegate(
    address?: Address,
    chainId?: number
): Promise<SwapNounProposal[]> {
    if (address == undefined) {
        return [];
    }

    const washedChainId = washChainId(chainId);

    const publicClient = createPublicClient({
        chain: goerli,
        transport: http(goerli.rpcUrls.alchemy.http + "/" + process.env.NEXT_PUBLIC_ALCHEMY_ID),
        pollingInterval: 10_000,
    });

    // Nextjs is caching this...
    const currentBlock = await publicClient.getBlockNumber({ cacheTime: 10_000 });

    const { data: queryResult } = await getClientForChain(washedChainId).query({
        query: query,
        variables: { id: address.toString().toLowerCase() },
    });

    if (queryResult.delegate) {
        const data = queryResult.delegate;

        const swapNounProposals: SwapNounProposal[] = [];
        for (let proposal of data.proposals) {
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
                const match = title.match(/NounSwap v1: Swap Noun [0-9]* \+ [0-9]*\.?[0-9]*? WETH for Noun [0-9]*/); // NounSwap v1: Swap Noun XX + ZZ WETH for Noun YY
                if (match == null || match.length == 0) {
                    continue;
                }
                const split = match[0].split(" ");
                fromNounId = split[4];
                toNounId = split[10];
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

        return swapNounProposals;
    } else {
        console.log(`getNounSwapProposalsForDelegate: no proposals found - ${address}`);
        return [];
    }
}
