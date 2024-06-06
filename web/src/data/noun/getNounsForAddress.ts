"use server";
import { Address, isAddressEqual } from "viem";
import { Noun } from "./types";
import { getAllNouns } from "./getAllNouns";

export async function getNounsForAddress(address: Address): Promise<Noun[]> {
  const allNouns = await getAllNouns();
  const nounsForAddress = allNouns.filter((noun) => isAddressEqual(noun.owner, address));

  return nounsForAddress;
}
