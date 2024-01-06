import { LinkExternal } from "@/components/ui/link";
import NounFilter from "@/components/NounFilter";
import NounGrid from "@/components/NounGrid";
import { NounFeatureFilterOption } from "@/lib/types";
import { numberFromString } from "@/lib/utils";
import { Suspense } from "react";

export default function Explore({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    return (
        <>
            <div>
                <h1 className="pb-1">Choose a Noun</h1>
                <div>
                    Swap your Noun for a Noun, from the{" "}
                    <LinkExternal href="https://etherscan.io/tokenholdings?a=0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71">
                        Nouns treasury.
                    </LinkExternal>
                </div>
            </div>
            <div className="flex flex-row grow gap-6  w-full">
                <Suspense>
                    <NounFilter />
                </Suspense>
                <NounGrid
                    chainId={numberFromString(searchParams["chain"])}
                    headFilter={numberFromString(searchParams[NounFeatureFilterOption.Head])}
                    glassesFilter={numberFromString(searchParams[NounFeatureFilterOption.Glasses])}
                    accessoryFilter={numberFromString(searchParams[NounFeatureFilterOption.Accessory])}
                    bodyFilter={numberFromString(searchParams[NounFeatureFilterOption.Body])}
                    backgroundFilter={numberFromString(searchParams[NounFeatureFilterOption.Background])}
                />
            </div>
        </>
    );
}
