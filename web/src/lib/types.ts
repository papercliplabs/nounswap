import { NounSeed } from "@nouns/assets/dist/types";
import { Address } from "viem";

export interface Noun {
    id: number;
    owner: Address;
    seed: NounSeed;
    imageSrc: string;
    chainId: number;
}

// Need our own to add success and failed, extends ProposalStatus (autogen)
export enum ProposalState {
    Active = "ACTIVE",
    Cancelled = "CANCELED",
    Executed = "EXECUTED",
    Pending = "PENDING",
    Queued = "QUEUED",
    Vetoed = "VETOED",
    Succeeded = "SUCCEEDED",
    Defeated = "DEFEATED",
    Candidate = "CANDIDATE",
}

export interface SwapNounProposal {
    id: number | string;
    fromNoun: Noun;
    toNoun: Noun;
    state: ProposalState;
}
