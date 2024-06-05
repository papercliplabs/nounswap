"use client";
import { Noun } from "@/data/noun/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useMemo, useRef } from "react";
import { CHAIN_CONFIG } from "@/config";
import { Tooltip } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useInView } from "framer-motion";
import { useNounImage } from "@/hooks/useNounImage";

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
            className="outline outline-4 outline-transparent"
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
              <TooltipContent sideOffset={10} asChild>
                {/* TODO: fix the z-index (not working) */}
                <div className="bg-background-dark max-w-[320px] rounded-2xl p-4 text-white">
                  This Noun is held by the treasury. You can create a swap offer for this Nouns.
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
}
