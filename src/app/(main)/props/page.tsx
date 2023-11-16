"use client";
import { useAccount, Address } from "wagmi";
import { Proposal } from "@/common/types";
import { useEffect, useState } from "react";
import { getBuiltGraphSDK } from "../../../../.graphclient";

async function getNounSwapProposalsForDelegate(address: Address): Promise<Proposal[]> {
    const graphSdk = getBuiltGraphSDK();
    const queryResult = await graphSdk.NounSwapProposalsForDelegate({ id: address.toString().toLowerCase() });

    if (queryResult.delegate) {
        const data = queryResult.delegate;

        return data.proposals.map((proposal) => {
            return {
                id: Number(proposal.id),
                title: proposal.title,
                description: proposal.description,
                status: proposal.status,
            } as Proposal;
        });
    } else {
        console.log(`getNounSwapProposalsForDelegate: no proposals found - ${address}`);
        return [];
    }
}

export default function Props() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const { address } = useAccount();

    useEffect(() => {
        async function fetchProps() {
            if (address) {
                const props = await getNounSwapProposalsForDelegate(address);
                setProposals(props);
            }
        }

        fetchProps();
    }, [address, setProposals]);

    return (
        <div className="flex flex-col justify-start items-start w-full max-w-4xl self-center">
            <h1>My Props</h1>
            <span>All of your Swap Props created with NounSwap</span>

            <div className="flex flex-col gap-4 w-full pt-10">
                {proposals.map((proposal, i) => (
                    <div className="flex flex-row w-full border-2 border-gray-400 p-8 rounded-2xl" key={i}>
                        ID: {proposal.id}, STATUS: {proposal.status}
                    </div>
                ))}
            </div>
        </div>
    );
}
