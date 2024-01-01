"use client";
import { Noun } from "../../lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogBase";
import Icon from "../ui/Icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { goerli } from "viem/chains";
import { useRouter, useSearchParams } from "next/navigation";
import { useSwitchNetwork } from "wagmi";
import NounCard from "../NounCard";
import { LinkExternal } from "../ui/link";
import { useState } from "react";
import getChainSpecificData from "@/lib/chainSpecificData";

interface UserNounSelectDialogProps {
    connected: boolean;
    userNouns?: Noun[];
    chain: number;

    selectedUserNoun?: Noun;
    selectedNounCallback: (noun?: Noun) => void;
}

export default function UserNounSelectDialog({
    connected,
    userNouns,
    chain,
    selectedUserNoun,
    selectedNounCallback,
}: UserNounSelectDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const { openConnectModal } = useConnectModal();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { switchNetworkAsync } = useSwitchNetwork();

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <>
                {selectedUserNoun ? (
                    <div className="relative hover:cursor-pointer flex">
                        <button onClick={() => setOpen(true)}>
                            <NounCard noun={selectedUserNoun} size={200} enableHover={false} alwaysShowNumber />
                        </button>
                        <button
                            onClick={() => selectedNounCallback(undefined)}
                            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
                        >
                            <Icon
                                icon="xCircle"
                                size={40}
                                className="border-4 rounded-full border-white fill-gray-600"
                            />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => (connected ? setOpen(true) : openConnectModal?.())}
                        className="h-[200px] w-[200px] border-4 border-dashed rounded-[20px] p-8 flex flex-col gap-4 text-secondary justify-center items-center hover:brightness-[85%]"
                    >
                        <Icon icon="plusCircle" size={54} className="fill-gray-600" />
                        <h6>Select your Noun</h6>
                    </button>
                )}
            </>

            <DialogContent className="max-w-[425px] max-h-[60vh] flex flex-col overflow-y-auto p-0">
                <h4 className="px-6 pt-6">Select your Noun</h4>
                <div className="flex flex-col [&>ol>li>div]:text-secondary">
                    {userNouns == undefined ? (
                        <Icon icon="pending" size={60} className="animate-spin" />
                    ) : userNouns.length == 0 ? (
                        <div className="flex flex-col px-8 py-6 items-center w-full justify-center h-[244px] gap-2 text-center">
                            <h4>No Nouns available</h4>
                            <div className="text-secondary">
                                {getChainSpecificData(chain).chain.id == 1 ? (
                                    <>
                                        Don{"'"}t have a noun on Ethereum? Try NounSwap on{" "}
                                        <button
                                            className="text-accent hover:brightness-[85%]"
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
                                        <LinkExternal href="https://nouns-webapp-nu.vercel.app">
                                            Goerli Noun here
                                        </LinkExternal>
                                        .
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        userNouns.map((noun, i) => (
                            <button
                                className="flex flex-row text-center hover:bg-secondary p-2 gap-6 items-center hover:brightness-[85%] px-6 py-3 w-full"
                                onClick={() => {
                                    selectedNounCallback(noun);
                                    setOpen(false);
                                }}
                                key={i}
                            >
                                <NounCard noun={noun} size={80} enableHover={false} />
                                <h4>Noun {noun.id}</h4>
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
