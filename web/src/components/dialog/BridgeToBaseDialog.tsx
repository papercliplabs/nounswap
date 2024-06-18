"use client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialogBase";
import { Button } from "../ui/button";
import Image from "next/image";
import { LinkExternal } from "../ui/link";
import { ArrowRightLeft, CircleAlert, Clock, ExternalLink, ShieldAlert } from "lucide-react";

export default function BridgeToBaseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 md:w-fit">
          <Image src="/base.png" width={20} height={20} className="h-5 w-5" alt="" />
          Bridge to Base
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col gap-6 overflow-y-auto p-6">
        <h4>Bridge to Base</h4>
        <div className="flex w-full items-center justify-center">
          <Image src="/bridge-to-base.png" width={182} height={79} alt="" />
        </div>
        <span>When bridging $nouns to base you'll need to keep the following in mind: </span>
        <div className="flex gap-4">
          <ShieldAlert size={32} className="stroke-content-primary shrink-0" strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="label-md">You can only redeem $nouns on Mainnet </span>
            <span className="paragraph-sm text-content-secondary">
              If you bridge to Base you will need to bridge back to redeem your $nouns for a Noun on Mainnet.
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Clock size={32} className="stroke-content-primary shrink-0" strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="label-md">You'll have to wait ~7 days to bridge back.</span>
            <span className="paragraph-sm text-content-secondary">
              Withdrawals usually involve a{" "}
              <LinkExternal
                href="https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/withdrawals.md"
                className="font-bold underline hover:brightness-75"
              >
                ~7 days waiting period
              </LinkExternal>{" "}
              for fraud prevention.
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <ArrowRightLeft size={32} className="stroke-content-primary shrink-0" strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="label-md">You may need to do multiple transactions</span>
            <span className="paragraph-sm text-content-secondary">
              Superbridge uses BaseNative Bridge contracts which are highly secure, but require a lot of processing.
            </span>
          </div>
        </div>
        <LinkExternal href="https://superbridge.app/" className="w-full">
          <Button className="flex w-full gap-[10px]">
            Continue to Superbridge
            <ExternalLink size={16} />
          </Button>
        </LinkExternal>
      </DialogContent>
    </Dialog>
  );
}
