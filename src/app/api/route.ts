import { getNounsForAddress } from "@/common/dataFetch";
import { getAddress } from "viem";
import { Noun } from "@/common/types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    let nouns: Noun[] = [];
    if (address) {
        nouns = await getNounsForAddress(getAddress(address));
    }

    return Response.json(nouns);
}
