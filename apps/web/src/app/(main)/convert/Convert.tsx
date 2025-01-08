"use client";
import NounSelectDialog from "@/components/dialog/NounSelectDialog";
import { Button } from "@/components/ui/button";
import { Noun } from "@/data/noun/types";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useAccount } from "wagmi";
import { CHAIN_CONFIG } from "@/config";
import NounToErc20Dialog from "@/components/dialog/NounToErc20Dialog";
import Erc20ToNounDialog from "@/components/dialog/Erc20ToNounDialog";
import Icon from "@/components/ui/Icon";
import { OneMillionErc20Card } from "@/components/OneMillionErc20Card";

export default function Convert() {
  const [selectedUserNoun, setSelectedUserNoun] = useState<Noun | undefined>(undefined);
  const [selectedErc20HeldNoun, setSelectedErc20HeldNoun] = useState<Noun | undefined>(undefined);
  const { address } = useAccount();

  return (
    <Tabs
      defaultValue="deposit"
      className="border-background-secondary flex flex-col overflow-hidden rounded-[20px] border-4"
    >
      <div className="bg-background-secondary flex flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
        <h2>Convert</h2>
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="redeem">Redeem</TabsTrigger>
        </TabsList>
      </div>
      <div className="border-background-secondary flex w-full flex-col border-b-4 md:flex-row">
        <div className="border-background-secondary relative flex-1 border-b-4 px-4 pb-12 pt-4 md:border-b-0 md:border-r-4 md:pb-[88px] md:pt-10">
          <TabsContent value="deposit" className="flex flex-col items-center justify-center gap-6">
            <h6>You send</h6>
            <NounSelectDialog
              holderAddress={address}
              selectedUserNoun={selectedUserNoun}
              selectedNounCallback={setSelectedUserNoun}
              size={160}
            />
          </TabsContent>
          <TabsContent value="redeem" className="flex flex-col items-center justify-center gap-6">
            <h6>You send</h6>
            <OneMillionErc20Card />
          </TabsContent>
          <div className="bg-background-secondary absolute bottom-0 right-1/2 flex h-[72px] w-[72px] translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-[4px] border-white md:right-0 md:top-1/2 md:-translate-y-1/2">
            <Icon icon="swap" />
          </div>
        </div>
        <div className="flex-1 px-4 pb-4 pt-12 md:pb-[88px] md:pt-10">
          <TabsContent value="deposit" className="flex flex-col items-center justify-center gap-6">
            <h6>You receive</h6>
            <OneMillionErc20Card />
          </TabsContent>
          <TabsContent value="redeem" className="flex flex-col items-center justify-center gap-6">
            <h6>You receive</h6>
            <NounSelectDialog
              holderAddress={CHAIN_CONFIG.addresses.nounsErc20}
              selectedUserNoun={selectedErc20HeldNoun}
              selectedNounCallback={setSelectedErc20HeldNoun}
              size={160}
            />
          </TabsContent>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end p-4 text-center">
        <TabsContent value="deposit" asChild>
          <NounToErc20Dialog depositNoun={selectedUserNoun} />
        </TabsContent>
        <TabsContent value="redeem" asChild>
          <Erc20ToNounDialog redeemNoun={selectedErc20HeldNoun} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
