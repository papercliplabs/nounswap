"use client";
import { Noun } from "../../../../../lib/types";
import { Address, useBalance, useNetwork } from "wagmi";
import NounCard from "../../../../../components/NounCard";
import { useEffect, useMemo, useState } from "react";
import WalletButton from "../../../../../components/WalletButton";
import Image from "next/image";
import Icon from "../../../../../components/ui/Icon";
import getChainSpecificData from "../../../../../lib/chainSpecificData";
import { LinkExternal } from "../../../../../components/ui/link";
import { Button } from "../../../../../components/ui/button";
import UserNounSelectDialog from "../../../../../components/dialog/UserNounSelectDialog";
import UserTipDialog from "../../../../../components/dialog/UserTipDialog";
import { useRouter, useSearchParams } from "next/navigation";

interface NounSwapProps {
    userNouns: Noun[];
    treasuryNoun: Noun;
    address?: Address;
}

export default function UserNounSelect({ userNouns, treasuryNoun, address }: NounSwapProps) {
    const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
    const [tip, setTip] = useState<bigint | undefined>(undefined);

    const chainSpecificData = useMemo(() => {
        return getChainSpecificData(treasuryNoun.chainId);
    }, [treasuryNoun]);

    const { data: userBalance } = useBalance({
        address: address,
        token: chainSpecificData.wrappedNativeTokenAddress,
        chainId: treasuryNoun.chainId,
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Clear selection if disconnected
        if (!address) {
            setSelectedUserNoun(undefined);
            setTip(undefined);
        }
    }, [address, setSelectedUserNoun]);

    return (
        <>
            <div className="flex flex-col grow justify-between  md:pb-[72px]">
                <div className="flex flex-col md:flex-row w-full grow border-b-4">
                    <div className="flex flex-col grow justify-center items-center border-b-2 md:border-r-2 md:border-b-0 gap-8 py-12 px-8 relative border-secondary flex-1">
                        <WalletButton hideChainSwitcher disableMobileShrink />
                        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                            <UserNounSelectDialog
                                connected={address != undefined}
                                userNouns={userNouns}
                                chain={treasuryNoun.chainId}
                                selectedUserNoun={selectedUserNoun}
                                selectedNounCallback={(noun?: Noun) => setSelectedUserNoun(noun)}
                            />
                            <Icon icon="plus" size={20} className="fill-gray-600" />
                            <UserTipDialog
                                connected={address != undefined}
                                userBalance={userBalance?.value}
                                swapUrl={chainSpecificData.swapForWrappedNativeUrl}
                                tip={tip}
                                setTipCallback={setTip}
                            />
                        </div>
                        <Icon
                            icon="repeat"
                            size={64}
                            className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 md:right-0 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2 rounded-full p-3 bg-secondary border-4 border-white"
                        />
                    </div>
                    <div className="flex flex-col grow justify-center items-center border-t-2 md:border-l-2 md:border-t-0 gap-8 py-12 px-8 border-secondary flex-1">
                        <LinkExternal
                            href={
                                chainSpecificData.chain.blockExplorers?.default.url +
                                "/address/" +
                                chainSpecificData.nounsTreasuryAddress
                            }
                        >
                            <Button variant="secondary" className="gap-2 px-4 py-4">
                                <Image
                                    src="/nouns-icon.png"
                                    width={32}
                                    height={32}
                                    alt=""
                                    className="rounded-full bg-nouns p-0.5"
                                />
                                <h6>Nouns Treasury</h6>
                            </Button>
                        </LinkExternal>
                        <NounCard noun={treasuryNoun} size={200} enableHover={false} alwaysShowNumber />
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row w-full justify-end px-4 md:px-10 py-4 md:py-2 item-center items-center gap-6 text-secondary md:fixed md:bottom-0 md:bg-white md:border-t-4 border-secondary">
                    <Button
                        className="w-full md:w-auto justify-center"
                        disabled={selectedUserNoun == undefined || tip == undefined}
                        onClick={() =>
                            router.push(
                                `/swap/${treasuryNoun.chainId}/${treasuryNoun.id}/${selectedUserNoun?.id}/${tip}?` +
                                    searchParams.toString()
                            )
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
