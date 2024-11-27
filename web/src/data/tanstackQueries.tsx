import { BigIntString } from "@/utils/types";
import { Auction } from "./auction/types";
import { Noun, SecondaryNounListing, SecondaryNounOffer } from "./noun/types";
import { Address } from "viem";
import { fetchAvatar, fetchName } from "@paperclip-labs/dapp-kit/identity/client";
import { IDENTITY_RESOLVERS } from "@/components/Identity";

export function currentAuctionIdQuery() {
  return {
    queryKey: ["current-auction-id"],
    queryFn: async () => (await (await fetch("/api/auction/currentId")).json()).currentAuctionId as string,
  };
}

export function auctionQuery(id?: BigIntString) {
  return {
    queryKey: ["auction", id],
    queryFn: async () => (await (await fetch(`/api/auction/${id}`)).json()) as Auction,
  };
}

export function nounQuery(id?: BigIntString) {
  return {
    queryKey: ["noun", id],
    queryFn: async () => (await (await fetch(`/api/noun/${id}`)).json()) as Noun,
  };
}

export function secondaryFloorListingQuery() {
  return {
    queryKey: ["secondary-floor-listing"],
    queryFn: async () => (await (await fetch(`/api/secondary-floor-listing`)).json()) as SecondaryNounListing | null,
  };
}

export function secondaryTopOfferQuery() {
  return {
    queryKey: ["secondary-top-offer"],
    queryFn: async () => (await (await fetch(`/api/secondary-top-offer`)).json()) as SecondaryNounOffer | null,
  };
}

export function userNameQuery(address: Address) {
  return {
    queryKey: ["name", { address, resolvers: IDENTITY_RESOLVERS }],
    queryFn: async () => await fetchName({ address, resolvers: IDENTITY_RESOLVERS }, "/api/dapp-kit"),
  };
}

export function userAvatarQuery(address: Address) {
  return {
    queryKey: ["avatar", { address, resolvers: IDENTITY_RESOLVERS }],
    queryFn: async () => await fetchAvatar({ address, resolvers: IDENTITY_RESOLVERS }, "/api/dapp-kit"),
  };
}

export function nogsQuery(nounId: string) {
  return {
    queryKey: ["nogs", nounId],
    queryFn: async () => (await (await fetch(`/api/noun/${nounId}/nogs`)).json()) as number | null,
  };
}
