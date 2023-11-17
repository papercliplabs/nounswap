"use client";
import { useAccountModal, useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from "wagmi";
import { getLinearGradientForAddress, getShortAddress } from "@/common/utils";

export default function WalletButton() {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName });

    const { openAccountModal } = useAccountModal();
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    return (
        <>
            {address ? (
                chain?.unsupported ? (
                    <button className="btn-negative" onClick={openChainModal}>
                        Wrong Network
                    </button>
                ) : (
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
                )
            ) : (
                <button className="btn-primary" onClick={openConnectModal}>
                    Connect
                </button>
            )}
        </>
    );
}
