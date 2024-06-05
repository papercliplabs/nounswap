import { Address, BaseError, InsufficientFundsError, UserRejectedRequestError } from "viem";
import { SendTransactionErrorType } from "wagmi/actions";

export function formatAddress(address: Address, amount: number = 4): string {
  return `${address.slice(0, amount)}...${address?.slice(address.length - amount, address.length)}`;
}

export function formatTimeLeft(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hoursString = hours > 0 ? hours.toString() + "h " : "";
  const minsString = mins > 0 ? mins.toString() + "m " : "";
  const secsString = secs + "s";

  return hoursString + minsString + secsString;
}

export function formatSendTransactionError(error: SendTransactionErrorType | null) {
  if (error === null) return "";

  if (error instanceof BaseError) {
    if (error.walk((e) => e instanceof InsufficientFundsError)) {
      return "Wallet has insufficient balance.";
    } else if (error.walk((e) => e instanceof UserRejectedRequestError) || error.details.includes("User rejected")) {
      return "User rejected transaction request.";
    } else {
      return "Unknown error ocurred";
    }
  } else {
    return "Unknown error ocurred";
  }
}
