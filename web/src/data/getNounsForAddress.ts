"use server";
import { Noun } from "../common/types";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { Address, getAddress } from "viem";
import { getClient } from "./ApolloClient";
import { gql } from "./__generated__/gql";

const { palette } = ImageData; // Used with `buildSVG``

const query = gql(`
    query NounsForAccountQuery($address: ID!) {
        account(id: $address) {
            nouns(first: 1000) {
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
    }
`);

export async function getNounsForAddress(address: Address): Promise<Noun[]> {
    const { data: queryResult } = await getClient().query({
        query: query,
        variables: { address: address.toString().toLowerCase() },
    });

    let nouns: Noun[] = (queryResult.account?.nouns ?? []).map((data) => {
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
    });

    // Sort by id, descending
    nouns.sort((a, b) => b.id - a.id);

    return nouns;
}
