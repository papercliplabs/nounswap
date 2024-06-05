"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseError, Hash, InsufficientFundsError, TransactionReceipt, UserRejectedRequestError } from "viem";
import {
  useAccount,
  useChainId,
  useSendTransaction as useSendTransactionWagmi,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SendTransactionErrorType, WaitForTransactionReceiptErrorType } from "wagmi/actions";
import { CustomTransactionValidationError, MinimalTransactionRequest, TransactionState } from "./types";
import useToast from "../useToast";
import { ToastType } from "@/providers/toast";
import { CHAIN_CONFIG } from "@/config";

export type CustomSendTransactionErrorType =
  | CustomTransactionValidationError
  | SendTransactionErrorType
  | WaitForTransactionReceiptErrorType;

export interface UseSendTransactionReturnType {
  state: TransactionState;
  error: { raw: CustomSendTransactionErrorType; message: string } | null;

  hash?: Hash;
  receipt?: TransactionReceipt;

  sendTransaction: (
    request: MinimalTransactionRequest,
    validationFn?: () => Promise<CustomTransactionValidationError | null>
  ) => void;
  reset: () => void;
}

export function useSendTransaction(): UseSendTransactionReturnType {
  const { address: accountAddress } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();

  const [_, setPendingToastId] = useState<number | undefined>(undefined);
  const { addToast, removeToast } = useToast();

  const [validationError, setValidationError] = useState<CustomTransactionValidationError | null>(null);

  const {
    data: hash,
    sendTransaction: sendTransactionWagmi,
    reset: resetSendTransaction,
    error: sendTransactionError,
    isPending: pendingSignature,
  } = useSendTransactionWagmi();

  const {
    data: receipt,
    isLoading: txnPending,
    isSuccess: txnSuccess,
    isError: txnFailed,
    error: waitForReceiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const sendTransaction = useCallback(
    async (
      request: MinimalTransactionRequest,
      validationFn?: () => Promise<CustomTransactionValidationError | null>
    ) => {
      if (!accountAddress) {
        openConnectModal?.();
      } else {
        if (chainId != CHAIN_CONFIG.chain.id) {
          await switchChainAsync({ chainId: CHAIN_CONFIG.chain.id });
        }

        const validationError = await validationFn?.();
        setValidationError(validationError ?? null);

        if (!validationError) {
          sendTransactionWagmi({ chainId: CHAIN_CONFIG.chain.id, ...request });
        }
      }
    },
    [accountAddress, chainId, sendTransactionWagmi, setValidationError, openConnectModal, switchChainAsync]
  );

  function reset() {
    setValidationError(null);
    resetSendTransaction();
  }

  const error = useMemo(
    () => parseError(validationError, sendTransactionError, waitForReceiptError),
    [validationError, sendTransactionError, waitForReceiptError]
  );

  const state = useMemo(() => {
    if (pendingSignature) {
      return "pending-signature";
    } else if (txnPending) {
      return "pending-txn";
    } else if (txnFailed) {
      return "failed";
    } else if (txnSuccess) {
      return "success";
    } else {
      return "idle";
    }
  }, [pendingSignature, txnPending, txnFailed, txnSuccess]);

  // Handle toasts
  useEffect(() => {
    let pendingToastId: number | undefined = undefined;

    switch (state) {
      case "pending-txn":
        pendingToastId = addToast({
          content: "Txn pending",
          type: ToastType.Pending,
        });
        break;
      case "failed":
        addToast({
          content: "Txn failed",
          type: ToastType.Failure,
        });
        break;
      case "success":
        addToast({
          content: "Txn success",
          type: ToastType.Success,
        });
        break;
    }

    setPendingToastId((currentId) => {
      if (currentId != undefined) {
        removeToast(currentId);
      }

      return pendingToastId;
    });
  }, [state, addToast, removeToast, setPendingToastId]);

  return { state, error, hash, receipt, sendTransaction, reset };
}

function parseError(
  validationError: CustomTransactionValidationError | null,
  sendTransactionError: SendTransactionErrorType | null,
  waitForReceiptError: WaitForTransactionReceiptErrorType | null
) {
  if (validationError) {
    return {
      raw: validationError,
      message: validationError.message,
    };
  } else if (sendTransactionError) {
    if (sendTransactionError instanceof BaseError) {
      if (sendTransactionError.walk((e) => e instanceof InsufficientFundsError)) {
        return { raw: sendTransactionError, message: "Wallet has insufficient balance." };
      } else if (
        sendTransactionError.walk((e) => e instanceof UserRejectedRequestError) ||
        sendTransactionError.details?.includes("User rejected")
      ) {
        return { raw: sendTransactionError, message: "User rejected transaction request." };
      } else {
        console.log(sendTransactionError.message, sendTransactionError.shortMessage);
        return { raw: sendTransactionError, message: sendTransactionError.shortMessage ?? "Unknown error occured." };
      }
    } else {
      return { raw: sendTransactionError, message: "Unknown error occured." };
    }
  } else if (waitForReceiptError) {
    return { raw: waitForReceiptError, message: "Error waiting for transaction receipt." };
  } else {
    return null;
  }
}
