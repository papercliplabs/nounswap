"use client";
import { CurrentAuction, getCurrentAuction } from "@/data/auction/getCurrentAuction";
import { getNounById } from "@/data/noun/getNounById";
import { getUserForAddress } from "@/data/user/getUser";
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
import { Noun } from "@/data/noun/types";
import { formatNumber } from "@/utils/utils";
import ViewBidsDialog from "./ViewBidsDialog";

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
        queryKey: ["noun-query", auction?.nounId],
        queryFn: () => getNounById(auction?.nounId ?? ""),
        enabled: auction != undefined,
        refetchInterval: 1000 * 30, // Every 30s
      },
      {
        queryKey: ["get-user", highestBid?.bidderAddress],
        queryFn: () => getUserForAddress(highestBid?.bidderAddress ?? zeroAddress),
        enabled: !auctionIsLoading,
      },
    ],
  });

  return (
    <div
      className={clsx(
        "flex w-full flex-row justify-center overflow-hidden rounded-3xl border-2 bg-transparent md:h-[380px] md:border-none md:px-4",
        noun?.traits.background.seed == 1 ? "md:bg-background-nouns-warm" : "md:bg-background-nouns-cool"
      )}
    >
      <div className="flex w-full max-w-[900px] flex-col justify-between md:flex-row">
        <div
          className={clsx(
            "flex h-full flex-col items-center md:items-end md:justify-end md:bg-transparent",
            noun?.traits.background.seed == 1 ? "bg-background-nouns-warm" : "bg-background-nouns-cool"
          )}
        >
          <Image
            src={noun ? noun.imageSrc : "/noun-loading-skull.gif"}
            width={370}
            height={370}
            alt=""
            unoptimized={noun == undefined}
            className="h-[194px] w-[194px] rounded-3xl bg-background-nouns-cool object-contain object-bottom md:h-[370px] md:w-[370px] md:bg-transparent"
          />
        </div>
        <div className="mx-auto flex min-h-[212px] w-full min-w-0 shrink-0 flex-col items-start justify-center gap-3 px-6 py-4 md:w-[400px]">
          {auction && (
            <>
              {auction.state == "live" && (
                <div className="flex items-center gap-[10px] text-semantic-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#93BFFE" />
                    <circle cx="8" cy="8" r="4" fill="#0D6EFD" />
                  </svg>
                  Live auction
                </div>
              )}

              <h1 className="flex whitespace-pre-wrap">Noun {auction.nounId}</h1>

              {auction.state == "live" ? (
                <LiveAuction auction={auction} />
              ) : (
                <EndedAuction auction={auction} noun={noun} />
              )}

              <div className="flex w-full flex-col flex-wrap justify-center whitespace-pre-wrap font-medium text-content-secondary md:items-start md:justify-start">
                <div className="flex w-full min-w-0 justify-center whitespace-pre-wrap md:justify-start">
                  <span className="shrink-0">{auction.state == "live" ? "Highest bidder" : "Winner"} </span>
                  {userIsLoading ? (
                    <Skeleton className="h-full w-[200px]" />
                  ) : (
                    <span className="overflow-hidden text-ellipsis text-nowrap text-content-primary">{user?.name}</span>
                  )}
                </div>
                {auction.bids.length > 0 && <ViewBidsDialog nounId={auction.nounId} bids={auction.bids} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveAuction({ auction }: { auction: CurrentAuction }) {
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
    </>
  );
}

function EndedAuction({ auction, noun }: { auction: AuctionType; noun?: Noun }) {
  const winningBid = auction.bids[0];

  const { data: user } = useQuery({
    queryKey: ["get-user-query", noun?.owner],
    queryFn: () => getUserForAddress(noun?.owner ?? zeroAddress),
    enabled: noun != undefined,
  });

  return (
    <>
      <AuctionDetailTemplate
        item1={{
          title: "Winning bid",
          value: `${formatNumber(formatEther(winningBid ? BigInt(winningBid.amount) : BigInt(0)))} ETH`,
        }}
        item2={{
          title: "Held by",
          value: (
            <>
              {user?.imageSrc && (
                <Image
                  src={user.imageSrc}
                  width={36}
                  height={36}
                  alt=""
                  className="h-[36px] w-[36px] rounded-full border border-border-primary"
                />
              )}
              {user ? (
                <span
                  className="overflow-hidden text-ellipsis"
                  style={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", lineHeight: "inherit" }}
                >
                  {user.name}
                </span>
              ) : (
                <Skeleton className="w-[100px] whitespace-pre-wrap"> </Skeleton>
              )}
            </>
          ),
        }}
      />
      {auction.state == "ended-unsettled" && <Settle />}
    </>
  );
}

function AuctionDetailTemplate({
  item1,
  item2,
}: {
  item1: { title: string; value: ReactNode };
  item2: { title: string; value: ReactNode };
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 overflow-hidden md:flex-row md:gap-12">
      <div className="flex shrink-0 justify-between md:flex-col">
        <span className="shrink-0 pr-2 text-content-secondary">{item1.title}</span>
        <span className="md:title-4 font-pt font-bold opacity-80">{item1.value}</span>
      </div>
      <div className="flex min-w-0 justify-between md:flex-col">
        <span className="shrink-0 pr-2 text-content-secondary">{item2.title}</span>
        <div className="md:title-4 flex w-full min-w-0 items-center justify-end whitespace-nowrap font-pt font-bold opacity-80 md:justify-start md:gap-0">
          {item2.value}
        </div>
      </div>
    </div>
  );
}
