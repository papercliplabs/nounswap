"use client";
import { Noun } from "@/data/noun/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useMemo, useRef } from "react";
import { CHAIN_CONFIG } from "@/config";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useInView } from "framer-motion";
import { useNounImage } from "@/hooks/useNounImage";
import Icon from "./ui/Icon";

interface NounCardProps {
  noun: Noun;
  size?: number;
  enableHover: boolean;
  alwaysShowNumber?: boolean;
  lazyLoad?: boolean;
}

export default function NounCard({ noun, size, enableHover, alwaysShowNumber, lazyLoad }: NounCardProps) {
  const ref = useRef<HTMLInputElement>(null);
  const isInView = useInView(ref, { margin: "500px 0px" });
  const isTreasuryNoun = useMemo(() => noun.owner == CHAIN_CONFIG.addresses.nounsTreasury, [noun.owner]);
  const isHeldByNounsErc20 = useMemo(() => noun.owner == CHAIN_CONFIG.addresses.nounsErc20, [noun.owner]);

  const nounImage = useNounImage("full", noun);

  return (
    <div
      className={twMerge(
        "relative flex aspect-square justify-center overflow-hidden rounded-2xl outline outline-[5px] -outline-offset-1 outline-transparent",
        enableHover && "hover:outline-content-primary [&>h6]:hover:block",
        alwaysShowNumber && "[&>h6]:block",
        size && size <= 100 && "rounded-xl",
        size && size <= 50 && "rounded-lg"
      )}
      ref={ref}
    >
      {!isInView && lazyLoad ? (
        <div className="bg-background-secondary aspect-square" />
      ) : (
        <>
          <Image
            src={nounImage ?? "/noun-loading-skull.gif"}
            fill={size == undefined}
            width={size}
            height={size}
            alt=""
            className="object-contain outline outline-4 outline-transparent"
            unoptimized={nounImage == undefined}
            draggable={false}
          />
          <h6
            className={twMerge(
              "text-content-primary absolute bottom-[8px] hidden rounded-full bg-white px-3 py-0.5 shadow-lg",
              size && size <= 100 && "bottom-[4px] px-2 text-sm"
            )}
          >
            {noun.id}
          </h6>
          {isTreasuryNoun && enableHover && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src="/swap-icon.svg"
                  width={size ? size / 10 : 30}
                  height={size ? size / 10 : 30}
                  alt=""
                  className="absolute right-2 top-2"
                />
              </TooltipTrigger>
              <TooltipContent>
                This Noun is held by the treasury. <br />
                You can create a swap offer for this Noun.
              </TooltipContent>
            </Tooltip>
          )}
          {isHeldByNounsErc20 && enableHover && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white px-2 py-[5px] shadow-md">
                  <Icon icon="lightning" size={size ? size / 10 : 16} />
                  <span className="label-sm text-content-primary">Swap</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                This Noun is held by the $nouns ERC-20 contract. It can be instantly swapped with any Noun you own.
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
}
