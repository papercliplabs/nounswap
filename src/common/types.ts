import { NounSeed } from "@nouns/assets/dist/types";
import { Address } from "viem";

export interface Noun {
    id: number;
    owner: Address;
    seed: NounSeed;
    imageSrc: string;
}
