import { Londrina_Solid } from "next/font/google";
import localFont from "next/font/local";

import Providers from "@/providers/providers";
import ToastContainer from "@/components/ToastContainer";
import TestnetBanner from "@/components/TestnetBanner";
import Analytics from "@/components/Analytics";

import "@paperclip-labs/whisk-sdk/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@/theme/globals.css";
import MobileNav from "@/components/Nav/MobileNav";

const ptRootUiFont = localFont({
  src: [
    {
      path: "./fonts/pt-root-ui_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/pt-root-ui_medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/pt-root-ui_bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pt-root-ui",
});

const londrinaSolidFont = Londrina_Solid({
  weight: ["100", "300", "400", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-londrina-solid",
});

export async function generateMetadata() {
  return {
    title: "NounSwap",
    description: "Bid, explore, buy, and swap to find your forever Noun.",
    metadataBase: new URL("https://www.nounswap.wtf"),
    openGraph: {
      title: "NounSwap",
      description: "Bid, explore, buy, and swap to find your forever Noun.",
    },
    twitter: {
      card: "summary_large_image",
      title: "NounSwap",
      description: "Bid, explore, buy, and swap to find your forever Noun.",
    },
    keywords: [
      "Nouns",
      "Nouns DAO",
      "Nouns NFTs",
      "NFT",
      "NFT Auction",
      "Nouns Swap",
      "Nouns Marketplace",
      "Governance",
      "DeFi",
      "Ethereum",
      "NFT Marketplace",
      "Blockchain",
      "Decentralized Exchange",
      "Buy Nouns",
      "Swap Nouns",
      "Web3",
      "Crypto",
      "Paperclip Labs",
    ],
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ptRootUiFont.variable} ${londrinaSolidFont.variable} `}
    >
      <body className="overflow-x-hidden">
        <Providers>
          <div className="flex min-h-screen flex-col justify-between border-border-primary">
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
