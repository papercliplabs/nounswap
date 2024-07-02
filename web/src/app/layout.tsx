import "@/theme/globals.css";
import { Londrina_Solid } from "next/font/google";
import localFont from "next/font/local";

import Providers from "@/providers/providers";
import ToastContainer from "@/components/ToastContainer";
import TestnetBanner from "@/components/TestnetBanner";
import Analytics from "@/components/Analytics";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { wagmiConfig } from "@/providers/wagmiConfig";

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
    description: "Bid, explore, and swap Nouns.",
    metadataBase: new URL("https://www.nounswap.wtf"),
    openGraph: {
      title: "NounSwap",
      description: "Bid, explore, and swap Nouns.",
    },
    twitter: {
      card: "summary_large_image",
      title: "NounSwap",
      description: "Bid, explore, and swap Nouns.",
    },
    keywords: ["crypto", "cryptocurrency", "ethereum", "nft", "nouns", "nounsDOA", "paperclip", "labs"],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(wagmiConfig, headers().get("cookie"));
  return (
    <html lang="en" className={`${ptRootUiFont.variable} ${londrinaSolidFont.variable} `}>
      <body className="overflow-x-hidden">
        <Providers initialState={initialState}>
          <div className="border-border-primary flex min-h-screen flex-col justify-between">
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
