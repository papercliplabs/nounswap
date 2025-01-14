import { ponder } from "ponder:registry";
import { getEthAmountInUsd, getTokenAmountInUsd, getUsdAmountInEth } from "./utils/priceOracle";
import { decodeEventLog, erc20Abi, getAddress, isAddressEqual } from "viem";
import { nounDaoExecutorAbi } from "../abis/nounsDaoExecutor";
import { desc, mergeAbis } from "ponder";
import { USDC_TOKEN } from "./utils/tokens";
import { nounsPayerAbi } from "../abis/nounsPayer";
import { NOUNS_TREASURY_ADDRESS, PREVIOUS_NOUNS_TREASURY_ADDRESS } from "./utils/addresses";
import { dailyFinancialSnapshot, executedProposal } from "ponder:schema";

const NOUNS_DAO_PAYER_ADDRESS = getAddress("0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D"); // To refill payer
const NOUNS_DAO_TOKEN_BUYER = getAddress("0x4f2acdc74f6941390d9b1804fabc3e780388cfe5");

const EXCLUDE_PROP_IDS = [
  22n, // stake ETH
  30n, // stake ETH
  52n, // stake ETH
  217n, // stake ETH
  227n, // stake ETH
  332n, // stake ETH
  356n, // migrate DAO
  359n, // migrate DAO
];

ponder.on("NounsDaoProxy:ProposalExecuted", async ({ event, context }) => {
  const { db, client } = context;

  if (EXCLUDE_PROP_IDS.includes(event.args.id)) {
    // Ignore manually excluded props
    return;
  }

  let amountInUsd = 0;

  const receipt = await client.getTransactionReceipt({ hash: event.transaction.hash });
  for (let log of receipt.logs) {
    let decodedLog = undefined;

    try {
      decodedLog = decodeEventLog({
        abi: mergeAbis([nounDaoExecutorAbi, erc20Abi, nounsPayerAbi]),
        data: log.data,
        topics: log.topics,
      });
    } catch (e) {
      // Ignore, not one of the desired events
      continue;
    }

    if (
      [PREVIOUS_NOUNS_TREASURY_ADDRESS, NOUNS_TREASURY_ADDRESS].includes(getAddress(log.address)) &&
      decodedLog.eventName == "ExecuteTransaction" &&
      !isAddressEqual(decodedLog.args.target, NOUNS_DAO_TOKEN_BUYER)
    ) {
      // ETH not to the token buyer
      const ethAmount = decodedLog.args.value;
      amountInUsd += await getEthAmountInUsd({ amount: ethAmount, context });
    } else if (
      isAddressEqual(log.address, USDC_TOKEN.address) &&
      decodedLog.eventName == "Transfer" &&
      isAddressEqual(decodedLog.args.from, NOUNS_DAO_PAYER_ADDRESS)
    ) {
      // USDC transfer from USDC payer
      amountInUsd += await getTokenAmountInUsd({
        amount: decodedLog.args.value,
        address: USDC_TOKEN.address,
        decimals: USDC_TOKEN.decimals,
        context,
      });
    } else if (isAddressEqual(log.address, NOUNS_DAO_PAYER_ADDRESS) && decodedLog.eventName == "RegisteredDebt") {
      // Registered debt to USDC payer
      amountInUsd += await getTokenAmountInUsd({
        amount: decodedLog.args.amount,
        address: USDC_TOKEN.address,
        decimals: USDC_TOKEN.decimals,
        context,
      });
    }
  }

  const amountInEth = await getUsdAmountInEth({ amount: amountInUsd, context });

  await db.insert(executedProposal).values({
    id: event.args.id,
    timestamp: parseInt(event.block.timestamp.toString()),
    transactionHash: event.transaction.hash,
    amountInEth,
    amountInUsd,
  });

  const { id } = (
    await db.sql
      .select({ id: dailyFinancialSnapshot.id })
      .from(dailyFinancialSnapshot)
      .limit(1)
      .orderBy(desc(dailyFinancialSnapshot.id))
  )[0]!;

  await db.update(dailyFinancialSnapshot, { id }).set((row) => ({
    propSpendInEth: row.propSpendInEth + amountInEth,
    propSpendInUsd: row.propSpendInUsd + amountInUsd,
  }));
});
