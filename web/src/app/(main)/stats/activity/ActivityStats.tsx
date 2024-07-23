"use client";

import { useActivitySelector } from "@/components/selectors/ActivitySelector";
import TitlePopover from "@/components/TitlePopover";
import Card from "@/components/ui/card";
import Icon from "@/components/ui/Icon";
import { LinkExternal } from "@/components/ui/link";
import { UserAvatar, UserName, UserRoot } from "@/components/User/UserClient";
import { CHAIN_CONFIG } from "@/config";
import { Noun } from "@/data/noun/types";
import { ActivityEntry } from "@/data/ponder/activity/getActivity";
import { useNounImage } from "@/hooks/useNounImage";
import { formatNumber, formatTimeSinceNow } from "@/utils/format";
import Image from "next/image";
import { useMemo } from "react";
import { Address, getAddress } from "viem";

interface ActivityStatsProps {
  data: ActivityEntry[];
  nouns: Noun[];
  swappableNounCount: number;
}

export default function ActivityStats({ data, nouns, swappableNounCount }: ActivityStatsProps) {
  const activitySelector = useActivitySelector();
  const swapCount = data.reduce((acc, entry) => (entry.type == "swap" ? acc + 1 : acc), 0);

  const filteredData = useMemo(() => {
    switch (activitySelector) {
      case "all":
        return data;
      case "swap":
        return data.filter((entry) => entry.type === "swap");
      case "deposit":
        return data.filter((entry) => entry.type === "deposit");
      case "redeem":
        return data.filter((entry) => entry.type === "redeem");
    }
  }, [data, activitySelector]);
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex flex-col">
          <TitlePopover title="Total Swaps">Total number of swaps via $nouns.</TitlePopover>
          <span className="label-lg">{formatNumber({ input: swapCount, maxFractionDigits: 0 })}</span>
        </Card>
        <Card className="flex flex-col">
          <TitlePopover title="Swappable Nouns">Current number of swappable Nouns in the $nouns contract.</TitlePopover>
          <span className="label-lg">{swappableNounCount}</span>
        </Card>
      </div>
      <div className="flex flex-col">
        {filteredData.map((entry, i) => {
          return (
            <LinkExternal
              key={i}
              className="hover:bg-background-secondary rounded-lg px-4 py-2 hover:brightness-100"
              href={CHAIN_CONFIG.chain.blockExplorers?.default.url + `/tx/${entry.transaction.id}`}
            >
              {entry.type === "swap" ? (
                <SwapActivity
                  swapper={getAddress(entry.swapperId)}
                  inputNoun={nouns.find((nouns) => nouns.id == entry.fromNounsNftId)!}
                  outputNoun={nouns.find((nouns) => nouns.id == entry.toNounsNftId)!}
                  timestamp={Number(entry.transaction.timestamp)}
                />
              ) : entry.type === "deposit" ? (
                <DepositActivity
                  depositor={getAddress(entry.depositorId)}
                  noun={nouns.find((noun) => noun.id == entry.nounsNftId)!}
                  timestamp={Number(entry.transaction.timestamp)}
                />
              ) : (
                <RedeemActivity
                  noun={nouns.find((noun) => noun.id == entry.nounsNftId)!}
                  redeemer={getAddress(entry.redeemerId)}
                  timestamp={Number(entry.transaction.timestamp)}
                />
              )}
            </LinkExternal>
          );
        })}
      </div>
    </>
  );
}

