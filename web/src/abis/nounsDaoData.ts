export const nounsDaoDataAbi = [
    {
        inputs: [
            {
                internalType: "address[]",
                name: "targets",
                type: "address[]",
            },
            {
                internalType: "uint256[]",
                name: "values",
                type: "uint256[]",
            },
            {
                internalType: "string[]",
                name: "signatures",
                type: "string[]",
            },
            {
                internalType: "bytes[]",
                name: "calldatas",
                type: "bytes[]",
            },
            {
                internalType: "string",
                name: "description",
                type: "string",
            },
            {
                internalType: "string",
                name: "slug",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "proposalIdToUpdate",
                type: "uint256",
            },
        ],
        name: "createProposalCandidate",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
] as const;
