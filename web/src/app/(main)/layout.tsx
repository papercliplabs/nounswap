import WalletButton from "@/components/WalletButton";
import Nav from "@/components/Nav";
import Icon from "@/components/ui/Icon";
import HowItWorksDialog from "@/components/dialog/HowItWorksDialog";
import { LinkExternal } from "@/components/ui/link";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

const navInfo = [
  { name: "Explore", href: "/" },
  { name: "My Props", href: "/proposals" },
];

function Header() {
  return (
    <>
      <header className="border-border-secondary flex w-full flex-col items-center justify-between gap-4 border-b-2 px-4 pb-2 pt-4 md:px-10">
        <div className="flex w-full flex-row justify-between">
          <div className="flex items-center gap-6 md:flex-1">
            <div className="border-border-secondary pr-6 md:border-r-2">
              <Suspense fallback={<LoadingSpinner />}>
                <Link
                  href="/"
                  className="text-content-primary flex shrink grow-0 flex-row gap-2 [&>svg]:hover:rotate-12"
                >
                  <Icon icon="repeat" size={28} className="fill-gray-900 transition-all ease-linear" />
                  <h5 className="hidden md:flex">NounSwap</h5>
                </Link>
              </Suspense>
            </div>
            <span className="hidden md:flex">
              <Nav navInfo={navInfo} />
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-1 text-gray-600">
            <HowItWorksDialog>
              <Button variant="ghost" size="icon" className="gap-2">
                <h6 className="text-content-secondary hidden md:block">How it works</h6>
                <Icon icon="questionCircle" size={20} className="fill-gray-600" />
              </Button>
            </HowItWorksDialog>
            <WalletButton />
          </div>
        </div>
        <div className="bg-background-secondary flex w-full justify-between rounded-2xl p-1 md:hidden">
          <Nav navInfo={navInfo} />
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="flex h-20 w-full flex-row items-center justify-center gap-1 px-10 py-2">
      Made for{" "}
      <LinkExternal href="https://nouns.wtf/">
        <Image src="/nouns-icon.png" width={40} height={40} alt="Nouns" draggable={false} />
      </LinkExternal>{" "}
      by
      <LinkExternal href="https://paperclip.xyz/">Paperclip Labs</LinkExternal>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="border-border-primary flex grow flex-col items-start justify-start gap-10 px-4 pb-4 pt-10 md:px-8 md:pb-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
