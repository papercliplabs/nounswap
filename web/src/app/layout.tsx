import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";

import Providers from "./providers";
import ToastContainer from "../components/ToastContainer";
import BetaBanner from "../components/BetaBanner";

export const metadata: Metadata = {
    title: "NounSwap",
    description: "Swap your Noun with the Nouns Treasury",
    metadataBase: new URL("https://www.nounswap.wtf"),
    openGraph: {
        title: "NounSwap",
        description: "Swap your Noun with the Nouns Treasury",
    },
    twitter: {
        card: "summary_large_image",
        title: "NounSwap",
        description: "Swap your Noun with the Nouns Treasury",
    },
    keywords: ["crypto", "cryptocurrency", "ethereum", "nft", "nouns", "nounsDOA", "paperclip", "labs"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="flex flex-col min-h-screen justify-between w-full overflow-hidden">
                        <BetaBanner />
                        {children}
                    </div>
                    <ToastContainer />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
