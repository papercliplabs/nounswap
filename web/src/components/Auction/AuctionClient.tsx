"use client";
import { useNounImage } from "@/hooks/useNounImage";
import clsx from "clsx";
import { debounce } from "lodash";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NavButtons from "./NavButtons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auctionQuery, currentAuctionIdQuery, nounQuery, userAvatarQuery, userNameQuery } from "@/data/tanstackQueries";
import { Auction } from "@/data/auction/types";
import { LiveAuction } from "./LiveAuction";
import { EndedAuction } from "./EndedAuction";
import { CHAIN_CONFIG } from "@/config";
import { zeroAddress } from "viem";

const PREFETCH_DISTANCE = 3;

export default function AuctionClient() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const requestedAuctionId = useMemo(() => {
    return searchParams.get("auctionId");
  }, [searchParams]);

  const { data: currentAuctionId } = useQuery({
    ...currentAuctionIdQuery(),
    refetchInterval: 1000 * 2,
  });

  const [debouncedAuctionId, setDebouncedAuctionId] = useState<string | undefined>(
    requestedAuctionId ?? currentAuctionId
  );

  const auctionId = useMemo(() => {
    return requestedAuctionId ?? currentAuctionId;
  }, [requestedAuctionId, currentAuctionId]);

  useEffect(() => {
    const auctionIdDebounce = debounce((id: string | undefined) => {
      setDebouncedAuctionId(id);
    }, 200);

    auctionIdDebounce(auctionId);
    return () => auctionIdDebounce.cancel();
  }, [auctionId]);

  const { data: auction } = useQuery({
    ...auctionQuery(debouncedAuctionId),
    enabled: !!debouncedAuctionId,
    refetchInterval: 1000 * 2, // 2 sec
  });

  const { data: noun } = useQuery({
    ...nounQuery(debouncedAuctionId),
    enabled: !!debouncedAuctionId,
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
      if (debouncedAuctionId && currentAuctionId) {
        const id = Number(debouncedAuctionId);
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
  }, [debouncedAuctionId, currentAuctionId, queryClient]);

  const highestBidderAddress = useMemo(() => {
    if (auction?.nounderAuction) {
      return CHAIN_CONFIG.addresses.noundersMultisig;
    } else {
      const highestBid = auction?.bids[0];
      return highestBid?.bidderAddress ?? zeroAddress;
    }
  }, [auction?.nounderAuction, auction?.bids]);

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

        {auction &&
          (auction.state == "live" ? (
            <LiveAuction auction={auction} highestBidderAddress={highestBidderAddress} />
          ) : (
            <EndedAuction auction={auction} highestBidderAddress={highestBidderAddress} />
          ))}
      </div>
    </>
  );
}
