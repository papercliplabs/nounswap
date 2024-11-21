import clsx from "clsx";
import AuctionClient from "./AuctionClient";
import { getCurrentAuctionNounId } from "@/data/auction/getCurrentAuctionNounId";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  auctionQuery,
  currentAuctionIdQuery,
  nounQuery,
  secondaryFloorListingQuery,
  secondaryTopOfferQuery,
  userNameQuery,
} from "@/data/tanstackQueries";
import { getAuctionById } from "@/data/auction/getAuctionById";
import { getNounByIdUncached } from "@/data/noun/getNounById";
import { Auction as AuctionType } from "@/data/auction/types";
import { getSecondaryFloorListing, getSecondaryTopOffer } from "@/data/noun/getSecondaryNounListings";
import { getClients } from "@/data/ponder/client/getClients";

export default async function Auction({ initialAuctionId }: { initialAuctionId?: string }) {
  return (
    <div
      className={clsx(
        "bg-nouns-cool relative flex h-full min-h-[571px] w-full flex-col justify-center overflow-hidden rounded-2xl border-2 md:h-[380px] md:min-h-fit md:flex-row md:border-none md:px-4"
      )}
    >
      <Suspense fallback={null}>
        <AuctionWrapper initialAuctionId={initialAuctionId} />
      </Suspense>
    </div>
  );
}

async function AuctionWrapper({ initialAuctionId }: { initialAuctionId?: string }) {
  const queryClient = new QueryClient();
  const [currentAuctionId, clients] = await Promise.all([getCurrentAuctionNounId(), getClients()]);
  const auctionId = initialAuctionId ?? currentAuctionId;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: currentAuctionIdQuery().queryKey,
      queryFn: getCurrentAuctionNounId,
    }),
    queryClient.prefetchQuery({
      queryKey: auctionQuery(auctionId).queryKey,
      queryFn: () => getAuctionById(auctionId),
    }),
    queryClient.prefetchQuery({
      queryKey: nounQuery(auctionId).queryKey,
      queryFn: () => getNounByIdUncached(auctionId),
    }),
    queryClient.prefetchQuery({
      queryKey: secondaryFloorListingQuery().queryKey,
      queryFn: () => getSecondaryFloorListing(),
    }),
    queryClient.prefetchQuery({
      queryKey: secondaryTopOfferQuery().queryKey,
      queryFn: () => getSecondaryTopOffer(),
    }),
  ]);

  const auction = (await queryClient.getQueryData(auctionQuery(auctionId).queryKey)) as AuctionType | undefined;
  const bidderAddress = auction?.bids[0]?.bidderAddress;
  if (bidderAddress) {
    queryClient.prefetchQuery(userNameQuery(auction.bids[0].bidderAddress));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuctionClient clients={clients} />
    </HydrationBoundary>
  );
}
