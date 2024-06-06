"use client";
import { useAccount, useBalance } from "wagmi";
import NounCard from "./NounCard";
import { useEffect, useState } from "react";
import WalletButton from "./WalletButton";
import Image from "next/image";
import Icon from "./ui/Icon";
import { CHAIN_CONFIG } from "../config";
import { LinkExternal } from "./ui/link";
import { Button } from "./ui/button";
import UserNounSelectDialog from "./dialog/UserNounSelectDialog";
import UserTipDialog from "./dialog/UserTipDialog";
import { useRouter } from "next/navigation";
import { Noun } from "@/data/noun/types";
import { useQuery } from "@tanstack/react-query";
import { getNounsForAddress } from "@/data/noun/getNounsForAddress";

interface NounSwapProps {
  treasuryNoun: Noun;
}

export default function UserNounSelect({ treasuryNoun }: NounSwapProps) {
  const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
  const [tip, setTip] = useState<bigint | undefined>(undefined);

  const { address } = useAccount();

  const { data: userBalance } = useBalance({
    address: address,
    token: CHAIN_CONFIG.wrappedNativeTokenAddress,
  });

  const router = useRouter();

  const { data: userNouns } = useQuery({
    queryKey: ["get-nouns-for-address", address],
    queryFn: () => getNounsForAddress(address!),
    enabled: address != undefined,
  });

  useEffect(() => {
    // Clear selection if disconnected
    if (!address) {
      setSelectedUserNoun(undefined);
      setTip(undefined);
    }
  }, [address, setSelectedUserNoun]);

  return (
    <>
      <div className="flex grow flex-col justify-between md:pb-[64px]">
        <div className="flex w-full grow flex-col border-b-4 md:flex-row">
          <div className="border-border-secondary relative flex flex-1 grow flex-col items-center justify-center gap-8 border-b-2 px-8 py-12 md:border-b-0 md:border-r-2">
            <WalletButton disableMobileShrink />
            <div className="flex flex-col items-center justify-center gap-6 lg:flex-row">
              <UserNounSelectDialog
                connected={address != undefined}
                userNouns={userNouns}
                selectedUserNoun={selectedUserNoun}
                selectedNounCallback={(noun?: Noun) => setSelectedUserNoun(noun)}
              />
              <Icon icon="plus" size={20} className="fill-gray-600" />
              <UserTipDialog
                connected={address != undefined}
                userBalance={userBalance?.value}
                swapUrl={CHAIN_CONFIG.swapForWrappedNativeUrl}
                tip={tip}
                setTipCallback={setTip}
              />
            </div>
            <Icon
              icon="repeat"
              size={64}
              className="bg-background-secondary absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full border-4 border-white p-3 md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2"
            />
          </div>
          <div className="border-border-secondary flex flex-1 grow flex-col items-center justify-center gap-8 border-t-2 px-8 py-12 md:border-l-2 md:border-t-0">
            <LinkExternal
              href={CHAIN_CONFIG.chain.blockExplorers?.default.url + "/address/" + CHAIN_CONFIG.addresses.nounsTreasury}
            >
              <Button variant="secondary" className="gap-2 px-4 py-4">
                <Image
                  src="/nouns-icon.png"
                  width={32}
                  height={32}
                  alt=""
                  className="bg-background-nouns rounded-full p-0.5"
                />
                <h6>Nouns Treasury</h6>
              </Button>
            </LinkExternal>
            <NounCard noun={treasuryNoun} size={200} enableHover={false} alwaysShowNumber />
          </div>
        </div>
        <div className="item-center border-border-secondary text-content-secondary flex w-full flex-col-reverse items-center justify-end gap-6 px-4 py-4 md:fixed md:bottom-0 md:flex-row md:border-t-4 md:bg-white md:px-10 md:py-2">
          <Button
            className="w-full justify-center md:w-auto"
            disabled={selectedUserNoun == undefined || tip == undefined}
            onClick={() => router.push(`/swap/${treasuryNoun.id}/${selectedUserNoun?.id}/${tip}`)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
