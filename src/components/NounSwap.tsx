"use client";
import { Noun } from "@/common/types";
import { useAccount } from "wagmi";
import NounCard from "./NounCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Modal from "./Modal";
import SwapTransactionModal from "./SwapTransactionModal";
import WalletButton from "./WalletButton";
import Image from "next/image";
import Icon from "./Icon";

interface NounSwapProps {
    treasuryNoun: Noun;
}

export default function NounSwap({ treasuryNoun }: NounSwapProps) {
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [userNouns, setUserNouns] = useState<Noun[]>([]);
    const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
    const [pickModalOpen, setPickModalOpen] = useState<boolean>(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);

    useEffect(() => {
        async function getUserNouns() {
            if (address != undefined) {
                const res = await fetch(`/api?address=${address}`);
                const nouns = (await res.json()) as Noun[];
                setUserNouns(nouns);
            } else {
                setUserNouns([]);
            }
        }

        getUserNouns();
    }, [address]);

    useEffect(() => {
        // Clear selection if disconnected
        if (!address) {
            setSelectedUserNoun(undefined);
        }
    }, [address, setSelectedUserNoun]);

    return (
        <>
            <div className="flex flex-col grow justify-between border-gray-700">
                <div className="flex flex-row  w-full grow border-b-4">
                    <div className="flex flex-col  w-1/2 justify-center items-center border-r-2 gap-8 py-3 relative">
                        <WalletButton />
                        {selectedUserNoun ? (
                            <div className="relative">
                                <button onClick={() => setPickModalOpen(true)}>
                                    <NounCard noun={selectedUserNoun} size={200} enableHover={false} />
                                </button>
                                <button onClick={() => setSelectedUserNoun(undefined)}>
                                    <Icon
                                        icon="xCircle"
                                        size={40}
                                        className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 border-4 rounded-full border-white fill-gray-600"
                                    />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => (address ? setPickModalOpen(true) : openConnectModal?.())}
                                className="h-[200px] w-[200px] border-4 border-dashed border-gray-400 rounded-[20px] p-8 flex flex-col gap-4 text-gray-600 justify-center items-center hover:brightness-[85%]"
                            >
                                <Icon icon="plusCircle" size={54} className="fill-gray-600" />
                                <div>Select your Noun</div>
                            </button>
                        )}
                        <h5>Offer: {selectedUserNoun?.id}</h5>
                        <Icon
                            icon="repeat"
                            size={64}
                            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full p-3 bg-gray-200 border-4 border-white"
                        />
                    </div>
                    <div className="flex flex-col w-1/2 justify-center items-center border-l-2 gap-8 py-3">
                        <div className="flex flex-row gap-2 px-4 py-3 border-2 border-gray-400 rounded-2xl items-center">
                            <Image src="/nouns.png" width={32} height={32} alt="" className="rounded-full" />
                            <span>Nouns Treasury</span>
                        </div>
                        <NounCard noun={treasuryNoun} size={200} enableHover={false} />
                        <h5>For: Noun {treasuryNoun.id}</h5>
                    </div>
                </div>
                <div className="flex flex-row w-full justify-end px-10 py-2 item-center items-center gap-6 text-gray-600">
                    <span>Creates a prop in Nouns governance.</span>
                    <button
                        className="btn-primary"
                        onClick={() => setTransactionModalOpen(true)}
                        disabled={selectedUserNoun == undefined}
                    >
                        Create a swap prop
                    </button>
                </div>
            </div>
            <Modal title="Select your Noun" isOpen={pickModalOpen} onClose={() => setPickModalOpen(false)}>
                {userNouns.map((noun, i) => (
                    <button
                        className="flex flex-row text-center bg-gray-100 p-2 gap-6 items-center hover:brightness-[85%] px-6 py-3"
                        onClick={() => {
                            setSelectedUserNoun(noun);
                            setPickModalOpen(false);
                        }}
                        key={i}
                    >
                        <NounCard noun={noun} size={80} enableHover={false} />
                        <h4>Noun {noun.id}</h4>
                    </button>
                ))}
            </Modal>
            <SwapTransactionModal
                isOpen={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                userNoun={selectedUserNoun}
                treasuryNoun={treasuryNoun}
            />
        </>
    );
}
