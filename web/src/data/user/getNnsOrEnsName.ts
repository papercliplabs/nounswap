"use server";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { nnsEnsResolverConfig } from "../generated/wagmi";
import { CHAIN_CONFIG } from "@/utils/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_DAY } from "@/utils/constants";

async function getNnsOrEnsNameForAddressUncached(address: Address): Promise<string | null> {
  const name = await readContract(CHAIN_CONFIG.publicClient, {
    ...nnsEnsResolverConfig,
    functionName: "resolve",
    args: [address],
  });

  return name;
}

export const getNnsOrEnsNameForAddress = unstable_cache(getNnsOrEnsNameForAddressUncached, ["get-nns-or-ens-name"], {
  revalidate: SECONDS_PER_DAY,
});
