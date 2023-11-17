"use client";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { useMemo } from "react";
import {
    TransactionRequest,
    decodeEventLog,
    encodeAbiParameters,
    encodeFunctionData,
    getFunctionSignature,
} from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { nounsDoaLogicAbi } from "@/abis/nounsDoaLogic";
import { nounsTokenAbi } from "@/abis/nounsToken";
import { Noun } from "@/common/types";
import { NOUNS_DOA_PROXY, NOUNS_TOKEN_ADDRESS, NOUNS_TREASURY_ADDRESS } from "@/common/constants";

interface UseCreateSwapPropParams {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    onReject?: () => void;
}

interface UseCreateSwapPropReturnType extends UseSendTransactionReturnType {
    propNumber?: number;
}

export function useCreateSwapProp({
    userNoun,
    treasuryNoun,
    onReject,
}: UseCreateSwapPropParams): UseCreateSwapPropReturnType {
    const { address } = useAccount();
    const publicClient = usePublicClient();

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (userNoun != undefined && treasuryNoun != undefined && address != undefined && publicClient != undefined) {
            const transferFromAbi = nounsTokenAbi.find((entry) => entry.name == "transferFrom")!; // Must exist
            const safeTransferFromAbi = nounsTokenAbi.find((entry) => entry.name == "safeTransferFrom")!; // Must exist

            const userNounToTreasuryTransferFromInputData = encodeAbiParameters(
                transferFromAbi.inputs, // from: address, to: address, tokenId: uint256
                [userNoun.owner, NOUNS_TREASURY_ADDRESS, BigInt(userNoun.id)]
            );

            const treasuryNounToUserSafeTransferFromInputData = encodeAbiParameters(
                safeTransferFromAbi.inputs, // from: address, to: address, tokenId: uint256
                [NOUNS_TREASURY_ADDRESS, userNoun.owner, BigInt(treasuryNoun.id)]
            );

            const proposeArgs = [
                [NOUNS_TOKEN_ADDRESS, NOUNS_TOKEN_ADDRESS], // targets
                [BigInt(0), BigInt(0)], // values
                [getFunctionSignature(transferFromAbi), getFunctionSignature(safeTransferFromAbi)], // signatures
                [userNounToTreasuryTransferFromInputData, treasuryNounToUserSafeTransferFromInputData], // calldatas (fn input data, no selector)
                `# NounSwap: Swap Noun ${userNoun.id} for Noun ${treasuryNoun.id} from the Noun Treasury

This proposal seeks to swap Noun ${userNoun.id} for Noun ${treasuryNoun.id} from the Nouns DAO treasury.

## General Rationale for swapping Nouns: 
Noun owners might seek a swap for various reasons, including:
- **Aesthetic Preference**: Seeking a Noun that resonates more with personal artistic tastes or visual preferences.
- **Trait Alignment**: Aiming to align with Nouns that reflect specific traits or characteristics resonating with the owner's personality, interests, or collection strategy.
- **Community Engagement**: Enhancing personal connection and engagement with the Nouns DAO community through ownership of a Noun that resonates more strongly on a personal level.


## Benefits of swapping to the DAO:
Swapping Nouns can offer several advantages to the DAO:
- **Community Diversity:** Encourages a treasury that mirrors the diverse tastes and interests of the Nouns community.
- **Active Participation:** Owners who feel a stronger personal connection to their Nouns are often more engaged and active in DAO initiatives.
- **Dynamic Treasury:** Regular swaps keep the treasury dynamic and reflective of current community preferences and trends.


## Conclusion
This proposal aims to enrich both the individual Noun owner's experience and the overall diversity of the Nouns DAO Treasury through a strategic swap, enhancing engagement and more alignment within the community.


## This Prop was created using NounSwap.
NounSwap is a tool built for the Nourish communities by [Paperclip Labs](https://paperclip.xyz/). It allows Noun owners easily create proposals to swap their Nouns for Nouns in the treasury. It serves purely as a facilitation tool for proposal creation. NounSwap does not have contracts and does not take custody of any Nouns at any time. You can check it out at [nounswap.wtf](nounswap.wtf).`,
            ];

            const propCalldata = encodeFunctionData({
                abi: nounsDoaLogicAbi,
                functionName: "propose",
                args: proposeArgs,
            });

            request = {
                to: NOUNS_DOA_PROXY,
                from: address,
                data: propCalldata,
                gas: BigInt(1000000), // Reasonable default incase gas estimate fails...
            };
        }

        return request;
    }, [userNoun, treasuryNoun, address, publicClient]);

    const sendTxnData = useSendTransaction({ request, successMsg: "Swap Prop created!", onReject });

    const propNumber = useMemo(() => {
        const log = sendTxnData.receipt?.logs.find((log) => true); // First event is ProposalCreated
        if (log == undefined) {
            return undefined;
        }

        const event = decodeEventLog({
            abi: nounsDoaLogicAbi,
            eventName: "ProposalCreated",
            data: log.data,
            topics: log.topics,
        });

        return Number((event.args as any)["id"]);
    }, [sendTxnData]);

    return { ...sendTxnData, propNumber };
}
