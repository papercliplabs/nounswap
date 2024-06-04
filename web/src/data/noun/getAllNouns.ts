import { getNounById } from "./getNounById";
import { Noun } from "./types";
import { getCurrentAuction } from "../auction/getCurrentAuction";

export async function getAllNouns(): Promise<Noun[]> {
  // Using auction id since there is a weird bug with Sepolia tokens TotalSupply
  const currentAuction = await getCurrentAuction();
  const totalSupply = currentAuction.nounId;

  const nouns = await Promise.all(
    Array(Number(totalSupply))
      .fill(0)
      .map((_, id) => getNounById(id.toString()))
  );

  // Filter out any undefined
  const nounsFiltered = nouns.filter((noun) => noun !== undefined) as Noun[];

  if (nouns.length !== nounsFiltered.length) {
    console.error(`getNounsForAddress: some nouns not found - ${nouns.length - nounsFiltered.length}`);
  }

  // Sort by id, descending
  nounsFiltered.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));

  return nounsFiltered;
}
