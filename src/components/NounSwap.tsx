"use client";
import { Noun } from "@/common/types";
import { useAccount } from "wagmi";
import NounCard from "./NounCard";
import { useEffect, useMemo, useState } from "react";
import { getNounsForAddress } from "@/common/dataFetch";
import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Modal from "./Modal";

interface NounSwapProps {
    treasuryNoun: Noun;
}

export default function NounSwap({ treasuryNoun }: NounSwapProps) {
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [userNouns, setUserNouns] = useState<Noun[]>([]);
    const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
    const [pickModalOpen, setPickModalOpen] = useState<boolean>(false);

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

    return (
        <>
            <div className="flex flex-col grow justify-between">
                <div className="flex flex-row  w-full grow">
                    <div className="flex flex-col bg-blue-100 w-1/2 justify-center items-center">
                        <div>{address ? address : "Connect"}</div>
                        <button
                            onClick={() => {
                                address ? setPickModalOpen(true) : openConnectModal?.();
                            }}
                        >
                            {selectedUserNoun ? (
                                <NounCard noun={selectedUserNoun} size={240} enableHover={false} />
                            ) : (
                                "Pick your noun (click me)"
                            )}
                        </button>
                        <div>Offer: {selectedUserNoun?.id}</div>
                    </div>
                    <div className="flex flex-col bg-pink-400 w-1/2 justify-center items-center">
                        <div>Nouns treasury</div>
                        <NounCard noun={treasuryNoun} size={240} enableHover={false} />
                        <div>For: Noun {treasuryNoun.id}</div>
                    </div>
                </div>
                <div className="flex flex-row bg-red-500 w-full h-14 align-middle justify-between px-8 item-center">
                    <Link href="/" className="flex items-center">
                        Back
                    </Link>
                    <button onClick={() => alert("TODO: implement")}>Create a swap prop</button>
                </div>
            </div>
            <Modal isOpen={pickModalOpen} onClose={() => setPickModalOpen(false)}>
                <div className="flex flex-row justify-between p-4">
                    <span>Select your noun</span>
                    <button onClick={() => setPickModalOpen(false)}>X</button>
                </div>
                <div className="flex flex-col grow overflow-y-scroll">
                    {userNouns.map((noun, i) => (
                        <button
                            className="flex flex-row text-center bg-gray-100 p-2"
                            onClick={() => {
                                setSelectedUserNoun(noun);
                                setPickModalOpen(false);
                            }}
                            key={i}
                        >
                            <NounCard noun={noun} size={80} enableHover={false} />
                            <div className="flex items-center h-full">Noun {noun.id}</div>
                        </button>
                    ))}
                </div>
            </Modal>
        </>
    );
}
