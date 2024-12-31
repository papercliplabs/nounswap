import { Event, Context, Schema } from "@/generated";

export async function upsertTransaction({
  event,
  context,
}: {
  event: Event;
  context: Context;
}): Promise<Schema["Transaction"]> {
  const { Transaction } = context.db;

  return await Transaction.upsert({
    id: event.log.transactionHash,
    create: {
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      from: event.transaction.from,
      to: event.transaction.to ?? undefined,
      value: event.transaction.value,
      gas: event.transaction.gas,
      gasPrice: event.transaction.gasPrice,
    },
    update: {},
  });
}
