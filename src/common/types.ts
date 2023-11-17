import { NounSeed } from "@nouns/assets/dist/types";
import { Address } from "viem";
import { ProposalStatus } from "@/data/__generated__/graphql";

export interface Noun {
    id: number;
    owner: Address;
    seed: NounSeed;
    imageSrc: string;
}

// Need our own to add success and failed, extends ProposalStatus
export enum ProposalState {
    Active = "ACTIVE",
    Cancelled = "CANCELED",
    Executed = "EXECUTED",
    Pending = "PENDING",
    Queued = "QUEUED",
    Vetoed = "VETOED",
    Succeeded = "SUCCEEDED",
    Defeated = "DEFEATED",
}

export interface SwapNounProposal {
    id: number;
    fromNoun: Noun;
    toNoun: Noun;
    state: ProposalState;
}
