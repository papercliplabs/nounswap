export const nounsDoaLogicAbi = [
    {
        inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
        name: "cancel",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
        name: "execute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "proposalThreshold",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "proposalThresholdBPS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "targets", type: "address[]" },
            { internalType: "uint256[]", name: "values", type: "uint256[]" },
            { internalType: "string[]", name: "signatures", type: "string[]" },
            { internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
            { internalType: "string", name: "description", type: "string" },
        ],
        name: "propose",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
        name: "queue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: false, internalType: "address", name: "proposer", type: "address" },
            { indexed: false, internalType: "address[]", name: "targets", type: "address[]" },
            { indexed: false, internalType: "uint256[]", name: "values", type: "uint256[]" },
            { indexed: false, internalType: "string[]", name: "signatures", type: "string[]" },
            { indexed: false, internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
            { indexed: false, internalType: "uint256", name: "startBlock", type: "uint256" },
            { indexed: false, internalType: "uint256", name: "endBlock", type: "uint256" },
            { indexed: false, internalType: "string", name: "description", type: "string" },
        ],
        name: "ProposalCreated",
        type: "event",
    },
] as const;
