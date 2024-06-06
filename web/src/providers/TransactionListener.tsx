"use client";
import { CHAIN_CONFIG } from "@/config";
import { createContext, useCallback, useContext, useState } from "react";
import { Hex } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { ToastContext, ToastType } from "./toast";
import { track } from "@vercel/analytics";

export interface Transaction {
  hash: Hex;
  status: "pending" | "success" | "reverted";
}

interface TransactionListenerContextType {
  transactions: Transaction[];
  addTransaction?: (hash: Hex) => void;
}

export const TransactionListenerContext = createContext<TransactionListenerContextType>({
  transactions: [],
  addTransaction: undefined,
});

export function TransactionListenerProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { addToast, removeToast } = useContext(ToastContext);

  const addTransaction = useCallback(
    async (hash: Hex) => {
      setTransactions((transactions) => [...transactions, { hash, status: "pending" }]);
      const pendingToastId = addToast?.({
        content: "Transaction Pending",
        type: ToastType.Pending,
      });
      track("txn-pending", { hash: hash.toString() });

      const receipt = await waitForTransactionReceipt(CHAIN_CONFIG.publicClient, { hash });
      if (pendingToastId != undefined) {
        removeToast?.(pendingToastId);
      }

      const status = receipt.status;
      setTransactions((transactions) => {
        return [...transactions.filter((txn) => txn.hash != hash), { hash, status: status }];
      });

      addToast?.({
        content: `Transaction ${status == "success" ? "Successful" : "Failed"}`,
        type: status == "success" ? ToastType.Success : ToastType.Failure,
      });

      track(`txn-${status}`, { hash: hash.toString() });
    },
    [setTransactions, addToast, removeToast]
  );

  return (
    <TransactionListenerContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionListenerContext.Provider>
  );
}
