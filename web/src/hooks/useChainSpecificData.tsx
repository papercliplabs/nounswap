"use client";

import { useMemo } from "react";
import getChainSpecificData from "../lib/chainSpecificData";

export default function useChainSpecificData(chainId?: number) {
    return useMemo(() => getChainSpecificData(chainId), [chainId]);
}
