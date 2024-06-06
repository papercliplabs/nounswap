"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useContext, useMemo, useState } from "react";
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
import { CHAIN_CONFIG } from "@/config";
import { TransactionListenerContext } from "@/providers/TransactionListener";

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

  const { addTransaction } = useContext(TransactionListenerContext);

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
          try {
            const hash = await sendTransactionWagmi({ chainId: CHAIN_CONFIG.chain.id, ...request });
            addTransaction?.(hash);
          } catch (e) {
            // Ignore, we handle this below
          }
        }
      }
    },
    [
      accountAddress,
      chainId,
      sendTransactionWagmi,
      setValidationError,
      openConnectModal,
      switchChainAsync,
      addTransaction,
    ]
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
