import { NOUNS_TREASURY_ADDRESS } from "@/common/constants";
import { getNounsForAddress } from "@/common/dataFetch";
import NounSelect from "@/components/NounSelect";

export default async function Home() {
    const treasuryNouns = await getNounsForAddress(NOUNS_TREASURY_ADDRESS);

    return (
        <>
            <h1>Nouniswap</h1>
            <div>Swap your noun for a different noun from the Noun treasury</div>
            <NounSelect nouns={treasuryNouns} />
        </>
    );
}
