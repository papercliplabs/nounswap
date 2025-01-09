import { GraphQLError } from "graphql";
import { TypedDocumentString as SubgraphTypedDocumentString } from "../generated/gql/graphql";
import { TypedDocumentString as PonderTypedDocumentString } from "../generated/ponder/graphql";
import { CHAIN_CONFIG } from "@/config";

type GraphQLResponse<Data> = { data: Data } | { errors: GraphQLError[] };

export interface CacheConfig {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export async function graphQLFetch<Result, Variables>(
  url: string,
  query:
    | SubgraphTypedDocumentString<Result, Variables>
    | PonderTypedDocumentString<Result, Variables>,
  variables?: Variables,
  cacheConfig?: CacheConfig,
): Promise<Result> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: cacheConfig?.cache,
    next: cacheConfig?.next,
  });

  const result = (await response.json()) as GraphQLResponse<Result>;

  if ("errors" in result) {
    console.log("DEBUG", CHAIN_CONFIG.ponderIndexerUrl);
    throw new Error(
      `CUSTOM ERROR - ${url} - ${result.errors[0].message} - ${query} - ${JSON.stringify(variables)}`,
    );
  }

  return result.data;
}

export async function graphQLFetchWithFallback<Result, Variables>(
  url: { primary: string; fallback: string },
  query:
    | SubgraphTypedDocumentString<Result, Variables>
    | PonderTypedDocumentString<Result, Variables>,
  variables?: Variables,
  cacheConfig?: CacheConfig,
): Promise<Result> {
  try {
    return await graphQLFetch(url.primary, query, variables, cacheConfig);
  } catch (e) {
    console.log("Graphql primary failed, trying fallback...", e);
    return await graphQLFetch(url.fallback, query, variables, cacheConfig);
  }
}
