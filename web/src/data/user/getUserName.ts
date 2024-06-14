"use server";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { CHAIN_CONFIG, mainnetPublicClient } from "@/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_WEEK } from "@/utils/constants";
import { nnsEnsResolverAbi } from "@/abis/nnsEnsResolver";
import { NNS_ENS_MAINNET_RESOLVER_ADDRESS } from "@/utils/constants";
import { HARDCODED_USERS } from "./constants";
import { formatAddress } from "@/utils/format";

async function getUserNameUncached(address: Address): Promise<string> {
  const hardcodedUser = HARDCODED_USERS[address];

  if (hardcodedUser) {
    return hardcodedUser.name;
  }

  try {
    const name = await readContract(mainnetPublicClient, {
      abi: nnsEnsResolverAbi,
      address: NNS_ENS_MAINNET_RESOLVER_ADDRESS,
      functionName: "resolve",
      args: [address],
    });

    return name != "" ? name : formatAddress(address);
  } catch (e) {
    console.error("getUserNameUncached error", e);
    return formatAddress(address);
  }
}

export const getUserName = unstable_cache(getUserNameUncached, ["get-user-name", CHAIN_CONFIG.chain.id.toString()], {
  revalidate: SECONDS_PER_WEEK,
});
