import { BigIntString } from "@/utils/types";
import { Address } from "viem";

export interface NounTrait {
  seed: number;
  name: string;
  imageSrc: string;
}

export interface Noun {
  id: BigIntString;
  owner: Address;
  traits: {
    background: NounTrait & { color: string };
    body: NounTrait;
    accessory: NounTrait;
    head: NounTrait;
    glasses: NounTrait;
  };
  imageSrc: string;
}
