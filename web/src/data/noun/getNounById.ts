"use server";
import { Noun } from "./types";
import { getAllNouns } from "./getAllNouns";

export async function getNounById(id: string): Promise<Noun | undefined> {
  const allNouns = await getAllNouns();

  const noun = allNouns.find((noun) => noun.id === id);
  return noun;
}
