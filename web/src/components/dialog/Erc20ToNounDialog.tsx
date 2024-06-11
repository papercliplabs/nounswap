"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialogBase";
import { Button } from "../ui/button";
import { Noun } from "@/data/noun/types";
import { NounsErc20Redeem } from "./transactionDialogPages/NounsErc20Redeem";

interface Erc20ToNounDialogProps {
  redeemNoun?: Noun;
}

export default function Erc20ToNounDialog({ redeemNoun }: Erc20ToNounDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button className="w-full md:w-fit" onClick={() => setIsOpen(true)} disabled={redeemNoun == undefined}>
        Convert to Noun
      </Button>
      <DialogContent className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12">
        {redeemNoun && <NounsErc20Redeem noun={redeemNoun} />}
      </DialogContent>
    </Dialog>
  );
}
