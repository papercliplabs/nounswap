"use client";
import { getNounSwapProposalsForDelegate } from "../data/getNounSwapProposalsForDelegate";
import { Address } from "viem";
import { SwapNounProposal } from "../common/types";
import useSWR from "swr";

// For client side fetching using server action
export default function useNounSwapProposalsForDelegate(address?: Address): SwapNounProposal[] {
    const { data, error, isLoading } = useSWR(
        `useNounSwapProposalsForDelegate/${address}`,
        () => getNounSwapProposalsForDelegate(address),
        { suspense: true }
    );

    return data;
}
