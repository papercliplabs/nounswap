import { NOUNS_TREASURY_ADDRESS } from "@/common/constants";
import { getNounsForAddress } from "@/data/getNounsForAddress";
import NounSelect from "@/components/NounSelect";

export default async function Home() {
    const treasuryNouns = await getNounsForAddress(NOUNS_TREASURY_ADDRESS);

    return <NounSelect nouns={treasuryNouns} />;
}
