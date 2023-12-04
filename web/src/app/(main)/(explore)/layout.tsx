import Link from "next/link";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div>
                <h1 className="pb-1">Choose a Noun</h1>
                <div>
                    Swap your Noun for a Noun, from the{" "}
                    <Link
                        href="https://etherscan.io/tokenholdings?a=0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Nouns treasury.
                    </Link>
                </div>
            </div>
            {children}
        </>
    );
}
