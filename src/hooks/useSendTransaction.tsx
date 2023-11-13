import { useMemo } from "react";
import { TransactionReceipt, TransactionRequest } from "viem";
import { Hash } from "viem";
import {
    useFeeData,
    usePrepareSendTransaction,
    useSendTransaction as useWagmiSendTransaction,
    useWaitForTransaction,
} from "wagmi";

interface UseSendTransactionParams {
    request?: TransactionRequest;
    onSuccess?: () => void;
    onReject?: () => void;
}

export enum SendTransactionState {
    Idle = "idle",
    PendingWalletSignature = "pendingWalletSignature",
    Rejected = "rejected",
    PendingTransaction = "pendingTransaction",
    Failed = "failed",
    Success = "success",
}

export interface UseSendTransactionReturnType {
    state: SendTransactionState;
    estimatedFeeEth?: bigint;
    hash?: Hash;
    receipt?: TransactionReceipt;
    send?: () => void;
    reset: () => void;
}

export default function useSendTransaction({
    request,
    onSuccess,
    onReject,
}: UseSendTransactionParams): UseSendTransactionReturnType {
    // const { data: feeData } = useFeeData();

    const { config } = usePrepareSendTransaction({
        to: request?.to ?? undefined,
        data: request?.data,
        enabled: request != undefined,
        // maxFeePerGas: feeData?.maxFeePerGas ?? undefined,
    });

    const {
        data: sendData,
        isLoading: pendingWalletSignature,
        sendTransactionAsync,
        reset,
        isError: rejected,
    } = useWagmiSendTransaction({
        ...config,
        onError: (e) => {
            console.error("SEND ERROR: ", e);
            onReject?.();
        },
    });

    const {
        data: receipt,
        isLoading: pendingTransaction,
        isSuccess: success,
        isError: failed,
    } = useWaitForTransaction({
        hash: sendData?.hash,
        confirmations: 2,
        onSettled: (data, error) => {
            console.log("Transaction settled", { data, error });
        },
        onSuccess: () => onSuccess?.(),
    });

    const state = useMemo(() => {
        if (pendingWalletSignature) {
            return SendTransactionState.PendingWalletSignature;
        } else if (rejected) {
            return SendTransactionState.Rejected;
        } else if (pendingTransaction) {
            return SendTransactionState.PendingTransaction;
        } else if (failed) {
            return SendTransactionState.Failed;
        } else if (success) {
            return SendTransactionState.Success;
        } else {
            return SendTransactionState.Idle;
        }
    }, [pendingWalletSignature, pendingTransaction, failed, success, rejected]);

    return {
        state,
        estimatedFeeEth: config && config.maxFeePerGas && config.gas ? config.maxFeePerGas * config.gas : undefined,
        hash: sendData?.hash,
        receipt,
        send: sendTransactionAsync ? () => sendTransactionAsync() : undefined,
        reset,
    };
}
