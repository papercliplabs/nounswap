"use client";
import { twMerge } from "tailwind-merge";
import { useNetwork } from "wagmi";
import { LinkExternal } from "./ui/link";

export default function BetaBanner() {
    const { chain } = useNetwork();

    return (
        <span className={twMerge("bg-warning-light p-2 w-full text-center hidden", chain?.testnet && "block")}>
            You are on Goerli Testnet. To try it out get a{" "}
            <LinkExternal href="https://nouns-webapp-nu.vercel.app" className="inline">
                Goerli Noun here.
            </LinkExternal>
        </span>
    );
}