function RedeemActivity({ redeemer, noun, timestamp }: { redeemer: Address; noun: Noun; timestamp: Number }) {
  const nounImage = useNounImage("full", noun);
  return (
    <div className="flex justify-between">
      <div className="flex gap-1.5">
        <div className="relative">
          <Image
            src="/redeem-icon.png"
            width={22}
            height={22}
            alt=""
            className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 rounded-full border-2 border-white"
          />
          <Image
            src={nounImage ?? "/noun-loading-skull.gif"}
            width={44}
            height={44}
            alt=""
            className="mr-4 rounded-md object-contain"
            draggable={false}
          />
        </div>
        <div className="flex flex-col">
          <span className="paragraph-sm text-content-secondary flex gap-1">
            Redeem by
            <UserRoot address={redeemer} className="gap-1 font-bold" disableLink>
              <UserAvatar imgSize={16} className="h-[16px] w-[16px]" />
              <UserName />
            </UserRoot>
          </span>
          <span className="label-md">Noun {noun.id}</span>
        </div>
      </div>
      <span className="text-content-secondary paragraph-sm">{formatTimeSinceNow(Number(timestamp))}</span>
    </div>
  );
}

function DepositActivity({ depositor, noun, timestamp }: { depositor: Address; noun: Noun; timestamp: Number }) {
  const nounImage = useNounImage("full", noun);
  return (
    <div className="flex justify-between">
      <div className="flex gap-1.5">
        <div className="relative">
          <Image
            src="/deposit-icon.png"
            width={22}
            height={22}
            alt=""
            className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 rounded-full border-2 border-white"
          />
          <Image
            src={nounImage ?? "/noun-loading-skull.gif"}
            width={44}
            height={44}
            alt=""
            className="mr-4 rounded-md object-contain"
            draggable={false}
          />
        </div>
        <div className="flex flex-col">
          <span className="paragraph-sm text-content-secondary flex gap-1">
            Deposit by
            <UserRoot address={depositor} className="gap-1 font-bold" disableLink>
              <UserAvatar imgSize={16} className="h-[16px] w-[16px]" />
              <UserName />
            </UserRoot>
          </span>
          <span className="label-md">Noun {noun.id}</span>
        </div>
      </div>
      <span className="text-content-secondary paragraph-sm">{formatTimeSinceNow(Number(timestamp))}</span>
    </div>
  );
}

function SwapActivity({
  swapper,
  inputNoun,
  outputNoun,
  timestamp,
}: {
  swapper: Address;
  inputNoun: Noun;
  outputNoun: Noun;
  timestamp: Number;
}) {
  const inputNounImage = useNounImage("full", inputNoun);
  const outputNounImage = useNounImage("full", outputNoun);
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-[22px]">
        <div className="relative">
          <Image
            src="/swap-icon.png"
            width={22}
            height={22}
            alt=""
            className="absolute left-0 top-0 z-10 -translate-x-1/3 -translate-y-1/3 rounded-full border-2 border-white"
          />
          <Image
            src={inputNounImage ?? "/noun-loading-skull.gif"}
            width={28}
            height={28}
            alt=""
            className="absolute left-[30px] top-1/2 z-0 h-[28px] w-[28px] -translate-y-1/2 rotate-[5deg] rounded-[4.6px] object-contain"
            draggable={false}
          />
          <Image
            src={outputNounImage ?? "/noun-loading-skull.gif"}
            width={40}
            height={40}
            alt=""
            className="z-10 h-[44px] w-[44px] -translate-x-[2px] rounded-md border-2 border-white object-contain"
            draggable={false}
          />
        </div>
        <div className="flex flex-col">
          <span className="paragraph-sm text-content-secondary flex gap-1">
            Swap by
            <UserRoot address={swapper} className="gap-1 font-bold" disableLink>
              <UserAvatar imgSize={16} className="h-[16px] w-[16px]" />
              <UserName />
            </UserRoot>
          </span>
          <div className="label-md flex items-center gap-1.5">
            <span>Noun {inputNoun.id}</span>
            <div className="bg-background-secondary rounded-full p-[3px]">
              <Icon icon="chevronRight" size={10} />
            </div>
            <span>Noun {outputNoun.id}</span>
          </div>
        </div>
      </div>
      <span className="text-content-secondary paragraph-sm">{formatTimeSinceNow(Number(timestamp))}</span>
    </div>
  );
}
