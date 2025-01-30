import { ProposalTransaction } from "@/data/ponder/governance/getProposal";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogContentInner,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "../ui/DrawerDialog";
import {
  decodeAbiParameters,
  parseAbi,
  AbiFunction,
  Address,
  getAddress,
  isAddressEqual,
} from "viem";
import { LinkExternal } from "../ui/link";
import { CHAIN_CONFIG } from "@/config";
import { getExplorerLink } from "@/utils/blockExplorer";
import { Name } from "@paperclip-labs/whisk-sdk/identity";
import { formatTokenAmount } from "@/utils/utils";

interface ProposalTransactionSummaryProps {
  transactions: ProposalTransaction[];
}

export default function ProposalTransactionSummary({
  transactions,
}: ProposalTransactionSummaryProps) {
  const decodedTransactions = transactions.map(decodeTransaction);
  const summary = parseDecodedTransactionsSummary(decodedTransactions);

  return (
    <DrawerDialog>
      <DrawerDialogTrigger className="flex items-center justify-between gap-3 rounded-[12px] bg-gray-100 px-6 py-4 transition-colors hover:brightness-95">
        <span className="whitespace-normal text-start">
          Requesting <b>{summary}</b>
        </span>
        <span className="underline label-md">Details</span>
      </DrawerDialogTrigger>
      <DrawerDialogContent className="gap-0 md:max-w-[min(720px,95%)]">
        <DrawerDialogTitle className="w-full p-6 pb-2 heading-4">
          Transactions
        </DrawerDialogTitle>
        <DrawerDialogContentInner className="gap-6 overflow-y-auto">
          <div className="flex w-full min-w-0 flex-col gap-6">
            {decodedTransactions.map((tx, i) => (
              <div
                key={i}
                className="flex min-h-fit w-full min-w-0 gap-2 overflow-x-auto rounded-[12px] border bg-gray-100 px-6 py-4"
              >
                <div>{i}.</div>
                <div className="flex whitespace-pre-wrap">
                  <DecodedTransactionRenderer {...tx} />
                </div>
              </div>
            ))}
          </div>
        </DrawerDialogContentInner>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}

interface DecodedTransaction {
  to: Address;
  functionName: string;
  args: {
    name?: string;
    type: "address" | "uint256" | string;
    value: string | Address | bigint | number;
  }[];
  value: bigint;
}

function decodeTransaction(
  transaction: ProposalTransaction,
): DecodedTransaction {
  let functionName: string;
  let args: DecodedTransaction["args"];

  if (transaction.signature == "") {
    // ETH transfer
    functionName = "transfer";
    args = [{ name: "value", type: "uint256", value: transaction.value }];
  } else {
    functionName = transaction.signature.split("(")[0];
    const functionSignature = `function ${transaction.signature}`;
    const abi = parseAbi([functionSignature])[0] as AbiFunction;
    const decoded = decodeAbiParameters(abi.inputs, transaction.calldata) as (
      | string
      | Address
      | bigint
      | number
    )[];

    args = decoded.map((value, i) => ({
      name: abi.inputs[i].name,
      type: abi.inputs[i].type,
      value,
    }));
  }

  return { to: transaction.to, functionName, args, value: transaction.value };
}

function DecodedTransactionRenderer({
  to,
  functionName,
  args,
  value,
}: DecodedTransaction) {
  return (
    <div>
      <div className="flex">
        <LinkExternal
          href={getExplorerLink(to)}
          className="underline transition-colors hover:text-content-secondary"
        >
          <Name address={to} />
        </LinkExternal>
        .{functionName}({args.length == 0 && ")"}
      </div>
      {args.map((param, i) => (
        <div className="flex pl-4" key={i}>
          <FunctionArgumentRenderer {...param} />
          {i != args.length - 1 && ","}
        </div>
      ))}
      {args.length > 0 && <div>)</div>}
    </div>
  );
}

function FunctionArgumentRenderer({
  name,
  type,
  value,
}: DecodedTransaction["args"][0]) {
  switch (type) {
    case "address":
      return (
        <LinkExternal
          href={getExplorerLink(value as Address)}
          className="underline transition-colors hover:text-content-secondary"
        >
          <Name address={getAddress(value as string)} />
        </LinkExternal>
      );
    default:
      return <>{value.toString()}</>;
  }
}

function parseDecodedTransactionsSummary(
  transactions: DecodedTransaction[],
): string {
  const items: string[] = [];

  let totalEth: bigint = BigInt(0);
  let totalUsdc: bigint = BigInt(0);
  const nounIds: number[] = [];

  try {
    for (const tx of transactions) {
      if (tx.functionName == "transfer") {
        totalEth += tx.value;
      } else if (
        isAddressEqual(tx.to, CHAIN_CONFIG.addresses.nounsToken) &&
        (tx.functionName == "safeTransferFrom" ||
          tx.functionName == "transferFrom") &&
        tx.args[0]?.type == "address" &&
        isAddressEqual(
          getAddress(tx.args[0]!.value as string),
          CHAIN_CONFIG.addresses.nounsTreasury,
        )
      ) {
        nounIds.push(Number(tx.args[2]));
      } else if (
        isAddressEqual(tx.to, CHAIN_CONFIG.addresses.nounsToken) &&
        tx.functionName == "transferFrom" &&
        tx.args[0]?.type == "address" &&
        isAddressEqual(
          getAddress(tx.args[0]!.value as string),
          CHAIN_CONFIG.addresses.nounsTreasury,
        )
      ) {
        totalUsdc += tx.args[1].value as bigint;
      } else if (
        isAddressEqual(tx.to, CHAIN_CONFIG.addresses.nounsPayer) &&
        tx.functionName == "sendOrRegisterDebt"
      ) {
        totalUsdc += tx.args[1].value as bigint;
      }
    }
  } catch (e) {
    console.log("Error parsing tx summary", e);
  }

  if (totalEth > BigInt(0)) {
    items.push(`${formatTokenAmount(totalEth, 18)} ETH`);
  }

  if (totalUsdc > BigInt(0)) {
    items.push(`${formatTokenAmount(totalUsdc, 6)} USDC`);
  }

  if (nounIds.length > 0) {
    items.push(
      nounIds.length == 1 ? `Nouns ${nounIds[0]}` : `${nounIds.length} Nouns`,
    );
  }

  return `${items.length == 0 ? "unknown" : items.join(" + ")}`;
}
