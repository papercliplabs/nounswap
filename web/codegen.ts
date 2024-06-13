import { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  // schema: "https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn",
  schema: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.DECENTRALIZED_SUBGRAPH_API_KEY}/deployments/id/Qmdfajyi6PSmc45xWpbZoYdses84SAAze6ZcCxuDAhJFzt`,
  documents: ["src/**/*.{ts,tsx}", "!src/data/generated/**/*"],
  generates: {
    "./src/data/generated/gql/": {
      preset: "client",
      plugins: [],
      config: {
        documentMode: "string",
        scalars: {
          BigDecimal: {
            input: "string",
            output: "string",
          },
          BigInt: {
            input: "string",
            output: "string",
          },
          Int8: {
            input: "any",
            output: "string",
          },
          Bytes: {
            input: "any",
            output: "string",
          },
        },
        mappers: {
          BigInt: "bigint",
        },
      },
    },
  },
};

export default config;
