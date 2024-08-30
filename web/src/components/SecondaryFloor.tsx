import { Noun, SecondaryNounListing } from "@/data/noun/types";
import Icon from "./ui/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { LinkShallow } from "./ui/link";
import { formatTokenAmount } from "@/utils/utils";
import clsx from "clsx";

interface NounsFloorProps {
  listing: SecondaryNounListing | null;
  redThreshold?: bigint;
}

export default function SecondaryFloor({ listing, redThreshold }: NounsFloorProps) {
  if (!listing) return null;

  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger>
          <Icon icon="circleInfo" size={18} className="fill-content-secondary" />
        </TooltipTrigger>
        <TooltipContent>The lowest price of all Nouns listed on the secondary market.</TooltipContent>
      </Tooltip>
      <LinkShallow
        searchParam={{ name: "nounId", value: listing.nounId }}
        className="label-sm text-content-secondary hover:text-content-primary whitespace-pre underline"
      >
        Floor price{" "}
        <span className={clsx(redThreshold && BigInt(listing.priceRaw) < redThreshold && "text-semantic-negative")}>
          {formatTokenAmount(BigInt(listing.priceRaw), 18)} ETH
        </span>
      </LinkShallow>
    </div>
  );
}
