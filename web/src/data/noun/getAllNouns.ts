import { CHAIN_CONFIG } from "@/utils/config";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { readContract } from "viem/actions";
import { nounsTokenConfig } from "../generated/wagmi";
import { unstable_cache } from "next/cache";
import { getNounById } from "./getNounById";

export async function getAllNouns() {
  const totalSupply = await unstable_cache(
    async () =>
      (await readContract(CHAIN_CONFIG.publicClient, { ...nounsTokenConfig, functionName: "totalSupply" })).toString(),
    ["total-supply"],
    { revalidate: SECONDS_PER_DAY / 2 }
  )();

  const nouns = await Promise.all(
    Array(Number(totalSupply))
      .fill(0)
      .map((id) => getNounById(id))
  );

  return nouns;
}
