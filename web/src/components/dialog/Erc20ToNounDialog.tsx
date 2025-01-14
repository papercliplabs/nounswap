"use client";
import { Button } from "../ui/button";
import { Noun } from "@/data/noun/types";
import { NounsErc20Redeem } from "./transactionDialogPages/NounsErc20Redeem";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogContentInner,
  DrawerDialogTrigger,
} from "@/components/ui/DrawerDialog";

interface Erc20ToNounDialogProps {
  redeemNoun?: Noun;
}

export default function Erc20ToNounDialog({
  redeemNoun,
}: Erc20ToNounDialogProps) {
  return (
    <DrawerDialog>
      <DrawerDialogTrigger asChild>
        <Button className="w-full md:w-fit" disabled={redeemNoun == undefined}>
          Convert to Noun
        </Button>
      </DrawerDialogTrigger>
      <DrawerDialogContent
        className="max-h-[80vh] max-w-[425px]"
        ignoreOutsideInteractions
      >
        <DrawerDialogContentInner>
          {redeemNoun && <NounsErc20Redeem noun={redeemNoun} />}
        </DrawerDialogContentInner>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}
