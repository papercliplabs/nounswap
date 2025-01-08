import { Context } from "ponder:registry";
import { transaction } from "ponder:schema";
import { LogEvent } from "../utils/types";

export async function upsertTransaction({
  event,
  context,
}: {
  event: LogEvent;
  context: Context;
}): Promise<(typeof transaction)["$inferSelect"]> {
  const { db } = context;

  const txn = await db.find(transaction, { hash: event.transaction.hash });

  if (txn) {
    // Since onConflictDoNothing returns undefined...
    return txn;
  } else {
    return await db.insert(transaction).values({
      hash: event.transaction.hash,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      from: event.transaction.from,
      to: event.transaction.to ?? undefined,
      value: event.transaction.value,
      gas: event.transaction.gas,
      gasPrice: event.transaction.gasPrice,
    });
  }
}
