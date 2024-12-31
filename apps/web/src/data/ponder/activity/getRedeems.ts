"use server";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { RedeemsQuery } from "@/data/generated/ponder/graphql";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { CHAIN_CONFIG } from "@/config";

const query = graphql(/* GraphQL */ `
  query Redeems($cursor: String) {
    nounsErc20Redeems(limit: 1000, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      items {
        redeemerId
        nounsNftId
        transaction {
          id
          timestamp
        }
      }
    }
  }
`);

async function runPaginatedQuery() {
  let cursor: string | undefined | null = undefined;
  let items: RedeemsQuery["nounsErc20Redeems"]["items"] = [];
  while (true) {
    const data: RedeemsQuery = await graphQLFetch(
      CHAIN_CONFIG.ponderIndexerUrl,
      query,
      { cursor },
      {
        next: {
          revalidate: 0,
        },
      }
    );
    items = items.concat(data.nounsErc20Redeems.items);

    if (data.nounsErc20Redeems.pageInfo.hasNextPage && data.nounsErc20Redeems.pageInfo.endCursor) {
      cursor = data.nounsErc20Redeems.pageInfo.endCursor;
    } else {
      break;
    }
  }

  return items;
}

export async function getRedeems() {
  const data = await runPaginatedQuery();
  return data;
}
