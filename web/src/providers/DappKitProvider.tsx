"use client";
import { ReactNode } from "react";
import { DappKitProvider as _DappKitProvider } from "@paperclip-labs/dapp-kit";

export default function DappKitProvider({ children }: { children: ReactNode }) {
  return <_DappKitProvider apiUrl="/api/dapp-kit">{children}</_DappKitProvider>;
}
