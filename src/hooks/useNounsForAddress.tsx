"use client";
import { getNounsForAddress } from "@/data/getNounsForAddress";
import { useEffect, useState } from "react";
import { Noun } from "@/common/types";
import { Address } from "viem";

// For client side fetching using server action
export default function useNounsForAddress(address?: Address): Noun[] | undefined {
    const [nouns, setNouns] = useState<Noun[] | undefined>(undefined);

    useEffect(() => {
        async function getData() {
            if (address != undefined) {
                setNouns(await getNounsForAddress(address));
            } else {
                setNouns(undefined);
            }
        }

        getData();
    }, [address]);

    return nouns;
}
