import { BigIntString } from "@/utils/types";
import { Auction } from "./auction/types";
import { Noun, SecondaryNounListing } from "./noun/types";
import { Address } from "viem";

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

export function userNameQuery(address?: Address) {
  return {
    queryKey: ["user-name", address],
    queryFn: async () => (await (await fetch(`/api/user/${address}/name`)).json()) as string,
  };
}

export function userAvatarQuery(address?: Address) {
  return {
    queryKey: ["user-avatar", address],
    queryFn: async () => (await (await fetch(`/api/user/${address}/avatar`)).json()) as string | null,
  };
}

export function secondaryFloorListingQuery() {
  return {
    queryKey: ["secondary-floor-listing"],
    queryFn: async () => (await (await fetch(`/api/secondary-floor-listing`)).json()) as SecondaryNounListing | null,
  };
}
