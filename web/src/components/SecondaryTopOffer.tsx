import { Noun, SecondaryNounListing, SecondaryNounOffer } from "@/data/noun/types";
import Icon from "./ui/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { LinkShallow } from "./ui/link";
import { formatTokenAmount } from "@/utils/utils";
import clsx from "clsx";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialogBase";
import { formatNumber } from "@/utils/format";
import Image from "next/image";

interface NounsFloorProps {
  offer: SecondaryNounOffer | null;
}

export default function SecondaryTopOffer({ offer }: NounsFloorProps) {
  if (!offer) return null;

  return (
    <Dialog>
      <DialogTrigger className="label-sm hover:text-content-primary underline">
        Top offer: {formatNumber({ input: offer.priceEth, unit: "ETH" })}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[420px]">
        <DialogTitle className="heading-4">Top Offer</DialogTitle>
        <div className="flex flex-col gap-6">
          <div className="font-pt border-border-secondary flex h-[92px] w-full items-start justify-between gap-3 rounded-xl border-2 p-4 font-bold">
            <div className="flex flex-col gap-1">
              <span className="text-[28px] leading-[36px]">{formatNumber({ input: offer.priceEth, unit: "ETH" })}</span>
              {offer.priceUsd && (
                <span className="label-sm text-content-secondary">
                  {formatNumber({ input: offer.priceUsd, unit: "USD" })}
                </span>
              )}
            </div>
            {offer.marketIcon && (
              <Image src={offer.marketIcon ?? ""} width={36} height={36} alt={offer.marketName ?? ""} />
            )}
          </div>
          <div>The highest offer to buy a Noun across all secondary marketplaces.</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
