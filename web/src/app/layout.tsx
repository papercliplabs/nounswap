import "@/theme/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { Londrina_Solid } from "next/font/google";
import localFont from "next/font/local";
import { getFrameMetadata } from "frog/next";

import Providers from "@/providers/providers";
import ToastContainer from "@/components/ToastContainer";
import TestnetBanner from "@/components/TestnetBanner";

const ptRootUiFont = localFont({
  src: "./pt-root-ui_vf.woff2",
  display: "swap",
  variable: "--font-pt-root-ui",
});

const londrinaSolidFont = Londrina_Solid({
  weight: ["100", "300", "400", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-londrina-solid",
});

export async function generateMetadata() {
  const frameMetadata = await getFrameMetadata(`https://frames.paperclip.xyz/nounish-auction/nouns`);

  // Only take fc:frame tags (not og image overrides)
  const filteredFrameMetadata = Object.fromEntries(
    Object.entries(frameMetadata).filter(([k]) => k.includes("fc:frame"))
  );

  return {
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
    other: filteredFrameMetadata,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ptRootUiFont.variable} ${londrinaSolidFont.variable}`}>
      <body>
        <Providers>
          <div className="flex min-h-screen w-full flex-col justify-between overflow-hidden border-border-primary">
            <TestnetBanner />
            {children}
          </div>
          <ToastContainer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
