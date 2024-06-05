"use server";
import { Address, isAddressEqual } from "viem";
import { formatAddress } from "@/utils/format";
import { getNnsOrEnsNameForAddress } from "./getNnsOrEnsName";
import { getEnsAvatarForAddress } from "./getEnsAvatar";
import { CHAIN_CONFIG } from "@/config";

export interface User {
  name: string;
  imageSrc: string | null;
}

export async function getUserForAddress(address: Address): Promise<User> {
  if (isAddressEqual(address, CHAIN_CONFIG.addresses.nounsTreasury)) {
    // Force for Nouns treasury
    return {
      name: "The Nouns Treasury",
      imageSrc: "/nouns-treasury.png",
    };
  } else {
    const [name, avatar] = await Promise.all([getNnsOrEnsNameForAddress(address), getEnsAvatarForAddress(address)]);

    const user = {
      name: name ?? formatAddress(address),
      imageSrc: avatar,
    };

    return user;
  }
}
