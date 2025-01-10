import TitlePopover from "@/components/TitlePopover";
import Card from "@/components/ui/card";
import { getAccountLeaderboard } from "@/data/ponder/leaderboard/getAccountLeaderboard";
import { formatNumber } from "@/utils/format";
import { formatUnits, getAddress } from "viem";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHAIN_CONFIG } from "@/config";
import { TableLinkExternalRow } from "@/components/TableLinkExternalRow";
import Identity from "@/components/Identity";

interface LeaderboardStatsProps {
  accountLeaderboardData: Awaited<ReturnType<typeof getAccountLeaderboard>>;
  totalNounsCount: number;
}

export default function LeaderboardStats({
  accountLeaderboardData,
  totalNounsCount,
}: LeaderboardStatsProps) {
  const uniqueOwnerCount = accountLeaderboardData.length;
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex flex-col">
          <TitlePopover title="Total Nouns">
            Total number of Nouns currently in existence
          </TitlePopover>
          <span className="label-lg">
            {formatNumber({ input: totalNounsCount, maxFractionDigits: 0 })}
          </span>
        </Card>
        <Card className="flex flex-col">
          <TitlePopover title="Unique Owners">
            Total number of unique owners. An owner is considered to be an
            account with an ownership above 0.1 Nouns.
          </TitlePopover>
          <span className="label-lg">{uniqueOwnerCount}</span>
        </Card>
      </div>
      <Table className="w-full table-fixed overflow-hidden">
        <TableHeader>
          <TableRow className="hover:bg-white">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>
              Owners{" "}
              <span className="text-content-secondary">
                ({uniqueOwnerCount})
              </span>
            </TableHead>
            <TableHead className="w-[130px] text-right">Ownership</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountLeaderboardData.map((entry, i) => {
            const ownershipCount = Number(
              formatUnits(BigInt(entry.effectiveNounsBalance), 24),
            );
            const percentOwnership = ownershipCount / totalNounsCount;
            const address = getAddress(entry.address);
            return (
              <TableLinkExternalRow
                key={entry.address}
                href={
                  CHAIN_CONFIG.chain.blockExplorers?.default.url +
                  `/address/${entry.address}`
                }
              >
                <TableCell className="label-sm">{i + 1}</TableCell>
                <TableCell className="label-md">
                  <Identity
                    address={address}
                    avatarSize={32}
                    className="gap-2"
                  />
                </TableCell>
                <TableCell className="w-[130px] text-right label-md">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-content-secondary paragraph-sm">
                      (
                      {formatNumber({ input: percentOwnership, percent: true })}
                      )
                    </span>
                    <span>
                      {formatNumber({
                        input: ownershipCount,
                        maxFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </TableCell>
              </TableLinkExternalRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
