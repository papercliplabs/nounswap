"use client";
import { LinkExternal } from "../ui/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogBase";
import { Button } from "@/components/ui/button";
import Icon from "../ui/Icon";

export default function HowItWorksDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="gap-2">
                    <h6 className="text-secondary hidden md:block">How it works</h6>
                    <Icon icon="questionCircle" size={20} className="fill-gray-600" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] max-h-[80vh] flex flex-col overflow-y-auto">
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
                    <h5 className="pt-6 pb-2">How to create a Swap Prop</h5>
                    <ol className="pl-6 flex flex-col gap-2">
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
                            <div>
                                Decide the WETH tip you are willing to give to the Nouns treasury to accept your swap.
                            </div>
                        </li>
                        <li>
                            Approve your Noun
                            <div>
                                Confirm the transaction to allow the Nouns Treasury to swap your Noun if the prop
                                passes.
                            </div>
                        </li>
                        <li>
                            Approve your tip
                            <div>
                                Confirm the transaction to allow the Nouns Treasury to take your WETH tip amount if the
                                prop passes.
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
