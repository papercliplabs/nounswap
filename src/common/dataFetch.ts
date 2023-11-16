import { getBuiltGraphSDK } from "../../.graphclient";
import { Noun, SwapNounProposal } from "@/common/types";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { Address, getAddress } from "viem";

const { palette } = ImageData; // Used with `buildSVG``

export async function getNounsForAddress(address: Address): Promise<Noun[]> {
    const graphSdk = getBuiltGraphSDK();
    const queryResult = await graphSdk.NounsForAccountQuery({ address: address.toLocaleLowerCase() });

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

export async function getNounById(id: string): Promise<Noun | undefined> {
    const graphSdk = getBuiltGraphSDK();
    const queryResult = await graphSdk.NounById({ id: id });

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

export async function getNounSwapProposalsForDelegate(address: Address): Promise<SwapNounProposal[]> {
    const graphSdk = getBuiltGraphSDK();
    const queryResult = await graphSdk.NounSwapProposalsForDelegate({ id: address.toString().toLowerCase() });

    if (queryResult.delegate) {
        const data = queryResult.delegate;

        const swapNounProposals: SwapNounProposal[] = [];
        for (let proposal of data.proposals) {
            const title = proposal.title;
            const match = title.match(/Swap Noun [0-9]* for Noun [0-9]*/)![0]; // Swap Noun XX for Noun YY
            const split = match.split(" ");
            const fromNounId = split[2];
            const toNounId = split[5];

            const fromNoun = await getNounById(fromNounId);
            const toNoun = await getNounById(toNounId);

            swapNounProposals.push({
                id: Number(proposal.id),
                fromNoun: fromNoun,
                toNoun: toNoun,
                status: proposal.status,
            } as SwapNounProposal);
        }

        return swapNounProposals;
    } else {
        console.log(`getNounSwapProposalsForDelegate: no proposals found - ${address}`);
        return [];
    }
}
