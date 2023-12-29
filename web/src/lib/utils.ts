import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getShortAddress(address: Address) {
    return address.slice(0, 6) + "..." + address.slice(address.length - 4);
}

export function getLinearGradientForAddress(address: Address) {
    const addr = address.slice(2, 10);
    const seed = parseInt(addr, 16);
    const number = Math.ceil(seed % 0xffffff);
    return `linear-gradient(45deg, #${number.toString(16).padStart(6, "0")}, #FFFFFF)`;
}
