import { getNounById } from "@/data/getNounById";
import NounSwap from "@/components/NounSwap";
import { Address } from "viem";

export default async function Swap({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { address?: Address };
}) {
    const treasuryNoun = await getNounById(params.id);

    if (!treasuryNoun) {
        return <>No treasury noun exists!</>;
    }

    return <NounSwap treasuryNoun={treasuryNoun} address={searchParams.address} />;
}
