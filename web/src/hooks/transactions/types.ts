import { Address, Hex } from "viem";

export interface MinimalTransactionRequest {
  to: Address;
  data: Hex;
  value: bigint;
}

export class CustomTransactionValidationError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export type TransactionState = "idle" | "pending-signature" | "pending-txn" | "success" | "failed";
