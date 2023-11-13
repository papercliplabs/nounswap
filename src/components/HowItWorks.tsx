"use client";
import { useState } from "react";
import Icon from "./Icon";
import Modal, { ModalProps } from "./Modal";
import Link from "next/link";

export default function HowItWorksModal() {
    const [howItWorksModalOpen, setHowItWorksModalOpen] = useState<boolean>(false);

    return (
        <>
            <button
                className="flex flex-row gap-2 items-center z-50 hover:brightness-[85%] text-gray-600"
                onClick={() => setHowItWorksModalOpen(true)}
            >
                <span>How it works</span>
                <Icon icon="questionCircle" size={20} className="fill-gray-600" />
            </button>
            <Modal title="What is NounSwap?" isOpen={howItWorksModalOpen} onClose={() => setHowItWorksModalOpen(false)}>
                <div className="flex flex-col gap-10 px-6 pb-6 text-gray-600">
                    <div className="flex flex-col gap-2">
                        <h5 className="text-black">Who built this?</h5>
                        <div>
                            We{"'"}re{" "}
                            <Link href="https://paperclip.xyz/" target="_blank" rel="noopener noreferrer">
                                Paperclip Labs
                            </Link>
                            , we design, build and ship crypto products and tools. NounSwap was inspired by{" "}
                            <Link
                                href="https://warpcast.com/toadyhawk.eth/0x38d070e1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                an idea from ToadyHawk.eth
                            </Link>
                            . It lets you create a prop to swap your Noun for a Noun in the treasury. Making it easy and
                            straightforward for any Noun owner to get the Noun they want.
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h5 className="text-black">How does it work?</h5>
                        <div>
                            Create a prop in 4 steps.
                            <ol className="pt-6">
                                <li>
                                    <span className="text-black">1. Choose a Noun:</span> Look through the treasury and
                                    pick a Noun you like.
                                </li>
                                <li>
                                    <span className="text-black">2. Select your Noun:</span> Decide which one of your
                                    Nouns you{"'"}d like to offer in the swap.
                                </li>
                                <li>
                                    <span className="text-black">3. Approve your Noun:</span> This step is very
                                    important so the Treasury can your noun can be swapped if your proposal (prop) is
                                    successful. You are only allowing the Nouns Treasury to use you noun.
                                </li>
                                <li>
                                    <span className="text-black">4. Create a Prop:</span> Finally, approve the
                                    CreateProp transaction. This will create a prop in Nouns Governance. If the Prop
                                    passes, the swap will be automatically executed, and you{"'"}ll receive the Noun you
                                    wanted.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
