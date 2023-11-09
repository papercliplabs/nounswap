import { getBuiltGraphSDK } from "../../.graphclient";
import { Noun } from "@/common/types";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { Address } from "viem";

const { palette } = ImageData; // Used with `buildSVG``

export async function getNounsForAddress(address: Address): Promise<Noun[]> {
    const graphSdk = getBuiltGraphSDK();
    const queryResult = await graphSdk.NounsForAccountQuery({ address: address.toLocaleLowerCase() }, {});

    let nouns: Noun[] = (queryResult.account?.nouns ?? []).map((data) => {
        let id = Number(data.id);
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
            seed,
            imageSrc: `data:image/svg+xml;base64,${svgBase64}`,
        };
    });

    return nouns;
}
