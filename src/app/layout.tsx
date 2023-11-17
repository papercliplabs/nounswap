import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import Providers from "./providers";
import ToastContainer from "@/components/ToastContainer";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Noun Swap",
    description: "Swap your noun with the Nouns Treasury",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="flex flex-col min-h-screen justify-between">
                        <span className="bg-yellow-100 p-2 w-full text-center">
                            NounSwap is currently in beta on Goerli testnet. To try it out, get a{" "}
                            <Link
                                href="https://nouns-webapp-nu.vercel.app"
                                className="inline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Goerli Noun here.
                            </Link>
                        </span>
                        {children}
                    </div>
                    <ToastContainer />
                </Providers>
            </body>
        </html>
    );
}
