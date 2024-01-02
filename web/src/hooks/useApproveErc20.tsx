"use client";
import { useMemo } from "react";
import { Address, TransactionRequest, encodeFunctionData, zeroAddress } from "viem";
import { useAccount, useContractRead } from "wagmi";
import useSendTransaction, { UseSendTransactionReturnType } from "./useSendTransaction";
import { erc20TokenAbi } from "../abis/erc20Token";

interface UseApproveErc20Params {
    chainId?: number;
    tokenAddress?: Address;
    spender?: Address;
    amount?: bigint;
    onReject?: () => void;
}

interface UseApproveErc20ReturnType extends UseSendTransactionReturnType {
    insufficientBalance: boolean;
    requiresApproval: boolean;
}

export default function useApproveErc20({
    chainId,
    tokenAddress,
    spender,
    amount,
    onReject,
}: UseApproveErc20Params): UseApproveErc20ReturnType {
    const { address } = useAccount();

    const { data: balance } = useContractRead({
        address: tokenAddress,
        abi: erc20TokenAbi,
        functionName: "balanceOf",
        args: [address ?? zeroAddress],
        enabled: address != undefined,
        chainId: chainId,
    });

    const { data: allowance, refetch: refetchAllowance } = useContractRead({
        address: tokenAddress,
        abi: erc20TokenAbi,
        functionName: "allowance",
        args: [address ?? zeroAddress, spender ?? zeroAddress],
        enabled: address != undefined && spender != undefined,
        chainId: chainId,
    });

    const request = useMemo(() => {
        let request: TransactionRequest | undefined = undefined;

        if (
            allowance != undefined &&
            amount != undefined &&
            balance != undefined &&
            spender &&
            address &&
            allowance < amount && // Requires
            balance >= amount // Enough balance
        ) {
            const calldata = encodeFunctionData({
                abi: erc20TokenAbi,
                functionName: "approve",
                args: [spender, amount],
            });
            request = {
                to: tokenAddress,
                from: address,
                data: calldata,
            };
        }

        return request;
    }, [allowance, balance, tokenAddress, spender, amount, address]);

    const sendTxnData = useSendTransaction({
        request,
        chainId: chainId,
        successMsg: `Approved!`,
        onSuccess: () => refetchAllowance(),
        onReject,
    });

    return {
        insufficientBalance: balance != undefined && amount != undefined ? balance < amount : true,
        requiresApproval: allowance != undefined && amount != undefined ? amount > allowance : true,
        ...sendTxnData,
    };
}
