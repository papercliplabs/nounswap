"use client";
import { twMerge } from "tailwind-merge";
import { useChainId } from "wagmi";
import { LinkExternal } from "./ui/link";

export default function BetaBanner() {
  const chainId = useChainId();

  return (
    <span className={twMerge("hidden w-full bg-warning-light p-2 text-center", chainId != 1 && "block")}>
      You are on Goerli Testnet. To try it out get a{" "}
      <LinkExternal href="https://nouns-webapp-nu.vercel.app" className="inline">
        Goerli Noun here.
      </LinkExternal>
    </span>
  );
}
