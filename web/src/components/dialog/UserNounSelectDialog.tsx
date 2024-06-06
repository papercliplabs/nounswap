"use client";
import { Dialog, DialogContent } from "@/components/ui/dialogBase";
import Icon from "../ui/Icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import NounCard from "../NounCard";
import { useState } from "react";
import Image from "next/image";
import { CHAIN_CONFIG } from "@/config";
import { useSwitchChain } from "wagmi";
import { Noun } from "@/data/noun/types";
import Link from "next/link";
import { LinkExternal } from "../ui/link";

interface UserNounSelectDialogProps {
  connected: boolean;
  userNouns?: Noun[];

  selectedUserNoun?: Noun;
  selectedNounCallback: (noun?: Noun) => void;
}

export default function UserNounSelectDialog({
  connected,
  userNouns,
  selectedUserNoun,
  selectedNounCallback,
}: UserNounSelectDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const { switchChainAsync } = useSwitchChain();

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <>
        {selectedUserNoun ? (
          <div className="relative flex hover:cursor-pointer">
            <button onClick={() => setOpen(true)}>
              <NounCard noun={selectedUserNoun} size={200} enableHover={false} alwaysShowNumber />
            </button>
            <button
              onClick={() => selectedNounCallback(undefined)}
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
            >
              <Icon icon="xCircle" size={40} className="rounded-full border-4 border-white fill-gray-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => (connected ? setOpen(true) : openConnectModal?.())}
            className="bg-background-ternary text-content-secondary flex h-[200px] w-[200px] flex-col items-center justify-center gap-2 rounded-[20px] border-4 border-dashed p-8 hover:brightness-[85%]"
          >
            <Image src="/noggles.png" width={64} height={64} alt="" />
            <h6>Select your Noun</h6>
          </button>
        )}
      </>

      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto p-0">
        <h4 className="px-6 pt-6">Select your Noun</h4>
        <div className="[&>ol>li>div]:text-content-secondary flex flex-col">
          {userNouns == undefined ? (
            <Icon icon="pending" size={60} className="animate-spin" />
          ) : userNouns.length == 0 ? (
            <div className="flex h-[244px] w-full flex-col items-center justify-center gap-2 px-8 py-6 text-center">
              <h4>No Nouns available</h4>
              <div className="text-content-secondary">
                {CHAIN_CONFIG.chain.id == 1 ? (
                  <>
                    Don{"'"}t have a noun on Ethereum? Try NounSwap on{" "}
                    <LinkExternal
                      className="text-semantic-accent hover:brightness-[85%]"
                      href="https://sepolia.nounswap.wtf"
                    >
                      Sepolia Testnet
                    </LinkExternal>
                    .
                  </>
                ) : (
                  <>
                    You don{"'"}t have a noun on Testnet.
                    <br />
                    Buy a{" "}
                    <Link href="/" className="text-semantic-accent">
                      Testnet Noun here
                    </Link>
                    .
                  </>
                )}
              </div>
            </div>
          ) : (
            userNouns.map((noun, i) => (
              <button
                className="hover:bg-background-secondary flex w-full flex-row items-center gap-6 p-2 px-6 py-3 text-center hover:brightness-[85%]"
                onClick={() => {
                  selectedNounCallback(noun);
                  setOpen(false);
                }}
                key={i}
              >
                <NounCard noun={noun} size={80} enableHover={false} />
                <h4>Noun {noun.id}</h4>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
