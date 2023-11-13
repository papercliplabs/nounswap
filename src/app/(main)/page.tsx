import { NOUNS_TREASURY_ADDRESS } from "@/common/constants";
import { getNounsForAddress } from "@/common/dataFetch";
import NounSelect from "@/components/NounSelect";
import Link from "next/link";

export default async function Home() {
    const treasuryNouns = await getNounsForAddress(NOUNS_TREASURY_ADDRESS);

    return (
        <>
            <div>
                <h1 className="pb-1">Choose a Noun</h1>
                <div>
                    Swap your Noun for a different Noun, from the{" "}
                    <Link
                        href="https://etherscan.io/tokenholdings?a=0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Noun treasury.
                    </Link>
                </div>
            </div>
            <NounSelect nouns={treasuryNouns} />
        </>
    );
}
