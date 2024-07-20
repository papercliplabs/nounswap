import { ponder } from "@/generated";
import { getEthAmountInUsd, getTokenAmountInUsd, getUsdAmountInEth } from "./utils/priceOracle";
import { decodeEventLog, erc20Abi, getAddress, isAddressEqual } from "viem";
import { nounDaoExecutorAbi } from "../abis/nounsDaoExecutor";
import { mergeAbis } from "@ponder/core";
import { USDC_TOKEN } from "./utils/tokens";
import { nounsPayerAbi } from "../abis/nounsPayer";
import { NOUNS_TREASURY_ADDRESS, PREVIOUS_NOUNS_TREASURY_ADDRESS } from "./utils/addresses";
import { createFinancialSnapshotParams, getDayId } from "./helpers/financialSnapshot";

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
  const { ExecutedProposal, DailyFinancialSnapshot } = context.db;

  if (EXCLUDE_PROP_IDS.includes(event.args.id)) {
    // Ignore manually excluded props
    return;
  }

  let amountInUsd = 0;
  for (let log of event.transactionReceipt.logs) {
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
      [PREVIOUS_NOUNS_TREASURY_ADDRESS, NOUNS_TREASURY_ADDRESS].includes(log.address) &&
      decodedLog.eventName == "ExecuteTransaction" &&
      !isAddressEqual(decodedLog.args.target, NOUNS_DAO_TOKEN_BUYER)
    ) {
      // ETH not to the token buyer
      const ethAmount = decodedLog.args.value;
      amountInUsd += await getEthAmountInUsd({ amount: ethAmount, context });
    } else if (
      log.address == USDC_TOKEN.address &&
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

  await ExecutedProposal.create({
    id: event.args.id,
    data: {
      timestamp: parseInt(event.block.timestamp.toString()),
      transactionHash: event.transaction.hash,

      amountInEth,
      amountInUsd,
    },
  });

  const snapshot = (await DailyFinancialSnapshot.findMany({ orderBy: { id: "desc" }, limit: 1 })).items[0]!;
  await DailyFinancialSnapshot.update({
    id: snapshot.id,
    data: ({ current }) => ({
      propSpendInEth: current.propSpendInEth + amountInEth,
      propSpendInUsd: current.propSpendInUsd + amountInUsd,
    }),
  });
});
