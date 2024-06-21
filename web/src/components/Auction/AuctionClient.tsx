"use client";
import { useNounImage } from "@/hooks/useNounImage";
import clsx from "clsx";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import NavButtons from "./NavButtons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auctionQuery, currentAuctionIdQuery, nounQuery, userAvatarQuery, userNameQuery } from "@/data/tanstackQueries";
import { Auction } from "@/data/auction/types";
import { LiveAuction } from "./LiveAuction";
import { EndedAuction } from "./EndedAuction";

const PREFETCH_DISTANCE = 3;

export default function AuctionClient() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const requestedAuctionId = useMemo(() => {
    return searchParams.get("auctionId");
  }, [searchParams]);

  const { data: currentAuctionId, refetch: refetchCurrentAuctionId } = useQuery({
    ...currentAuctionIdQuery(),
  });

  const auctionId = useMemo(() => {
    return requestedAuctionId ?? currentAuctionId;
  }, [requestedAuctionId, currentAuctionId]);

  const { data: auction } = useQuery({
    ...auctionQuery(auctionId),
    enabled: !!auctionId,
    refetchInterval: auctionId == currentAuctionId ? 1000 : undefined, // 1 sec
  });

  const { data: noun } = useQuery({
    ...nounQuery(auctionId),
    enabled: !!auctionId,
  });
  const nounImgSrc = useNounImage("full", noun);

  const date = useMemo(() => {
    if (auction?.endTime) {
      const endTimeMs = Number(auction.endTime) * 1000;
      const endDate = new Date(endTimeMs);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(endDate);
    } else {
      return null;
    }
  }, [auction?.endTime]);

  // Update current auction once it settles
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (auctionId == currentAuctionId) {
      interval = setInterval(() => {
        if (auction?.state == "ended-settled" && auctionId == currentAuctionId) {
          refetchCurrentAuctionId();
        }
      }, 500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [auctionId, currentAuctionId, auction?.state, refetchCurrentAuctionId]);

  // Set to current if at or above current
  useEffect(() => {
    if (requestedAuctionId && currentAuctionId && Number(requestedAuctionId) >= Number(currentAuctionId)) {
      const params = new URLSearchParams(searchParams);
      params.delete("auctionId");
      window.history.pushState(null, "", `?${params.toString()}`);
    }
  }, [requestedAuctionId, currentAuctionId, searchParams]);

  // Prefetch auctions on either side
  useEffect(() => {
    async function prefetch() {
      if (auctionId && currentAuctionId) {
        const id = Number(auctionId);
        for (
          let i = Math.max(0, id - PREFETCH_DISTANCE);
          i < Math.min(Number(currentAuctionId), id + PREFETCH_DISTANCE);
          i++
        ) {
          await Promise.all([
            queryClient.prefetchQuery(auctionQuery(i.toString())),
            queryClient.prefetchQuery(nounQuery(i.toString())),
          ]);

          const auction = (await queryClient.getQueryData(auctionQuery(i.toString()).queryKey)) as Auction | undefined;
          if (auction && auction.bids.length > 0) {
            await Promise.all([
              queryClient.prefetchQuery(userNameQuery(auction.bids[0].bidderAddress)),
              queryClient.prefetchQuery(userAvatarQuery(auction.bids[0].bidderAddress)),
            ]);
          }
        }
      }
    }

    prefetch();
  }, [auctionId, currentAuctionId, queryClient]);

  return (
    <>
      <div
        className={clsx("absolute inset-0 z-0", noun?.traits.background.seed == 1 ? "bg-nouns-warm" : "bg-nouns-cool")}
      />
      <div
        className={clsx("flex flex-1 flex-col items-center justify-end md:items-end md:bg-transparent md:pr-[60px]")}
      >
        <Image
          src={nounImgSrc ?? "/noun-loading-skull.gif"}
          width={370}
          height={370}
          className="z-10 flex h-[194px] w-[194px] flex-1 select-none items-end justify-end rounded-3xl object-contain object-bottom md:h-[370px] md:w-[370px]"
          draggable={false}
          unoptimized={nounImgSrc == undefined}
          alt=""
        />
      </div>
      <div className="z-10 flex min-h-[377px] w-full min-w-0 flex-1 flex-col items-start justify-start gap-4 bg-white p-6 md:w-fit md:gap-6 md:bg-transparent">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-row-reverse items-center justify-between gap-3 md:flex-row md:justify-start">
            {auctionId && currentAuctionId && <NavButtons auctionId={auctionId} currentAuctionId={currentAuctionId} />}
            <span className="label-md text-content-secondary">{date}</span>
          </div>
          <div>
            <h1 className="flex whitespace-pre-wrap">Noun {auctionId}</h1>
          </div>
        </div>

        {auction && (auction.state == "live" ? <LiveAuction auction={auction} /> : <EndedAuction auction={auction} />)}
      </div>
    </>
  );
}
