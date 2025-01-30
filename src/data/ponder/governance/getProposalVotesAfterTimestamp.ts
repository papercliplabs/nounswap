import { CHAIN_CONFIG } from "@/config";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { ProposalVote } from "./getProposal";

const query = graphql(/* GraphQL */ `
  query ProposalVotesAfterBlockNumber($id: Int!, $timestamp: BigInt!) {
    proposal(id: $id) {
      votes(
        limit: 1000
        orderBy: "timestamp"
        orderDirection: "desc"
        where: { timestamp_gt: $timestamp }
      ) {
        items {
          ...proposalVoteFragment
        }
      }
    }
  }
`);

export async function getProposalVotesAfterTimestamp(
  proposalId: number,
  timestamp: number,
): Promise<ProposalVote[]> {
  const data = await graphQLFetch(
    CHAIN_CONFIG.ponderIndexerUrl,
    query,
    { id: proposalId, timestamp: timestamp.toString() },
    {
      cache: "no-cache",
    },
  );

  return data?.proposal?.votes?.items ?? [];
}
