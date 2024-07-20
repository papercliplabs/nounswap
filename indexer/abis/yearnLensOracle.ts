export const yearnLensOracleAbi = [
  {
    inputs: [
      { internalType: "address", name: "_managementListAddress", type: "address" },
      { internalType: "address", name: "_usdcAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "tokenAddress", type: "address" },
      { indexed: false, internalType: "address", name: "tokenAliasAddress", type: "address" },
    ],
    name: "TokenAliasAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "tokenAddress", type: "address" }],
    name: "TokenAliasRemoved",
    type: "event",
  },
  { stateMutability: "nonpayable", type: "fallback" },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "address", name: "tokenAliasAddress", type: "address" },
    ],
    name: "addTokenAlias",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "address", name: "tokenAliasAddress", type: "address" },
        ],
        internalType: "struct Oracle.TokenAlias[]",
        name: "_tokenAliases",
        type: "tuple[]",
      },
    ],
    name: "addTokenAliases",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "calculations",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "getNormalizedValueUsdc",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "priceUsdc", type: "uint256" },
    ],
    name: "getNormalizedValueUsdc",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "tokenAddress", type: "address" }],
    name: "getPriceUsdcRecommended",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "managementList",
    outputs: [{ internalType: "contract ManagementList", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "tokenAddress", type: "address" }],
    name: "removeTokenAlias",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address[]", name: "calculationAddresses", type: "address[]" }],
    name: "setCalculations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "tokenAliases",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdcAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
