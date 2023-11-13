import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { useMemo } from "react";
import { Address, TransactionRequest, encodeFunctionData, getContract, getFunctionSignature } from "viem";
import { useAccount, useContractRead, usePrepareContractWrite, usePublicClient } from "wagmi";
import { nounsDoaLogicAbi } from "@/abis/nounsDoaLogic";
import { nounsTokenAbi } from "@/abis/nounsToken";
import { Noun } from "@/common/types";
import { NOUNS_DOA_PROXY, NOUNS_TOKEN_ADDRESS, NOUNS_TREASURY_ADDRESS } from "@/common/constants";

interface UseCreateSwapPropParams {
    userNoun?: Noun;
    treasuryNoun?: Noun;
    onReject?: () => void;
}

interface UseCreateSwapPropReturnType extends UseSendTransactionReturnType {}

export function useCreateSwapProp({ userNoun, treasuryNoun, onReject }: UseCreateSwapPropParams) {
    const { address } = useAccount();

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (userNoun != undefined && treasuryNoun != undefined && address != undefined) {
            const signature = getFunctionSignature("safeTransferFrom(address,address,uint256)");

            const userNounToTreasuryCalldata = encodeFunctionData({
                abi: nounsTokenAbi,
                functionName: "safeTransferFrom",
                args: [userNoun.owner, NOUNS_TREASURY_ADDRESS, BigInt(userNoun.id)],
            });

            const treasuryNounToUserCalldata = encodeFunctionData({
                abi: nounsTokenAbi,
                functionName: "safeTransferFrom",
                args: [NOUNS_TREASURY_ADDRESS, userNoun.owner, BigInt(treasuryNoun.id)],
            });

            const proposeArgs = [
                [NOUNS_TOKEN_ADDRESS, NOUNS_TOKEN_ADDRESS], // targets
                [BigInt(0), BigInt(0)], // values
                [signature, signature], // signatures
                [userNounToTreasuryCalldata, treasuryNounToUserCalldata], // calldatas
                `${userNoun.owner} is swapping their noun ${userNoun.id} for the treasury's noun ${treasuryNoun.id}.`, // description
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
            };
        }

        return request;
    }, [userNoun, treasuryNoun, address]);

    const sendTxnData = useSendTransaction({ request, onReject });

    console.log("RECEIPT:", sendTxnData.receipt);

    return sendTxnData;
}
