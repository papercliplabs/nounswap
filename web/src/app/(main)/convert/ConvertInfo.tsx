import { LinkExternal } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { CHAIN_CONFIG } from "@/config";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

export default function ConvertInfo() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <InfoSection title="What are $nouns?">
        1 noun = 1,000,000 $nouns
        <br />
        <br />
        So this tool automatically converts your noun to $nouns, which is then redeemable for the specific noun you want
        in the token contract.
      </InfoSection>
      <Separator className="h-[2px]" />
      <InfoSection title="What happens when I convert my Noun?">
        You won{"'"}t own your Noun anymore; it will be placed in the $nouns ERC-20 contract, where anyone can buy it.
        You can exchange any Noun in the $nouns contract for 1,000,000 $nouns tokens.
      </InfoSection>
      <Separator className="h-[2px]" />
      <InfoSection title="Is NounSwap affiliated with $nouns?">
        No, NounSwap is not affiliated with $nouns. This interface is only a layer over the $nouns contracts. No funds
        are held in custody by NounSwap at any point.
      </InfoSection>
      <Separator className="h-[2px]" />
      <div className="flex flex-col gap-4">
        <h6>Useful links</h6>
        <div className="flex flex-col">
          <LinkItem href="https://matcha.xyz/tokens/base/0x0a93a7be7e7e426fc046e204c44d6b03a302b631">
            Purchase $nouns
          </LinkItem>
          <LinkItem href="https://superbridge.app/base">Bridge to Base</LinkItem>
          <LinkItem href="https://www.buynouns.xyz/">$nouns Leaderboard</LinkItem>
          <LinkItem href="https://docs.google.com/document/d/1Uz4l8bAPaA2_gsUVZsZo_1dAmggAiYIn5sYba1IK10Q/edit#heading=h.krcxuhjg5aem">
            Token Spec
          </LinkItem>
          <LinkItem
            href={`${CHAIN_CONFIG.chain.blockExplorers?.default.url}/address/${CHAIN_CONFIG.addresses.nounsErc20}`}
          >
            $nouns Contract
          </LinkItem>
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
