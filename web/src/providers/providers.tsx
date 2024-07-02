"use client";
import { ToastProvider } from "./toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalletProvider from "./WalletProvider";
import { TransactionListenerProvider } from "./TransactionListener";
import { State } from "wagmi";

export default function Providers({ children, initialState }: { children: React.ReactNode; initialState?: State }) {
  return (
    <WalletProvider initialState={initialState}>
      <ToastProvider>
        <TransactionListenerProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TransactionListenerProvider>
      </ToastProvider>
    </WalletProvider>
  );
}
