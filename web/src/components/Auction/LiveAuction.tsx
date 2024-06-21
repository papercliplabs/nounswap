"use client";
import { formatTimeLeft } from "@/utils/format";
import { useEffect, useState } from "react";
import { Address, formatEther } from "viem";
import { Skeleton } from "../ui/skeleton";
import Bid from "./Bid";
import { formatNumber } from "@/utils/utils";
import { AuctionDetailTemplate } from "./AuctionDetailsTemplate";
import { Auction } from "@/data/auction/types";
import { BidHistoryDialog } from "./BidHistoryDialog";
import { UserName, UserRoot } from "../User/UserClient";

export function LiveAuction({ auction }: { auction: Auction }) {
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
      {auction.bids.length > 0 && (
        <BidHistoryDialog nounId={auction.nounId} bids={auction.bids}>
          <span className="flex w-full whitespace-pre-wrap md:w-fit">
            Highest bidder{" "}
            <UserRoot address={auction.bids[0].bidderAddress} disableLink>
              <UserName />
            </UserRoot>
          </span>
        </BidHistoryDialog>
      )}
    </>
  );
}
