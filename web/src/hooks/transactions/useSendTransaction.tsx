"use client";
import { useCallback, useContext, useMemo, useState } from "react";
import { BaseError, Hash, InsufficientFundsError, TransactionReceipt, UserRejectedRequestError } from "viem";
import { useAccount, useSendTransaction as useSendTransactionWagmi, useWaitForTransactionReceipt } from "wagmi";
import { SendTransactionErrorType, WaitForTransactionReceiptErrorType } from "wagmi/actions";
import {
  CustomTransactionValidationError,
  MinimalTransactionRequest,
  TransactionState,
  TransactionType,
} from "./types";
import { CHAIN_CONFIG } from "@/config";
import { TransactionListenerContext } from "@/providers/TransactionListener";
import { estimateGas } from "viem/actions";
import { useSwitchChainCustom } from "../useSwitchChainCustom";
import { useModal } from "connectkit";

const GAS_BUFFER = 0.2; // Gives buffer on gas estimate to help prevent out of gas error

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
    logging: { type: TransactionType; description: string },
    validationFn?: () => Promise<CustomTransactionValidationError | null>
  ) => void;
  reset: () => void;
}

export function useSendTransaction(): UseSendTransactionReturnType {
  const { address: accountAddress } = useAccount();
  const { addTransaction } = useContext(TransactionListenerContext);
  const { switchChain } = useSwitchChainCustom();
  const { setOpen: setConnectModalOpen } = useModal();

  const [validationError, setValidationError] = useState<CustomTransactionValidationError | null>(null);

  const {
    data: hash,
    sendTransactionAsync: sendTransactionWagmi,
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
    timeout: 1000 * 60 * 5, // 5min...
  });

  const sendTransaction = useCallback(
    async (
      request: MinimalTransactionRequest,
      logging: { type: TransactionType; description: string },
      validationFn?: () => Promise<CustomTransactionValidationError | null>
    ) => {
      if (!accountAddress) {
        setConnectModalOpen(true);
      } else {
        // Call all the time
        const correctChain = await switchChain({ chainId: CHAIN_CONFIG.chain.id });
        if (!correctChain) return;

        const validationError = await validationFn?.();
        setValidationError(validationError ?? null);

        if (!validationError) {
          let gasEstimateWithBuffer;
          try {
            const gasEstimate = await estimateGas(CHAIN_CONFIG.publicClient, request);
            gasEstimateWithBuffer = (gasEstimate * BigInt((1 + GAS_BUFFER) * 1000)) / BigInt(1000);
          } catch (e) {
            console.error("Error estimating gas, using default", e);
            gasEstimateWithBuffer = request.gasFallback; // Use fallback when gas estimation fails
          }

          try {
            const hash = await sendTransactionWagmi({
              chainId: CHAIN_CONFIG.chain.id,
              gas: gasEstimateWithBuffer,
              ...request,
            });
            addTransaction?.(hash, logging);
          } catch (e) {
            // Ignore, we handle this below
          }
        }
      }
    },
    [accountAddress, sendTransactionWagmi, setValidationError, setConnectModalOpen, switchChain, addTransaction]
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
        console.log(
          `Unknown send txn error: ${sendTransactionError.name} -  ${sendTransactionError.shortMessage} - ${sendTransactionError.message} - ${sendTransactionError.cause}`
        );
        return { raw: sendTransactionError, message: "Unknown error occurred, try again." };
      }
    } else {
      console.log(
        `Unknown send txn error: ${sendTransactionError.name} - ${sendTransactionError.message} - ${sendTransactionError.cause}`
      );
      return { raw: sendTransactionError, message: "Unknown error occurred, try again.." };
    }
  } else if (waitForReceiptError) {
    return { raw: waitForReceiptError, message: "Error waiting for transaction receipt." };
  } else {
    return null;
  }
}
