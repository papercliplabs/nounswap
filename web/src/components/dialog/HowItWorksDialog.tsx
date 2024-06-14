"use client";
import { LinkExternal } from "../ui/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogBase";

export default function HowItWorksDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[min(425px,95vw)] flex-col overflow-y-auto">
        <h4>How it works</h4>
        <div className="[&>ol>li>div]:text-content-secondary flex flex-col">
          <div className="border-b-2 border-gray-400 pb-6">
            NounSwap a tool that helps Noun owners create a prop to swap their Noun for another Noun in the treasury. It
            was built by{" "}
            <LinkExternal href="https://paperclip.xyz/" className="text-semantic-accent">
              Paperclip Labs
            </LinkExternal>{" "}
            and inspired by{" "}
            <LinkExternal href="https://warpcast.com/toadyhawk.eth/0x38d070e1" className="text-semantic-accent">
              a cast from ToadyHawk.eth
            </LinkExternal>
            .
            <br />
            <br />
            Read about{" "}
            <LinkExternal href="https://paperclip.xyz/blog/introducing-nounswap" className="text-semantic-accent">
              why we built NounSwap
            </LinkExternal>
            .
          </div>
          <h5 className="pb-2 pt-6">How to create a Swap Prop</h5>
          <ol className="flex flex-col gap-2 pl-6">
            <li>
              Choose the Noun you want
              <div>Any Noun from the Nouns treasury.</div>
            </li>
            <li>
              Select your Noun to trade
              <div>Decide which of your Nouns you want to trade.</div>
            </li>
            <li>
              Select your tip amount
              <div>Decide the WETH tip you are willing to give to the Nouns treasury to accept your swap.</div>
            </li>
            <li>
              Approve your Noun
              <div>Confirm the transaction to allow the Nouns Treasury to swap your Noun if the prop passes.</div>
            </li>
            <li>
              Approve your tip
              <div>
                Confirm the transaction to allow the Nouns Treasury to take your WETH tip amount if the prop passes.
              </div>
            </li>
            <li>
              Create the Swap Prop
              <div>Confirm the transaction to create the swap proposal in Nouns Governance.</div>
            </li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
