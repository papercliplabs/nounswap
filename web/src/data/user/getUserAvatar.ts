"use server";
import { Address } from "viem";
import { getEnsName, getEnsAvatar } from "viem/actions";
import { CHAIN_CONFIG, mainnetPublicClient } from "@/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_WEEK } from "@/utils/constants";
import { normalize } from "viem/ens";
import { HARDCODED_USERS } from "./constants";

async function getEnsNameForAddressUncached(address: Address): Promise<string | null> {
  const ensName = await getEnsName(mainnetPublicClient, { address });
  return ensName;
}

async function getUserAvatarUncached(address: Address): Promise<string | null> {
  const hardcodedUser = HARDCODED_USERS[address];

  if (hardcodedUser) {
    return hardcodedUser.imageSrc;
  }

  try {
    const ensName = await getEnsNameForAddressUncached(address);

    if (ensName) {
      const avatar = await getEnsAvatar(mainnetPublicClient, { name: normalize(ensName) });
      return avatar;
    } else {
      return null;
    }
  } catch (e) {
    console.error("getUserAvatarUncached error", e);
    return null;
  }
}

export const getUserAvatar = unstable_cache(
  getUserAvatarUncached,
  ["get-user-avatar", CHAIN_CONFIG.chain.id.toString()],
  {
    revalidate: SECONDS_PER_WEEK,
  }
);
