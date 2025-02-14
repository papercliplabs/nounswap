"use server";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/config";
import { SECONDS_PER_HOUR } from "@/utils/constants";

const query = graphql(/* GraphQL */ `
  query ProposalTitle($id: Int!) {
    proposal(id: $id) {
      title
    }
  }
`);

export async function getProposalTitle(id: number): Promise<string | null> {
  const data = await graphQLFetch(
    CHAIN_CONFIG.ponderIndexerUrl,
    query,
    { id },
    {
      next: {
        revalidate: SECONDS_PER_HOUR,
      },
    },
  );

  return data?.proposal?.title ?? null;
}
