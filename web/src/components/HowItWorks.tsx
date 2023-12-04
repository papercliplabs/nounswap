"use client";
import { useState } from "react";
import Icon from "./Icon";
import Modal from "./Modal";
import Link from "next/link";

export default function HowItWorksModal() {
    const [howItWorksModalOpen, setHowItWorksModalOpen] = useState<boolean>(false);

    return (
        <>
            <button
                className="flex flex-row gap-2 items-center z-50 hover:brightness-[85%] text-gray-600"
                onClick={() => setHowItWorksModalOpen(true)}
            >
                <span className="hidden md:block">How it works</span>
                <Icon icon="questionCircle" size={20} className="fill-gray-600" />
            </button>
            <Modal title="How it works" isOpen={howItWorksModalOpen} onClose={() => setHowItWorksModalOpen(false)}>
                <div className="flex flex-col px-6 pb-6 [&>ol>li>div]:text-gray-600 text-gray-900">
                    <div className="pb-6 border-b-2 border-gray-400">
                        NounSwap a tool that helps Noun owners create a prop to swap their Noun for another Noun in the
                        treasury. It was built by{" "}
                        <Link href="https://paperclip.xyz/" target="_blank" rel="noopener noreferrer">
                            Paperclip Labs
                        </Link>{" "}
                        and inspired by{" "}
                        <Link
                            href="https://warpcast.com/toadyhawk.eth/0x38d070e1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            a cast from ToadyHawk.eth
                        </Link>
                        .
                        <br />
                        <br />
                        Read about{" "}
                        <Link
                            href="https://paperclip.xyz/blog/introducing-nounswap"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            why we built NounSwap
                        </Link>
                        .
                    </div>
                    <h5 className="py-6">How to create a Swap Prop</h5>
                    <ol className="pl-4 flex flex-col gap-6">
                        <li>
                            Choose the Noun you want
                            <div>Any Noun from the Nouns treasury.</div>
                        </li>
                        <li>
                            Select your Noun to trade
                            <div>Decide which of your Nouns you want to trade.</div>
                        </li>
                        <li>
                            Approve your Noun:
                            <div>This will approve the Nouns Treasury to swap your Noun if the prop passes.</div>
                        </li>
                        <li>
                            Create a Swap Prop{" "}
                            <div>Confirm the transaction and a swap proposal will be created in Nouns Governance.</div>
                        </li>
                    </ol>
                </div>
            </Modal>
        </>
    );
}
