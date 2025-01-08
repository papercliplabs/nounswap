import { NounSwapLogoLink } from "@/components/NounSwapLogoLink";
import Icon from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Slottable } from "@radix-ui/react-slot";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex grow flex-col items-center justify-start">
      <header className="item-center flex w-full justify-between border-b-2 border-border-secondary px-4 py-2 md:px-10">
        <NounSwapLogoLink />
        <Button variant="secondary" className="py-[10px]" asChild>
          <Slottable>
            <Link href="/" className="label-md">
              Exit
            </Link>
          </Slottable>
        </Button>
      </header>
      <div className="p-4 pt-[40px] md:p-8 md:pt-[10vh]">{children}</div>
    </div>
  );
}
