"use client";
import { CurrentAuction, getCurrentAuction } from "@/data/auction/getCurrentAuction";
import { getNounById, getNounByIdUncached } from "@/data/noun/getNounById";
import { User, getUserForAddress } from "@/data/user/getUser";
import { formatTimeLeft } from "@/utils/format";
import { useQueries, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { formatEther, zeroAddress } from "viem";
import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";
import Settle from "./Settle";
import Bid from "./Bid";
import { Auction as AuctionType } from "@/data/auction/types";
import { formatNumber } from "@/utils/utils";
import ViewBidsDialog from "./ViewBidsDialog";
import { useNounImage } from "@/hooks/useNounImage";

export default function Auction() {
  const { data: auction, isLoading: auctionIsLoading } = useQuery({
    queryKey: ["auction-query"],
    queryFn: () => getCurrentAuction(),
    refetchInterval: 1000 * 2, // Every 2s
  });

  const highestBid = auction?.bids[0];

  const [{ data: noun }, { data: user, isLoading: userIsLoading }] = useQueries({
    queries: [
      {
        queryKey: ["noun-query-uncached", auction?.nounId],
        queryFn: () => getNounByIdUncached(auction?.nounId ?? ""),
        enabled: auction != undefined,
      },
      {
        queryKey: ["get-user", highestBid?.bidderAddress],
        queryFn: () => getUserForAddress(highestBid?.bidderAddress ?? zeroAddress),
        enabled: !auctionIsLoading,
      },
    ],
  });

  const imageSrc = useNounImage("full", noun);

  return (
    <div
      className={clsx(
        "flex w-full flex-row justify-center overflow-hidden rounded-3xl border-2 bg-transparent md:h-[380px] md:border-none md:px-4",
        noun?.traits.background.seed == 1 ? "md:bg-nouns-warm" : "md:bg-nouns-cool"
      )}
    >
      <div className="flex w-full max-w-[900px] flex-col justify-between md:flex-row">
        <div
          className={clsx(
            "flex h-full flex-col items-center md:items-end md:justify-end md:bg-transparent",
            noun?.traits.background.seed == 1 ? "bg-nouns-warm" : "bg-nouns-cool"
          )}
        >
          <Image
            src={imageSrc ?? "/noun-loading-skull.gif"}
            width={370}
            height={370}
            alt=""
            unoptimized={noun == undefined}
            className="bg-nouns-cool h-[194px] w-[194px] rounded-3xl object-contain object-bottom md:h-[370px] md:w-[370px] md:bg-transparent"
          />
        </div>
        <div className="mx-auto flex min-h-[212px] w-full min-w-0 shrink-0 flex-col items-start justify-center gap-4 p-6 md:w-[400px] md:gap-6">
          {auction && (
            <>
              <div>
                {auction.state == "live" && (
                  <div className="text-semantic-accent label-md flex items-center gap-[10px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#93BFFE" />
                      <circle cx="8" cy="8" r="4" fill="#0D6EFD" />
                    </svg>
                    Live auction
                  </div>
                )}

                <h1 className="flex whitespace-pre-wrap">Noun {auction.nounId}</h1>
              </div>

              {auction.state == "live" ? (
                <LiveAuction auction={auction} highestBidder={user} />
              ) : (
                <EndedAuction auction={auction} highestBidder={user} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveAuction({ auction, highestBidder }: { auction: CurrentAuction; highestBidder?: User }) {
  const [timeRemainingS, setTimeRemainingS] = useState<number | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemainingS(Math.max(Number(auction.endTime) - Date.now() / 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime, setTimeRemainingS]);

  const highestBid = auction.bids[0];

  return (
    <>
      <AuctionDetailTemplate
        item1={{
          title: "Current bid",
          value: `${formatNumber(formatEther(highestBid ? BigInt(highestBid.amount) : BigInt(0)), 2)} ETH`,
        }}
        item2={{
          title: "Time left",
          value: (
            <>
              {timeRemainingS != undefined ? (
                formatTimeLeft(timeRemainingS)
              ) : (
                <Skeleton className="w-[100px] whitespace-pre-wrap"> </Skeleton>
              )}
            </>
          ),
        }}
      />
      <Bid nounId={BigInt(auction.nounId)} nextMinBid={BigInt(auction.nextMinBid)} />

      {auction.bids.length > 0 &&
        (highestBidder ? (
          <ViewBidsDialog nounId={auction.nounId} bids={auction.bids}>
            Highest bidder {highestBidder?.name}
          </ViewBidsDialog>
        ) : (
          <Skeleton className="h-[20px] w-[200px] whitespace-pre-wrap" />
        ))}
    </>
  );
}

function EndedAuction({ auction, highestBidder }: { auction: AuctionType; highestBidder?: User }) {
  const winningBid = auction.bids[0];

  return (
    <>
      <AuctionDetailTemplate
        item1={{
          title: "Winning bid",
          value: `${formatNumber(formatEther(winningBid ? BigInt(winningBid.amount) : BigInt(0)))} ETH`,
        }}
        item2={{
          title: "Won by",
          value: (
            <>
              {highestBidder?.imageSrc && (
                <Image
                  src={highestBidder.imageSrc}
                  width={36}
                  height={36}
                  alt=""
                  className="border-border-primary h-[36px] w-[36px] rounded-full border"
                />
              )}
              {highestBidder ? (
                <span
                  className="overflow-hidden text-ellipsis"
                  style={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", lineHeight: "inherit" }}
                >
                  {highestBidder.name}
                </span>
              ) : (
                <Skeleton className="w-[100px] whitespace-pre-wrap"> </Skeleton>
              )}
            </>
          ),
        }}
      />
      {auction.state == "ended-unsettled" && <Settle />}
      {auction.bids.length > 0 && (
        <ViewBidsDialog nounId={auction.nounId} bids={auction.bids}>
          Show all bids
        </ViewBidsDialog>
      )}
    </>
  );
}

const ONE_OFF_MD_FONT = "md:text-[28px] md:font-bold md:leading-[36px]";

function AuctionDetailTemplate({
  item1,
  item2,
}: {
  item1: { title: string; value: ReactNode };
  item2: { title: string; value: ReactNode };
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 overflow-hidden md:flex-row md:gap-12">
      <div className="label-md flex shrink-0 justify-between md:flex-col">
        <span className="text-content-secondary shrink-0 pr-2">{item1.title}</span>
        <span className={clsx("opacity-80", ONE_OFF_MD_FONT)}>{item1.value}</span>
      </div>
      <div className="label-md flex min-w-0 justify-between md:flex-col">
        <span className="text-content-secondary shrink-0 pr-2">{item2.title}</span>
        <div
          className={clsx(
            "flex w-full min-w-0 items-center justify-end gap-2 whitespace-nowrap opacity-80 md:justify-start",
            ONE_OFF_MD_FONT
          )}
        >
          {item2.value}
        </div>
      </div>
    </div>
  );
}
