"use client";
import { ToastProvider } from "./toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalletProvider from "./WalletProvider";
import { TransactionListenerProvider } from "./TransactionListener";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <ToastProvider>
        <TransactionListenerProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TransactionListenerProvider>
      </ToastProvider>
    </WalletProvider>
  );
}
