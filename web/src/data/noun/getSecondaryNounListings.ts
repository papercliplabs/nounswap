"use server";
import { CHAIN_CONFIG } from "@/config";
import { paths } from "@reservoir0x/reservoir-sdk";
import { SecondaryNounListing } from "./types";
import { unstable_cache } from "next/cache";

export async function getSecondaryNounListingsUncached(): Promise<SecondaryNounListing[]> {
  let continuationCursor: string | undefined = undefined;
  let items: paths["/tokens/v7"]["get"]["responses"]["200"]["schema"]["tokens"] = [];

  while (true) {
    const response = await fetch(
      `${CHAIN_CONFIG.reservoirApiUrl}/tokens/v7?&collection=${CHAIN_CONFIG.addresses.nounsToken}&minFloorAskPrice=0&flagStatus=0&currencies=0x0000000000000000000000000000000000000000&limit=100&includeTopBid=false&includeMintStages=false`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.RESERVOIR_API_KEY!,
        },
        next: {
          revalidate: 0,
        },
      }
    );
    const respJson = await response.json();
    const data = respJson as paths["/tokens/v7"]["get"]["responses"]["200"]["schema"];

    items = items.concat(data.tokens ?? []);

    if (data.continuation) {
      // TODO: actually use this to get more than 100 items
      continuationCursor = data.continuation;
    } else {
      break;
    }
  }

  const secondaryListings: SecondaryNounListing[] = [];
  items.forEach((item) => {
    if (
      item.market?.floorAsk &&
      item.token?.tokenId != undefined &&
      item.market.floorAsk.id != undefined &&
      item.market.floorAsk.price?.amount?.raw != undefined
    ) {
      secondaryListings.push({
        nounId: item.token?.tokenId,
        marketName: item.market.floorAsk.source?.name,
        marketIcon: item.market.floorAsk.source?.icon,
        orderId: item.market.floorAsk.id,
        priceRaw: item.market.floorAsk.price.amount.raw,
        priceUsd: item.market.floorAsk.price.amount.usd,
      });
    } else {
      console.error("Invalid secondary listing item", item);
    }
  });

  return secondaryListings;
}

export const getSecondaryNounListings = unstable_cache(
  getSecondaryNounListingsUncached,
  ["get-secondary-noun-listings"],
  {
    revalidate: 60 * 15, // 15 min
  }
);

export async function getSecondaryListingForNoun(id: string): Promise<SecondaryNounListing | null> {
  const listings = await getSecondaryNounListings();
  return listings.find((listing) => listing.nounId === id) ?? null;
}

export async function getSecondaryFloorListing(): Promise<SecondaryNounListing | null> {
  const listings = await getSecondaryNounListings();
  return listings.length == 0
    ? null
    : listings.reduce((prev, curr) => (BigInt(curr.priceRaw) < BigInt(prev.priceRaw) ? curr : prev));
}
