"use client";
import { ToastProvider } from "./toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalletProvider from "./WalletProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <TooltipProvider>
        <ToastProvider>{children}</ToastProvider>
      </TooltipProvider>
    </WalletProvider>
  );
}
