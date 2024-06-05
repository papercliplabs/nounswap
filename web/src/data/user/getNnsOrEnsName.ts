"use server";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/config";
import { unstable_cache } from "next/cache";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { nnsEnsResolverAbi } from "@/abis/nnsEnsResolver";
import { NNS_ENS_MAINNET_RESOLVER_ADDRESS } from "@/utils/constants";

async function getNnsOrEnsNameForAddressUncached(address: Address): Promise<string | null> {
  try {
    const name = await readContract(mainnetPublicClient, {
      abi: nnsEnsResolverAbi,
      address: NNS_ENS_MAINNET_RESOLVER_ADDRESS,
      functionName: "resolve",
      args: [address],
    });

    return name != "" ? name : null;
  } catch (e) {
    console.error("getNnsOrEnsNameForAddressUncached error", e);
    return null;
  }
}

export const getNnsOrEnsNameForAddress = unstable_cache(getNnsOrEnsNameForAddressUncached, ["get-nns-or-ens-name"], {
  revalidate: SECONDS_PER_DAY,
});
