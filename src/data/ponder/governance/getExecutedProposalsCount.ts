"use server";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { CHAIN_CONFIG } from "@/config";
import { SECONDS_PER_DAY } from "@/utils/constants";

const query = graphql(/* GraphQL */ `
  query ExecutedProposalsCount {
    executedProposals {
      totalCount
    }
  }
`);

export async function getExecutedProposalsCount(): Promise<number> {
  const data = await graphQLFetch(
    CHAIN_CONFIG.ponderIndexerUrl,
    query,
    {},
    {
      next: {
        revalidate: SECONDS_PER_DAY,
      },
    },
  );

  return data?.executedProposals.totalCount ?? 0;
}
