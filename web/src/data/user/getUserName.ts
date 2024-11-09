"use server";
import { Address } from "viem";
import { CHAIN_CONFIG } from "@/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_WEEK } from "@/utils/constants";
import { HARDCODED_USERS, IDENTITY_CONFIG, IDENTITY_RESOLVERS } from "./constants";
import { getName } from "@paperclip-labs/dapp-kit/identity/api";

async function getUserNameUncached(address: Address): Promise<string> {
  const hardcodedUser = HARDCODED_USERS[address];

  if (hardcodedUser) {
    return hardcodedUser.name;
  }

  return (
    await getName({
      address,
      resolvers: IDENTITY_RESOLVERS,
      config: IDENTITY_CONFIG,
    })
  ).value;
}

export const getUserName = unstable_cache(getUserNameUncached, ["get-user-name", CHAIN_CONFIG.chain.id.toString()], {
  revalidate: SECONDS_PER_WEEK,
});
