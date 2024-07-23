import { Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner";
import Link from "next/link";
import Icon from "../ui/Icon";
import HowItWorksDialog from "../dialog/HowItWorksDialog";
import { Button } from "../ui/button";
import WalletButton from "../WalletButton";
import Nav, { NavProps } from "./Nav";

const navInfo: NavProps["navInfo"] = [
  { name: "Explore", icon: "layers", href: "/" },
  // { name: "My Props", href: "/proposals" },
  { name: "Convert", icon: "arrowLeftRight", href: "/convert" },
  { name: "Stats", icon: "stats", href: "/stats/treasury" },
];

export function Header() {
  return (
    <>
      <header className="border-border-secondary flex w-full flex-col items-center justify-between gap-4 border-b-2 px-4 py-2 md:px-10">
        <div className="flex w-full flex-row justify-between">
          <div className="flex items-center gap-6 md:flex-1">
            <div className="border-border-secondary pr-6 md:border-r-2">
              <Suspense fallback={<LoadingSpinner />}>
                <Link
                  href="/"
                  className="text-content-primary flex shrink grow-0 flex-row gap-2 [&>svg]:hover:rotate-12"
                >
                  <Icon icon="swap" size={28} className="fill-gray-900 transition-all ease-linear" />
                  <h5 className="hidden md:flex">NounSwap</h5>
                </Link>
              </Suspense>
            </div>
            <Nav navInfo={navInfo} />
          </div>
          <div className="flex flex-1 items-center justify-end gap-1 text-gray-600">
            <HowItWorksDialog>
              <Button variant="ghost" size="icon" className="gap-2">
                <span className="text-content-secondary label-md hidden md:block">How it works</span>
                <Icon icon="circleQuestion" size={20} className="fill-gray-600" />
              </Button>
            </HowItWorksDialog>
            <WalletButton />
          </div>
        </div>
      </header>
    </>
  );
}
