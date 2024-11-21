"use client";
import { ToastProvider } from "./toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalletProvider from "./WalletProvider";
import { TransactionListenerProvider } from "./TransactionListener";
import DappKitProvider from "./DappKitProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <ToastProvider>
        <TransactionListenerProvider>
          <TooltipProvider>
            <DappKitProvider>{children}</DappKitProvider>
          </TooltipProvider>
        </TransactionListenerProvider>
      </ToastProvider>
    </WalletProvider>
  );
}
