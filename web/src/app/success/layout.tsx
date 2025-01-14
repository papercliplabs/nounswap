import { NounSwapLogoLink } from "@/components/NounSwapLogoLink";
import { Button } from "@/components/ui/button";
import { Slottable } from "@radix-ui/react-slot";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex grow flex-col items-center justify-start">
      <header className="item-center shadow-bottom-only flex w-full justify-between px-4 py-2 md:px-10">
        <NounSwapLogoLink />
        <Button variant="secondary" className="py-[10px]" asChild>
          <Slottable>
            <Link href="/" className="label-md">
              Exit
            </Link>
          </Slottable>
        </Button>
      </header>
      <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[40px] md:p-8 md:pb-[calc(env(safe-area-inset-bottom)+32px)] md:pt-[10vh]">
        {children}
      </div>
    </div>
  );
}
