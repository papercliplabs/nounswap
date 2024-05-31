"use server";
import { Address } from "viem";
import { formatAddress } from "@/utils/format";
import { getNnsOrEnsNameForAddress } from "./getNnsOrEnsName";
import { getEnsAvatarForAddress } from "./getEnsAvatar";

interface User {
  name: string;
  imageSrc: string | null;
}

export async function getUserForAddress(address: Address): Promise<User> {
  const [name, avatar] = await Promise.all([getNnsOrEnsNameForAddress(address), getEnsAvatarForAddress(address)]);

  return {
    name: name ?? formatAddress(address),
    imageSrc: avatar,
  };
}
