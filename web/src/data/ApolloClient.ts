import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import getChainSpecificData from "../lib/chainSpecificData";
import { mainnet } from "viem/chains";

export const { getClient: getMainnetSubgraphClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn",
            fetchOptions: { cache: "no-store" },
        }),
    });
});

export const { getClient: getGoerliSubgraphClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns-v3-goerli/0.1.6/gn",
            fetchOptions: { cache: "no-store" },
        }),
    });
});

// TODO: this is not ideal, would be better to have client be dynamic and take from chainSpecificData
export default function getClientForChain(chainId: number): ApolloClient<any> {
    return chainId == mainnet.id ? getMainnetSubgraphClient() : getGoerliSubgraphClient();
}
