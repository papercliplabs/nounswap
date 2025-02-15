"use server";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/config";
import {
  mapProposalOverviewFragmentToProposalOverview,
  ProposalOverview,
} from "./common";
import { getBlockNumber } from "viem/actions";
import { ProposalQuery } from "@/data/generated/ponder/graphql";
import { Address, getAddress, Hex } from "viem";

export interface ProposalTransaction {
  to: Address;
  signature: string;
  value: bigint;
  calldata: Hex;
}

export type ProposalVote = NonNullable<
  NonNullable<ProposalQuery["proposal"]>["votes"]
>["items"][0];

export interface Proposal extends ProposalOverview {
  description: string;
  transactions: ProposalTransaction[];
  votes: ProposalVote[];
}

const query = graphql(/* GraphQL */ `
  query Proposal($id: Int!) {
    proposal(id: $id) {
      ...ProposalOverviewFragment
      description

      targets
      signatures
      values
      calldatas

      votes(limit: 1000, orderBy: "timestamp", orderDirection: "desc") {
        items {
          ...proposalVoteFragment
        }
      }
    }
  }
`);

export async function getProposal(id: number): Promise<Proposal | null> {
  const data = await graphQLFetch(
    CHAIN_CONFIG.ponderIndexerUrl,
    query,
    { id },
    {
      cache: "no-cache",
    },
  );

  const blockNumber = Number(await getBlockNumber(CHAIN_CONFIG.publicClient));
  const timestamp = Math.floor(Date.now() / 1000);

  const proposal = data?.proposal;

  if (proposal) {
    const overview = mapProposalOverviewFragmentToProposalOverview(
      proposal,
      blockNumber,
      timestamp,
    );
    const transactions: ProposalTransaction[] = proposal.targets.map(
      (target, i) => {
        return {
          to: getAddress(target),
          signature: proposal.signatures[i],
          value: BigInt(proposal.values[i]),
          calldata: proposal.calldatas[i] as Hex,
        };
      },
    );

    return {
      ...overview,
      description: proposal.description,
      transactions,
      votes: proposal.votes?.items ?? [],
    };
  } else {
    return null;
  }
}
