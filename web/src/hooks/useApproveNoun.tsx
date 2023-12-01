"use client";
import { useMemo } from "react";
import { Address, TransactionRequest, encodeFunctionData } from "viem";
import { useAccount, useContractRead } from "wagmi";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { nounsTokenAbi } from "../abis/nounsToken";
import useChainSpecificData from "./useChainSpecificData";
import { Noun } from "../common/types";

interface UseApproveNounParams {
    noun?: Noun;
    spender?: Address;
    onReject?: () => void;
}

interface UseApproveNounReturnType extends UseSendTransactionReturnType {
    requiresApproval: boolean;
}

export default function useApproveNoun({ noun, spender, onReject }: UseApproveNounParams): UseApproveNounReturnType {
    const { address } = useAccount();
    const chainSpecificData = useChainSpecificData(noun?.chainId);

    const { data: currentApprovalAddress, refetch: refetchGetApproved } = useContractRead({
        address: chainSpecificData.nounsTokenAddress,
        abi: nounsTokenAbi,
        functionName: "getApproved",
        args: [noun != undefined ? BigInt(noun.id) : BigInt(0)],
        enabled: noun != undefined,
        chainId: noun?.chainId,
    });

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (noun != undefined && spender && address) {
            const calldata = encodeFunctionData({
                abi: nounsTokenAbi,
                functionName: "approve",
                args: [spender, noun != undefined ? BigInt(noun.id) : BigInt(0)],
            });
            request = {
                to: chainSpecificData.nounsTokenAddress,
                from: address,
                data: calldata,
            };
        }

        return request;
    }, [noun, spender, address, chainSpecificData]);

    const sendTxnData = useSendTransaction({
        request,
        chainId: noun?.chainId,
        successMsg: `Noun ${noun?.id} approved!`,
        onSuccess: () => refetchGetApproved(),
        onReject,
    });

    return { requiresApproval: currentApprovalAddress != spender, ...sendTxnData };
}
