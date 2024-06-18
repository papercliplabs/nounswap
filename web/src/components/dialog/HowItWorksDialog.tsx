"use client";
import { LinkExternal } from "../ui/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogBase";
import { Separator } from "../ui/separator";

export default function HowItWorksDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[min(425px,95vw)] flex-col overflow-y-auto">
        <h4>How it works</h4>
        <div className="[&>ol>li>div]:text-content-secondary flex flex-col gap-6">
          <div>
            NounSwap is designed to make owning and swapping Nouns easy. Explore, bid, swap, and convert Nouns all in
            one place! It was built by{" "}
            <LinkExternal href="https://paperclip.xyz/" className="font-bold underline hover:brightness-75">
              Paperclip Labs
            </LinkExternal>{" "}
            and inspired by{" "}
            <LinkExternal
              href="https://warpcast.com/toadyhawk.eth/0x38d070e1"
              className="font-bold underline hover:brightness-75"
            >
              a cast from ToadyHawk.eth
            </LinkExternal>
            . Read about{" "}
            <LinkExternal
              href="https://paperclip.xyz/blog/introducing-nounswap"
              className="font-bold underline hover:brightness-75"
            >
              why we built NounSwap
            </LinkExternal>
            .
            <br />
            <br />
            Here's what you can do on NounSwap:
          </div>
          <Separator className="h-[2px]" />
          <div className="flex flex-col gap-2">
            <span className="label-lg">Daily Auctions</span>
            Bid on daily auctions to win a new Noun each day.
          </div>
          <Separator className="h-[2px]" />
          <div className="flex flex-col gap-2">
            <span className="label-lg">Instant Swaps</span>
            Swap your Nouns permissionlessly without needing approval.
          </div>
          <Separator className="h-[2px]" />
          <div className="flex flex-col gap-2">
            <span className="label-lg">Convert $nouns</span>
            Turn your Noun into $nouns tokens (1 Noun = 1,000,000 $nouns) or redeem 1,000,000 $nouns tokens for a Noun.
          </div>
          <Separator className="h-[2px]" />
          <div className="flex flex-col gap-2">
            <span className="label-lg">Swap Offers</span>
            Offer to swap your Noun with one from the Nouns treasury.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
