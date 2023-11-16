import { NounSeed } from "@nouns/assets/dist/types";
import { Address } from "viem";
import { ProposalStatus } from "../../.graphclient";

export interface Noun {
    id: number;
    owner: Address;
    seed: NounSeed;
    imageSrc: string;
}

export interface Proposal {
    id: number;
    title: string;
    description: string;
    status: ProposalStatus;
}
