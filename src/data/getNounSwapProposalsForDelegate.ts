"use server";
import { SwapNounProposal } from "@/common/types";
import { Address } from "viem";
import { getClient } from "./ApolloClient";
import { gql } from "@/data/__generated__/gql";
import { getNounById } from "./getNounById";

const query = gql(`
    query NounSwapProposalsForDelegate($id: ID!) {
        delegate(id: $id) {
            proposals(where: { title_contains: "NounSwap" }, first: 1000, orderBy: id, orderDirection: desc) {
                id
                title
                description
                status
            }
        }
    }
`);

export async function getNounSwapProposalsForDelegate(address?: Address): Promise<SwapNounProposal[]> {
    if (address == undefined) {
        return [];
    }

    const { data: queryResult } = await getClient().query({
        query: query,
        variables: { id: address.toString().toLowerCase() },
    });

    if (queryResult.delegate) {
        const data = queryResult.delegate;

        const swapNounProposals: SwapNounProposal[] = [];
        for (let proposal of data.proposals) {
            const title = proposal.title;
            const match = title.match(/Swap Noun [0-9]* for Noun [0-9]*/)![0]; // Swap Noun XX for Noun YY
            const split = match.split(" ");
            const fromNounId = split[2];
            const toNounId = split[5];

            const fromNoun = await getNounById(fromNounId);
            const toNoun = await getNounById(toNounId);

            swapNounProposals.push({
                id: Number(proposal.id),
                fromNoun: fromNoun,
                toNoun: toNoun,
                status: proposal.status,
            } as SwapNounProposal);
        }

        return swapNounProposals;
    } else {
        console.log(`getNounSwapProposalsForDelegate: no proposals found - ${address}`);
        return [];
    }
}
