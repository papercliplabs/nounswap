import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import Providers from "./providers";
import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
    title: "Noun Swap",
    description: "Swap your noun with the Nouns Treasury",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="flex flex-col min-h-screen justify-between ">{children}</div>
                    <ToastContainer />
                </Providers>
            </body>
        </html>
    );
}
