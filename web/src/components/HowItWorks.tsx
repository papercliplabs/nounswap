"use client";
import { LinkExternal } from "./ui/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "./ui/Icon";

export default function HowItWorksModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="gap-2">
                    <h6 className="text-secondary">How it works</h6>
                    <Icon icon="questionCircle" size={20} className="fill-gray-600" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] max-h-[60vh] flex flex-col overflow-y-auto">
                <h4>How it works</h4>
                <div className="flex flex-col [&>ol>li>div]:text-secondary">
                    <div className="pb-6 border-b-2 border-gray-400">
                        NounSwap a tool that helps Noun owners create a prop to swap their Noun for another Noun in the
                        treasury. It was built by{" "}
                        <LinkExternal href="https://paperclip.xyz/">Paperclip Labs</LinkExternal> and inspired by{" "}
                        <LinkExternal href="https://warpcast.com/toadyhawk.eth/0x38d070e1">
                            a cast from ToadyHawk.eth
                        </LinkExternal>
                        .
                        <br />
                        <br />
                        Read about{" "}
                        <LinkExternal href="https://paperclip.xyz/blog/introducing-nounswap">
                            why we built NounSwap
                        </LinkExternal>
                        .
                    </div>
                    <h5 className="py-6">How to create a Swap Prop</h5>
                    <ol className="pl-4 flex flex-col gap-6">
                        <li>
                            <b>Choose the Noun you want</b>
                            <div>Any Noun from the Nouns treasury.</div>
                        </li>
                        <li>
                            <b>Select your Noun to trade</b>
                            <div>Decide which of your Nouns you want to trade.</div>
                        </li>
                        <li>
                            <b>Approve your Noun:</b>
                            <div>This will approve the Nouns Treasury to swap your Noun if the prop passes.</div>
                        </li>
                        <li>
                            <b>Create a Swap Prop</b>
                            <div>Confirm the transaction and a swap proposal will be created in Nouns Governance.</div>
                        </li>
                    </ol>
                </div>
            </DialogContent>
        </Dialog>
    );
}
