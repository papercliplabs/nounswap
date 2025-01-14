import { Address } from "viem";

export const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

interface Erc20Token {
  address: Address;
  decimals: number;
  symbol: string;
  deploymentBlock: bigint;
}

export const WETH_TOKEN: Erc20Token = {
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  decimals: 18,
  symbol: "WETH",
  deploymentBlock: 4719568n,
};

export const USDC_TOKEN: Erc20Token = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  decimals: 6,
  symbol: "USDC",
  deploymentBlock: 6082465n,
};

export const TREASURY_TOKENS: Erc20Token[] = [
  WETH_TOKEN,
  {
    address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    decimals: 18,
    symbol: "stETH", // rebasing
    deploymentBlock: 11473216n,
  },
  {
    address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    decimals: 18,
    symbol: "wstETH",
    deploymentBlock: 17811727n,
  },
  {
    address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
    decimals: 18,
    symbol: "rETH",
    deploymentBlock: 13325304n,
  },
  USDC_TOKEN,
];
