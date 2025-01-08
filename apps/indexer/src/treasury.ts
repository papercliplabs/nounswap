import { ponder } from "ponder:registry";
import { erc20Abi } from "viem";
import { getEthAmountInUsd, getTokenAmountInUsd, getUsdAmountInEth } from "./utils/priceOracle";
import { createFinancialSnapshotParams, getDayId } from "./helpers/financialSnapshot";
import { TREASURY_TOKENS } from "./utils/tokens";
import { NOUNS_TREASURY_ADDRESS, PREVIOUS_NOUNS_TREASURY_ADDRESS } from "./utils/addresses";
import { dailyFinancialSnapshot } from "ponder:schema";

// ponder.on("TreasuryBalanceTrigger:block", async ({ event, context }) => {
//   let balanceInUsd = 0;
//   for (let token of TREASURY_TOKENS) {
//     if (event.block.number < token.deploymentBlock) {
//       // Skip if token was not deployed
//       continue;
//     }

//     const [previousTreasuryBalance, currentTreasuryBalance] = await Promise.all([
//       context.client.readContract({
//         address: token.address,
//         abi: erc20Abi,
//         functionName: "balanceOf",
//         args: [PREVIOUS_NOUNS_TREASURY_ADDRESS],
//       }),
//       context.client.readContract({
//         address: token.address,
//         abi: erc20Abi,
//         functionName: "balanceOf",
//         args: [NOUNS_TREASURY_ADDRESS],
//       }),
//     ]);

//     const balance = previousTreasuryBalance + currentTreasuryBalance;

//     const tokenBalanceUsd = await getTokenAmountInUsd({
//       address: token.address,
//       amount: balance,
//       decimals: token.decimals,
//       context,
//     });
//     balanceInUsd += Number(tokenBalanceUsd);
//   }

//   const [previousTreasuryEthBalance, currentTreasuryEthBalance] = await Promise.all([
//     context.client.getBalance({ address: PREVIOUS_NOUNS_TREASURY_ADDRESS }),
//     context.client.getBalance({ address: NOUNS_TREASURY_ADDRESS }),
//   ]);
//   const treasuryEthBalance = previousTreasuryEthBalance + currentTreasuryEthBalance;
//   const treasuryBalanceUsd = await getEthAmountInUsd({ amount: treasuryEthBalance, context });

//   balanceInUsd += Number(treasuryBalanceUsd);
//   const balanceInEth = await getUsdAmountInEth({ amount: balanceInUsd, context });

//   const dayId = getDayId(event.block.timestamp);
//   await context.db
//     .insert(dailyFinancialSnapshot)
//     .values({
//       ...createFinancialSnapshotParams,
//       id: dayId,
//       timestamp: dayId,
//       treasuryBalanceInEth: balanceInEth,
//       treasuryBalanceInUsd: balanceInUsd,
//     })
//     .onConflictDoUpdate((row) => ({
//       treasuryBalanceInEth: balanceInEth,
//       treasuryBalanceInUsd: balanceInUsd,
//     }));
// });
