import { NOUNS_TOKEN_ADDRESS } from "@/common/constants";
import { useMemo } from "react";
import { Address, TransactionRequest, encodeFunctionData, getContract } from "viem";
import { useAccount, useContractRead, usePrepareContractWrite, usePublicClient } from "wagmi";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { nounsTokenAbi } from "@/abis/nounsToken";

interface UseApproveNounParams {
    id?: number;
    spender?: Address;
    onReject?: () => void;
}

interface UseApproveNounReturnType extends UseSendTransactionReturnType {
    requiresApproval: boolean;
}

export default function useApproveNoun({ id, spender, onReject }: UseApproveNounParams): UseApproveNounReturnType {
    const { address } = useAccount();

    const { data: currentApprovalAddress, refetch: refetchGetApproved } = useContractRead({
        address: NOUNS_TOKEN_ADDRESS,
        abi: nounsTokenAbi,
        functionName: "getApproved",
        args: [id != undefined ? BigInt(id) : BigInt(0)],
        enabled: id != undefined,
    });

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (id != undefined && spender && address) {
            const calldata = encodeFunctionData({
                abi: nounsTokenAbi,
                functionName: "approve",
                args: [spender, id != undefined ? BigInt(id) : BigInt(0)],
            });
            request = {
                to: NOUNS_TOKEN_ADDRESS,
                from: address,
                data: calldata,
            };
        }

        return request;
    }, [id, spender, address]);

    const sendTxnData = useSendTransaction({ request, onSuccess: () => refetchGetApproved(), onReject });

    return { requiresApproval: currentApprovalAddress != spender, ...sendTxnData };
}
