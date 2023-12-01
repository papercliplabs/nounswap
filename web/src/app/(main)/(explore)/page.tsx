import { getNounsForAddress } from "../../../data/getNounsForAddress";
import NounSelect from "../../../components/NounSelect";
import getChainSpecificData from "../../../common/chainSpecificData";

export default async function Home({ searchParams }: { searchParams: { chain?: number } }) {
    const treasuryNouns = await getNounsForAddress(
        getChainSpecificData(searchParams.chain).nounsTreasuryAddress,
        searchParams.chain // active chain
    );

    return <NounSelect nouns={treasuryNouns} />;
}
