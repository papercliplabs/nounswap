import Icon from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Slottable } from "@radix-ui/react-slot";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex grow flex-col items-center justify-start">
      <header className="item-center border-border-secondary flex w-full justify-between border-b-2 px-4 py-2 md:px-10">
        <Link
          href="/"
          className="text-content-primary flex shrink grow-0 flex-row items-center gap-2 [&>svg]:hover:rotate-12"
        >
          <Icon icon="swap" size={28} className="fill-gray-900 transition-all ease-linear" />
          <h5 className="hidden md:flex">NounSwap</h5>
        </Link>
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
