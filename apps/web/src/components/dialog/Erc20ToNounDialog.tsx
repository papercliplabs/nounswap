"use client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialogBase";
import { Button } from "../ui/button";
import { Noun } from "@/data/noun/types";
import { NounsErc20Redeem } from "./transactionDialogPages/NounsErc20Redeem";

interface Erc20ToNounDialogProps {
  redeemNoun?: Noun;
}

export default function Erc20ToNounDialog({ redeemNoun }: Erc20ToNounDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full md:w-fit" disabled={redeemNoun == undefined}>
          Convert to Noun
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12"
        onInteractOutside={(event) => event.preventDefault()}
      >
        {redeemNoun && <NounsErc20Redeem noun={redeemNoun} />}
      </DialogContent>
    </Dialog>
  );
}
