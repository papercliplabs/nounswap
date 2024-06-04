"use client";
import { Noun } from "@/data/noun/types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import useIsOnScreen from "@/hooks/useIsOnScreen";
import { useRef } from "react";

interface NounCardProps {
  noun: Noun;
  size?: number;
  enableHover: boolean;
  alwaysShowNumber?: boolean;
  lazyLoad?: boolean;
}

export default function NounCard({ noun, size, enableHover, alwaysShowNumber, lazyLoad }: NounCardProps) {
  const ref = useRef<HTMLInputElement>(null);
  const isVisible = useIsOnScreen(ref);

  return (
    <div
      className={twMerge(
        "relative flex aspect-square justify-center overflow-hidden rounded-3xl outline outline-[5px] -outline-offset-1 outline-transparent",
        enableHover && "hover:outline-blue-400 [&>h6]:hover:block",
        alwaysShowNumber && "[&>h6]:block",
        size && size <= 100 && "rounded-xl",
        size && size <= 50 && "rounded-lg"
      )}
      ref={ref}
    >
      {!isVisible && lazyLoad ? (
        <div className="bg-background-secondary aspect-square" />
      ) : (
        <Image
          src={noun.imageSrc}
          fill={size == undefined}
          width={size}
          height={size}
          alt=""
          className="outline outline-4 outline-transparent"
        />
      )}
      <h6
        className={twMerge(
          "text-content-primary absolute bottom-[8px] hidden rounded-full bg-white px-3 py-0.5 shadow-lg",
          size && size <= 100 && "bottom-[4px] px-2 text-sm"
        )}
      >
        {noun.id}
      </h6>
    </div>
  );
}
