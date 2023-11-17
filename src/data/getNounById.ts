"use server";
import { Noun } from "@/common/types";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { getAddress } from "viem";
import { getClient } from "./ApolloClient";
import { gql } from "@/data/__generated__/gql";

const { palette } = ImageData; // Used with `buildSVG``

const query = gql(`
    query NounById($id: ID!) {
        noun(id: $id) {
            id
            owner {
                id
            }
            seed {
                background
                body
                accessory
                head
                glasses
            }
        }
    }
`);

export async function getNounById(id: string): Promise<Noun | undefined> {
    const { data: queryResult } = await getClient().query({
        query: query,
        variables: { id },
    });

    if (queryResult.noun && queryResult.noun.seed) {
        let data = queryResult.noun;
        let id = Number(data.id);
        const owner = getAddress(data.owner.id);
        let seed: NounSeed = {
            background: Number(data.seed?.background),
            body: Number(data.seed?.body),
            accessory: Number(data.seed?.accessory),
            head: Number(data.seed?.head),
            glasses: Number(data.seed?.glasses),
        };
        const { parts, background } = getNounData(seed);

        const svgBinary = buildSVG(parts, palette, background);
        const svgBase64 = btoa(svgBinary);

        return {
            id,
            owner,
            seed,
            imageSrc: `data:image/svg+xml;base64,${svgBase64}`,
        };
    } else {
        console.error(`getNounById: noun not found - ${id}`);
        return undefined;
    }
}
