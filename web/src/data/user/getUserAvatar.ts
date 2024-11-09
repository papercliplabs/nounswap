"use server";
import { Address } from "viem";
import { CHAIN_CONFIG } from "@/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_WEEK } from "@/utils/constants";
import { HARDCODED_USERS, IDENTITY_CONFIG, IDENTITY_RESOLVERS } from "./constants";
import { getAvatar } from "@paperclip-labs/dapp-kit/identity/api";

async function getUserAvatarUncached(address: Address): Promise<string | null> {
  const hardcodedUser = HARDCODED_USERS[address];

  if (hardcodedUser) {
    return hardcodedUser.imageSrc;
  }

  return (
    await getAvatar({
      address,
      resolvers: IDENTITY_RESOLVERS,
      config: IDENTITY_CONFIG,
    })
  ).value;
}

export const getUserAvatar = unstable_cache(
  getUserAvatarUncached,
  ["get-user-avatar", CHAIN_CONFIG.chain.id.toString()],
  {
    revalidate: SECONDS_PER_WEEK,
  }
);
