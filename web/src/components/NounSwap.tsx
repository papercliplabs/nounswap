"use client";
import { Noun } from "../common/types";
import { Address, useNetwork, useSwitchNetwork } from "wagmi";
import NounCard from "./NounCard";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Modal from "./Modal";
import SwapTransactionModal from "./SwapTransactionModal";
import WalletButton from "./WalletButton";
import Image from "next/image";
import Icon from "./Icon";
import { track } from "@vercel/analytics";
import getChainSpecificData from "../common/chainSpecificData";
import { switchNetwork } from "wagmi/actions";
import Link from "next/link";
import { goerli } from "viem/chains";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

interface NounSwapProps {
    userNouns: Noun[];
    treasuryNoun: Noun;
    address?: Address;
}

export default function NounSwap({ userNouns, treasuryNoun, address }: NounSwapProps) {
    const { openConnectModal } = useConnectModal();
    const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
    const [pickModalOpen, setPickModalOpen] = useState<boolean>(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
    const { chain: activeChain } = useNetwork();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { switchNetworkAsync } = useSwitchNetwork();

    const wrongNetwork = useMemo(() => {
        return activeChain?.id != treasuryNoun.chainId;
    }, [activeChain, treasuryNoun]);

    useEffect(() => {
        // Clear selection if disconnected
        if (!address) {
            setSelectedUserNoun(undefined);
        }
    }, [address, setSelectedUserNoun]);

    return (
        <>
            <div className="flex flex-col grow justify-between border-gray-700 md: pb-[72px]">
                <div className="flex flex-col md:flex-row w-full grow border-b-4">
                    <div className="flex flex-col grow justify-center items-center border-b-2 md:border-r-2 md:border-b-0 gap-8 py-12 px-6 relative">
                        <WalletButton hideChainSwitcher disableMobileShrink />
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
                        <div className="flex flex-col justify-center items-center">
                            <h5>Offer: {selectedUserNoun?.id}</h5>
                            <div>
                                On {selectedUserNoun ? getChainSpecificData(selectedUserNoun.chainId).chain.name : ""}
                            </div>
                        </div>
                        <Icon
                            icon="repeat"
                            size={64}
                            className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 md:right-0 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 rounded-full p-3 bg-gray-200 border-4 border-white"
                        />
                    </div>
                    <div className="flex flex-col grow justify-center items-center border-t-2 md:border-l-2 md:border-t-0 gap-8 py-12 px-6">
                        <Link
                            href={
                                getChainSpecificData(treasuryNoun.chainId).chain.blockExplorers?.default.url +
                                "/address/" +
                                getChainSpecificData(treasuryNoun.chainId).nounsTreasuryAddress
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row gap-2 px-4 py-3 border-2 border-gray-400 rounded-2xl items-center text-gray-900 hover:bg-gray-200 hover:brightness-100 active:clickable-active"
                        >
                            <Image
                                src="/nouns-icon.png"
                                width={32}
                                height={32}
                                alt=""
                                className="rounded-full bg-yellow-400 p-0.5"
                            />
                            <span>Nouns Treasury</span>
                        </Link>
                        <NounCard noun={treasuryNoun} size={200} enableHover={false} />
                        <div className="flex flex-col justify-center items-center">
                            <h5>For: Noun {treasuryNoun.id}</h5>
                            <div>On {getChainSpecificData(treasuryNoun.chainId).chain.name}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row w-full justify-end px-4 md:px-10 py-4 md:py-2 item-center items-center gap-6 text-gray-600 md:fixed md:bottom-0 md:bg-white md:border-t-4">
                    <span>Creates a prop in Nouns governance.</span>
                    <button
                        className="btn-primary w-full md:w-auto justify-center"
                        onClick={() => {
                            if (wrongNetwork) {
                                switchNetwork({ chainId: treasuryNoun.chainId });
                            } else {
                                setTransactionModalOpen(true);
                                track("InitCreateSwapProp");
                            }
                        }}
                        disabled={selectedUserNoun == undefined}
                    >
                        {wrongNetwork && selectedUserNoun ? "Switch network" : "Create a swap prop"}
                    </button>
                </div>
            </div>
            <Modal title="Select your Noun" isOpen={pickModalOpen} onClose={() => setPickModalOpen(false)}>
                {userNouns == undefined ? (
                    <Icon icon="pending" size={60} className="animate-spin" />
                ) : userNouns.length == 0 ? (
                    <div className="flex flex-col px-8 py-6 items-center w-full justify-center h-[244px] gap-2 text-center">
                        <h4>No Nouns available</h4>
                        <div className="text-gray-600">
                            {getChainSpecificData(treasuryNoun.chainId).chain.id == 1 ? (
                                <>
                                    Don{"'"}t have a noun on Ethereum? Try NounSwap on{" "}
                                    <button
                                        className="text-blue-500 hover:brightness-[85%]"
                                        onClick={async () => {
                                            await switchNetworkAsync?.(goerli.id);
                                            router.push("/" + "?" + searchParams.toString());
                                        }}
                                    >
                                        Goerli Testnet
                                    </button>
                                    .
                                </>
                            ) : (
                                <>
                                    You don{"'"}t have a noun on Goerli Testnet.
                                    <br />
                                    Get a{" "}
                                    <Link
                                        href="https://nouns-webapp-nu.vercel.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Goerli Noun here
                                    </Link>
                                    .
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    userNouns.map((noun, i) => (
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
                    ))
                )}
            </Modal>
            <Suspense fallback={<LoadingSpinner />}>
                <SwapTransactionModal
                    userNoun={selectedUserNoun}
                    treasuryNoun={treasuryNoun}
                    isOpen={transactionModalOpen}
                    onClose={() => setTransactionModalOpen(false)}
                />
            </Suspense>
        </>
    );
}
