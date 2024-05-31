"use client";
import { useBalance } from "wagmi";
import NounCard from "../../../../../components/NounCard";
import { useEffect, useState } from "react";
import WalletButton from "../../../../../components/WalletButton";
import Image from "next/image";
import Icon from "../../../../../components/ui/Icon";
import { CHAIN_CONFIG } from "../../../../../utils/config";
import { LinkExternal } from "../../../../../components/ui/link";
import { Button } from "../../../../../components/ui/button";
import UserNounSelectDialog from "../../../../../components/dialog/UserNounSelectDialog";
import UserTipDialog from "../../../../../components/dialog/UserTipDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Address } from "viem";
import { Noun } from "@/data/noun/types";

interface NounSwapProps {
  userNouns: Noun[];
  treasuryNoun: Noun;
  address?: Address;
}

export default function UserNounSelect({ userNouns, treasuryNoun, address }: NounSwapProps) {
  const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
  const [tip, setTip] = useState<bigint | undefined>(undefined);

  const { data: userBalance } = useBalance({
    address: address,
    token: CHAIN_CONFIG.wrappedNativeTokenAddress,
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
      <div className="flex grow flex-col justify-between md:pb-[72px]">
        <div className="flex w-full grow flex-col border-b-4 md:flex-row">
          <div className="relative flex flex-1 grow flex-col items-center justify-center gap-8 border-b-2 border-secondary px-8 py-12 md:border-b-0 md:border-r-2">
            <WalletButton hideChainSwitcher disableMobileShrink />
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
              className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full border-4 border-white bg-secondary p-3 md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2"
            />
          </div>
          <div className="flex flex-1 grow flex-col items-center justify-center gap-8 border-t-2 border-secondary px-8 py-12 md:border-l-2 md:border-t-0">
            <LinkExternal
              href={CHAIN_CONFIG.chain.blockExplorers?.default.url + "/address/" + CHAIN_CONFIG.addresses.nounsTreasury}
            >
              <Button variant="secondary" className="gap-2 px-4 py-4">
                <Image src="/nouns-icon.png" width={32} height={32} alt="" className="rounded-full bg-nouns p-0.5" />
                <h6>Nouns Treasury</h6>
              </Button>
            </LinkExternal>
            <NounCard noun={treasuryNoun} size={200} enableHover={false} alwaysShowNumber />
          </div>
        </div>
        <div className="item-center flex w-full flex-col-reverse items-center justify-end gap-6 border-secondary px-4 py-4 text-secondary md:fixed md:bottom-0 md:flex-row md:border-t-4 md:bg-white md:px-10 md:py-2">
          <Button
            className="w-full justify-center md:w-auto"
            disabled={selectedUserNoun == undefined || tip == undefined}
            onClick={() =>
              router.push(
                `/swap/${treasuryNoun.id}/${selectedUserNoun?.id}/${tip}?` + // TODO: removed chainId here
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
