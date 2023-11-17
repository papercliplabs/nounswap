import { NounSeed } from "@nouns/assets/dist/types";
import { Address } from "viem";
import { ProposalStatus } from "@/data/__generated__/graphql";

export interface Noun {
    id: number;
    owner: Address;
    seed: NounSeed;
    imageSrc: string;
}

export interface SwapNounProposal {
    id: number;
    fromNoun: Noun;
    toNoun: Noun;
    status: ProposalStatus;
}
