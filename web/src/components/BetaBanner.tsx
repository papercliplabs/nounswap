"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useNetwork } from "wagmi";

export default function BetaBanner() {
    const { chain } = useNetwork();

    return (
        <span className={twMerge("bg-yellow-100 p-2 w-full text-center hidden", chain?.testnet && "block")}>
            You are on Goerli Testnet. To try it out get a{" "}
            <Link
                href="https://nouns-webapp-nu.vercel.app"
                className="inline"
                target="_blank"
                rel="noopener noreferrer"
            >
                Goerli Noun here.
            </Link>
        </span>
    );
}
