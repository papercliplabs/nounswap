import { Address, formatUnits } from "viem";
import { yearnLensOracleAbi } from "../../abis/yearnLensOracle";
import { WETH_ADDRESS } from "./tokens";
import { Context } from "ponder:registry";

const YEARN_LENS_USDC_ORACLE_ADDRESS = "0x83d95e0d5f402511db06817aff3f9ea88224b030"; // Deployed 12242339
const YEARN_LENS_ORACLE_DECIMALS = 6;
const YEARN_LENS_ORACLE_SCALER = BigInt(10 ** YEARN_LENS_ORACLE_DECIMALS);

export async function getTokenAmountInUsd({
  amount,
  address,
  decimals,
  context,
}: {
  amount: bigint;
  address: Address;
  decimals: number;
  context: Context;
}): Promise<number> {
  const price = await context.client.readContract({
    address: YEARN_LENS_USDC_ORACLE_ADDRESS,
    abi: yearnLensOracleAbi,
    functionName: "getPriceUsdcRecommended",
    args: [address],
  });

  return Number(formatUnits((amount * price) / YEARN_LENS_ORACLE_SCALER, decimals));
}

export async function getEthAmountInUsd({ amount, context }: { amount: bigint; context: Context }): Promise<number> {
  return getTokenAmountInUsd({ amount, address: WETH_ADDRESS, decimals: 18, context });
}

export async function getUsdAmountInEth({ amount, context }: { amount: number; context: Context }): Promise<number> {
  return amount / (await getEthAmountInUsd({ amount: BigInt(1e18), context }));
}
