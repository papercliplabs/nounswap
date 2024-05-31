"use server";
import { Address } from "viem";
import { getEnsName, getEnsAvatar } from "viem/actions";
import { CHAIN_CONFIG } from "@/utils/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { normalize } from "viem/ens";

async function getEnsNameForAddressUncached(address: Address): Promise<string | null> {
  const ensName = await getEnsName(CHAIN_CONFIG.publicClient, { address });
  return ensName;
}

async function getEnsAvatarForAddressUncached(address: Address): Promise<string | null> {
  const ensName = await getEnsNameForAddressUncached(address);
  if (ensName) {
    return await getEnsAvatar(CHAIN_CONFIG.publicClient, { name: normalize(ensName) });
  } else {
    return null;
  }
}

export const getEnsAvatarForAddress = unstable_cache(getEnsAvatarForAddressUncached, ["get-ens-avatar-by-address"], {
  revalidate: SECONDS_PER_DAY,
});
