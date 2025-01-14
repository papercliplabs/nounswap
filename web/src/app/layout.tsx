import { Londrina_Solid } from "next/font/google";
import localFont from "next/font/local";

import Providers from "@/providers/providers";
import ToastContainer from "@/components/ToastContainer";
import TestnetBanner from "@/components/TestnetBanner";
import Analytics from "@/components/Analytics";
import type { Metadata, Viewport } from "next";

import "@paperclip-labs/whisk-sdk/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@/theme/globals.css";
import { WithContext, WebSite } from "schema-dts";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Discover, Buy, and Swap Nouns NFTs from Nouns DAO",
  applicationName: "NounSwap",
  description:
    "Discover NounSwap, your gateway to Nouns DAO and iconic Noggles. Bid on Noun NFTs, explore $NOUNS tokens, and join the creative Nouns ecosystem today.",
  metadataBase: new URL("https://www.nounswap.wtf"),
  openGraph: {
    url: "https://www.nounswap.wtf",
    siteName: "NounSwap - Discover, Buy, and Swap Nouns from Nouns DAO",
    type: "website",
    locale: "en_US",
    title: "NounSwap",
    description: "Bid, explore, buy, and swap to find your forever Noun.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  appleWebApp: {
    title: "NounSwap - Discover, Buy, and Swap Nouns from Nouns DAO",
    statusBarStyle: "default",
    capable: true,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NounSwap",
    url: "https://www.nounswap.wtf",
    description:
      "NounSwap is the go-to platform for buying, selling, and swapping Nouns DAO NFTs.",
    publisher: {
      "@type": "Organization",
      name: "NounSwap",
      url: "https://www.nounswap.wtf",
      logo: "https://www.nounswap.wtf/app-icon.jpeg",
    },
  };

  return (
    <html
      lang="en"
      className={`${ptRootUiFont.variable} ${londrinaSolidFont.variable} `}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
