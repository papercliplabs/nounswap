"use server";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { DepositsQuery } from "@/data/generated/ponder/graphql";
import { CHAIN_CONFIG } from "@/config";

const query = graphql(/* GraphQL */ `
  query Deposits($cursor: String) {
    nounsErc20Deposits(limit: 1000, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      items {
        depositorAccountAddress
        nounsNftId
        transaction {
          hash
          timestamp
        }
      }
    }
  }
`);

async function runPaginatedQuery() {
  let cursor: string | undefined | null = undefined;
  let items: DepositsQuery["nounsErc20Deposits"]["items"] = [];
  while (true) {
    const data: DepositsQuery = await graphQLFetch(
      CHAIN_CONFIG.ponderIndexerUrl,
      query,
      { cursor },
      {
        next: {
          revalidate: 0,
        },
      },
    );
    items = items.concat(data.nounsErc20Deposits.items);

    if (
      data.nounsErc20Deposits.pageInfo.hasNextPage &&
      data.nounsErc20Deposits.pageInfo.endCursor
    ) {
      cursor = data.nounsErc20Deposits.pageInfo.endCursor;
    } else {
      break;
    }
  }

  return items;
}

export async function getDeposits() {
  const data = await runPaginatedQuery();
  return data;
}
