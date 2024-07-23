"use server";
import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import { AccountLeaderboardQuery } from "@/data/generated/ponder/graphql";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { CHAIN_CONFIG } from "@/config";
import { getAddress, isAddressEqual } from "viem";

const MAINNET_BASE_BRIDGE_CONTRACT_ADDRESS = "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";

// Only consider holders with >0.1 of a Noun
const query = graphql(/* GraphQL */ `
  query AccountLeaderboard($cursor: String) {
    accounts(
      orderBy: "effectiveNounsBalance"
      orderDirection: "desc"
      where: { effectiveNounsBalance_gt: "100000000000000000000000" }
      limit: 1000
      after: $cursor
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      items {
        id
        effectiveNounsBalance
      }
    }
  }
`);

async function runPaginatedQuery() {
  let cursor: string | undefined | null = undefined;
  let items: AccountLeaderboardQuery["accounts"]["items"] = [];
  while (true) {
    const data: AccountLeaderboardQuery = await graphQLFetch(
      CHAIN_CONFIG.ponderIndexerUrl,
      query,
      { cursor },
      {
        next: {
          revalidate: SECONDS_PER_DAY / 2,
        },
      }
    );
    items = items.concat(
      data.accounts.items.filter(
        (item) =>
          !isAddressEqual(getAddress(item.id), MAINNET_BASE_BRIDGE_CONTRACT_ADDRESS) && // Exclude bridge contract, otherwise will double count these
          !isAddressEqual(getAddress(item.id), CHAIN_CONFIG.addresses.nounsErc20) // Exclude Nouns ERC20 contract, otherwise will double count these
      )
    );

    if (data.accounts.pageInfo.hasNextPage && data.accounts.pageInfo.endCursor) {
      cursor = data.accounts.pageInfo.endCursor;
    } else {
      break;
    }
  }

  return items;
}

export async function getAccountLeaderboard() {
  const data = await runPaginatedQuery();
  return data;
}
