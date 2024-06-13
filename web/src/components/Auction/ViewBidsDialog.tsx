import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogBase";
import { Bid } from "@/data/auction/types";
import { getUserForAddress } from "@/data/user/getUser";
import { useQueries } from "@tanstack/react-query";
import Image from "next/image";
import { formatEther } from "viem";
import { Skeleton } from "../ui/skeleton";
import { CustomAvatar } from "@/providers/WalletProvider";
import { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { LinkExternal } from "../ui/link";
import { CHAIN_CONFIG } from "@/config";

interface ViewBidsDialogProps {
  nounId: string;
  bids: Bid[];
  children: ReactNode;
}

export default function ViewBidsDialog({ children, nounId, bids }: ViewBidsDialogProps) {
  const userResponses = useQueries({
    queries: bids.map((bid) => ({
      queryKey: ["get-user", bid.bidderAddress],
      queryFn: () => getUserForAddress(bid.bidderAddress),
    })),
  });

  return (
    <Dialog>
      <DialogTrigger className="clickable-active label-sm text-content-secondary underline hover:brightness-75">
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[min(425px,95vw)] flex-col overflow-y-auto p-0">
        <h4 className="p-6 pb-0">Bids for Noun {nounId}</h4>
        <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto p-6 pb-10">
          {bids.map((bid, i) => {
            const user = userResponses[i].data;
            return (
              <div key={i} className="label-lg flex w-full min-w-0 items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <CustomAvatar address={bid.bidderAddress} ensImage={user?.imageSrc} size={24} />
                  {user ? (
                    <span className="overflow-hidden text-ellipsis text-nowrap">{user.name}</span>
                  ) : (
                    <Skeleton className="w-[100px] whitespace-pre-wrap"> </Skeleton>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-content-secondary shrink-0 pl-6">Ξ {formatEther(BigInt(bid.amount))}</span>
                  <LinkExternal href={`${CHAIN_CONFIG.chain.blockExplorers?.default.url}/tx/${bid.transactionHash}`}>
                    <ExternalLink
                      size={16}
                      className="stroke-content-secondary clickable-active mb-[2px] hover:brightness-75"
                      strokeWidth={3}
                    />
                  </LinkExternal>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
