import { LinkExternal } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { CHAIN_CONFIG } from "@/config";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

export default function ConvertInfo() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <InfoSection title="What is $nouns?">
        $nouns is an ERC-20 token that represents fractional Noun ownership. Any Noun can be deposited for 1,000,000
        $nouns, and conversely, 1,000,000 $nouns can be redeemed to acquire any Noun held by the $nouns contract.
        <br />
        <br />
        Simply put, <b>1 Noun = 1,000,000 $nouns.</b>
      </InfoSection>
      <Separator className="h-[2px]" />
      <InfoSection title="What happens when I convert my Noun?">
        You will receive 1,000,000 $nouns on Ethereum Mainnet. You won't own your Noun anymore; it will be placed in the
        $nouns ERC-20 contract. Anyone can exchange 1,000,000 $nouns for any Noun held in the $nouns contract.
      </InfoSection>
      <Separator className="h-[2px]" />
      <InfoSection title="Is NounSwap affiliated with $nouns?">
        No, NounSwap is not affiliated with $nouns. This interface is only a layer to interact with the $nouns
        contracts. No funds are held in custody by NounSwap at any point.
      </InfoSection>
      <Separator className="h-[2px]" />
      <div className="flex flex-col gap-4">
        <h6>Useful links</h6>
        <div className="flex flex-col">
          <LinkItem href="https://www.buynouns.xyz/">$nouns Leaderboard</LinkItem>
          <LinkItem href="http://nounscan.wtf/">$nounscan</LinkItem>
          <LinkItem href="https://docs.google.com/document/d/1Uz4l8bAPaA2_gsUVZsZo_1dAmggAiYIn5sYba1IK10Q/edit#heading=h.krcxuhjg5aem">
            $nouns Token Spec
          </LinkItem>
          <LinkItem href="https://etherscan.io/address/0x5c1760c98be951A4067DF234695c8014D8e7619C">
            $nouns Mainnet Contract
          </LinkItem>
          <LinkItem href="https://basescan.org/address/0x0a93a7BE7e7e426fC046e204C44d6b03A302b631">
            $nouns Base Contract
          </LinkItem>
          <LinkItem href="https://superbridge.app/base">Bridge to Base</LinkItem>
          <LinkItem href="https://app.uniswap.org/swap?chain=mainnet&outputCurrency=0x5c1760c98be951a4067df234695c8014d8e7619c">
            Buy $noun on Mainnet
          </LinkItem>
          <LinkItem href="https://app.uniswap.org/swap?chain=base&outputCurrency=0x0a93a7BE7e7e426fC046e204C44d6b03A302b631">
            Buy $nouns on Base
          </LinkItem>
          <LinkItem href="https://github.com/verbsteam/nouns-erc20">$nouns Contract Repo</LinkItem>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b- flex flex-col gap-4">
      <h6>{title}</h6>
      <div className="text-content-secondary paragraph-sm">{children}</div>
    </div>
  );
}

function LinkItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <LinkExternal
      href={href}
      className="label-sm text-content-primary hover:text-content-secondary flex w-full justify-between py-3"
    >
      {children}
      <ExternalLink size={16} />
    </LinkExternal>
  );
}
