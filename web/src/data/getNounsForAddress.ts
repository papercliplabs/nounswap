"use server";
import { Noun } from "../lib/types";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { Address, getAddress } from "viem";
import getClientForChain from "./ApolloClient";
import { gql } from "./__generated__/gql";
import { washChainId } from "../lib/chainSpecificData";

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

export async function getNounsForAddress(address?: Address, chainId?: number): Promise<Noun[]> {
    if (address == undefined) {
        return [];
    }

    const washedChainId = washChainId(chainId);

    const { data: queryResult } = await getClientForChain(washedChainId).query({
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
            chainId: washedChainId,
        };
    });

    // Sort by id, descending
    nouns.sort((a, b) => b.id - a.id);

    return nouns;
}
