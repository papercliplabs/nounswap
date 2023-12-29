"use client";
import { useAccountModal, useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Address, useAccount, useEnsAvatar, useEnsName, useNetwork, useSwitchNetwork } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { twMerge } from "tailwind-merge";

interface WalletButtonProps {
    hideChainSwitcher?: boolean;
    disableMobileShrink?: boolean;
}

export default function WalletButton({ hideChainSwitcher, disableMobileShrink }: WalletButtonProps) {
    const { address } = useAccount();
    const { data: ensName } = useEnsName({ address, chainId: 1 });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName, chainId: 1 });

    return (
        <>
            <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal }) => {
                    const connected = account && chain;

                    return (
                        <div>
                            {(() => {
                                if (!connected) {
                                    return (
                                        <button className="btn-primary" onClick={openConnectModal}>
                                            Connect
                                        </button>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <button className="btn-negative" onClick={openChainModal}>
                                            Wrong Network
                                        </button>
                                    );
                                }

                                return (
                                    <div className="flex flex-row gap-2">
                                        <button
                                            className={twMerge("ghost flex", hideChainSwitcher && "hidden")}
                                            onClick={openChainModal}
                                        >
                                            <Image src={chain.iconUrl ?? ""} width={32} height={32} alt="" />
                                        </button>
                                        <button
                                            onClick={openAccountModal}
                                            className="flex flex-row gap-2 px-4 py-3 border-2 border-gray-400 rounded-2xl hover:bg-gray-200 active:clickable-active items-center text-gray-900"
                                        >
                                            {ensAvatar ? (
                                                <Image
                                                    src={ensAvatar ?? ""}
                                                    width={32}
                                                    height={32}
                                                    alt="avatar"
                                                    className=" rounded-full"
                                                />
                                            ) : (
                                                <div
                                                    className="w-[32px] h-[32px] rounded-full"
                                                    style={{
                                                        background: getLinearGradientForAddress(
                                                            account.address as Address
                                                        ),
                                                    }}
                                                />
                                            )}
                                            <span className={twMerge("md:flex", !disableMobileShrink && "hidden")}>
                                                {ensName ?? getShortAddress(account.address as Address)}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
            {/* {address ? (
                chain?.unsupported ? (
                    <button className="btn-negative" onClick={openChainModal}>
                        Wrong Network
                    </button>
                ) : (
                    <div className="flex flex-row gap-2">
                        <button>HERE</button>
                        <button
                            onClick={openAccountModal}
                            className="flex flex-row gap-2 px-4 py-3 border-2 border-gray-400 rounded-2xl hover:bg-gray-200 active:clickable-active items-center text-gray-900"
                        >
                            {ensAvatar ? (
                                <Image
                                    src={ensAvatar ?? ""}
                                    width={32}
                                    height={32}
                                    alt="avatar"
                                    className=" rounded-full"
                                />
                            ) : (
                                <div
                                    className="w-[32px] h-[32px] rounded-full"
                                    style={{ background: getLinearGradientForAddress(address) }}
                                />
                            )}
                            <span className="hidden md:flex">{ensName ?? getShortAddress(address)}</span>
                        </button>
                    </div>
                )
            ) : (
                <button className="btn-primary" onClick={openConnectModal}>
                    Connect
                </button>
            )} */}
        </>
    );
}
