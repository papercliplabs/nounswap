"use client";
import { Address, formatEther, zeroAddress } from "viem";
import Settle from "./Settle";
import { Auction } from "@/data/auction/types";
import { formatNumber } from "@/utils/utils";
import { AuctionDetailTemplate } from "./AuctionDetailsTemplate";
import { Button } from "../ui/button";
import { LinkExternal, LinkShallow } from "../ui/link";
import { CHAIN_CONFIG } from "@/config";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Icon from "../ui/Icon";
import { UserAvatar, UserName, UserRoot } from "../User/UserClient";
import { mainnet } from "viem/chains";
import { BidHistoryDialog } from "./BidHistoryDialog";

export function EndedAuction({ auction }: { auction: Auction }) {
  const winningBid = auction.bids[0];

  return (
    <>
      <AuctionDetailTemplate
        item1={{
          title: "Winning bid",
          value: auction.nounderAuction
            ? "n/a"
            : `${formatNumber(formatEther(winningBid ? BigInt(winningBid.amount) : BigInt(0)))} ETH`,
        }}
        item2={{
          title: "Won by",
          value: (
            <div className="flex flex-row items-center gap-2">
              <UserRoot
                address={
                  auction.nounderAuction
                    ? CHAIN_CONFIG.addresses.noundersMultisig
                    : auction.bids[0]?.bidderAddress ?? zeroAddress
                }
              >
                <UserAvatar className="h-[20px] w-[20px] md:h-[36px] md:w-[36px]" />
                <UserName />
              </UserRoot>
              {auction.nounderAuction && (
                <Tooltip>
                  <TooltipTrigger>
                    <Icon icon="circleInfo" className="fill-content-secondary" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-background-dark text-wrap text-center">
                    All Noun auction proceeds go to the Nouns Treasury. The founders ('Nounders'), are compensated with
                    Nouns. Every 10th Noun for the first 5 years goes to their multisig wallet.
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ),
        }}
      />

      {auction.state == "ended-unsettled" &&
        (CHAIN_CONFIG.chain == mainnet ? (
          <LinkExternal href="https://fomonouns.wtf/" className="w-full hover:brightness-100">
            <Button className="w-full">Help mint the next Noun</Button>
          </LinkExternal>
        ) : (
          <Settle />
        ))}
      {auction.state == "ended-settled" && (
        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-4">
          <LinkShallow
            searchParam={{ name: "nounId", value: auction.nounId }}
            className="md:w-[200px]"
            variant="secondary"
            size="default"
          >
            Noun profile
          </LinkShallow>

          <LinkExternal
            href={`${CHAIN_CONFIG.chain.blockExplorers?.default.url}/token/${CHAIN_CONFIG.addresses.nounsToken}?a=${auction.nounId}`}
            className="flex w-full hover:brightness-100 md:w-[200px]"
          >
            <Button variant="secondary" className="w-full">
              Etherscan
            </Button>
          </LinkExternal>
        </div>
      )}
      {auction.bids.length > 0 && (
        <BidHistoryDialog nounId={auction.nounId} bids={auction.bids}>
          Bid history
        </BidHistoryDialog>
      )}
    </>
  );
}
