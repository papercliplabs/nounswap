import { Address, BaseError, InsufficientFundsError, UserRejectedRequestError } from "viem";
import { SendTransactionErrorType } from "wagmi/actions";
import { Unit } from "./types";

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

export function capitalizeFirstLetterOfEveryWord(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

type FormatNumberParams = {
  input: number | bigint;
  compact?: boolean;
  maxFractionDigits?: number;
  maxSignificantDigits?: number;
  forceSign?: boolean;
  percent?: boolean;
  unit?: "USD" | string;
};

export function formatNumber({
  input,
  compact,
  maxFractionDigits,
  maxSignificantDigits,
  forceSign,
  percent,
  unit,
}: FormatNumberParams): string {
  const prefix = unit ? (unit == "USD" ? "$" : unit == "Ξ" ? "Ξ" : "") : "";
  const postfix = unit ? (unit != "USD" && unit != "Ξ" ? ` ${unit}` : "") : "";
  const formattedNumber = Intl.NumberFormat("en", {
    notation: (input > 9999 || input < -9999) && compact ? "compact" : "standard",
    maximumFractionDigits: maxFractionDigits ?? 2,
    maximumSignificantDigits: maxSignificantDigits,
    style: percent ? "percent" : "decimal",
    signDisplay: forceSign ? "exceptZero" : "auto",
  }).format(input);
  return (input < 0 ? "-" : "") + prefix + formattedNumber.replace("-", "") + postfix;
}
