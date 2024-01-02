import WalletButton from "@/components/WalletButton";
import Nav from "@/components/Nav";
import Icon from "@/components/ui/Icon";
import HowItWorksDialog from "@/components/dialog/HowItWorksDialog";
import { LinkExternal, LinkInternal } from "@/components/ui/link";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const navInfo = [
    { name: "Explore", href: "/" },
    { name: "My Props", href: "/proposals" },
];

function Header() {
    return (
        <>
            <header className="flex flex-col justify-between items-center w-full border-b-2 border-gray-300 px-4 md:px-10 pt-4 pb-2 gap-4">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex md:flex-1 items-center gap-6">
                        <div className="pr-6 md:border-r-2">
                            <Suspense fallback={<LoadingSpinner />}>
                                <LinkInternal
                                    href="/"
                                    className="text-primary flex flex-row  gap-2 [&>svg]:hover:rotate-12 shrink grow-0 "
                                >
                                    <Icon
                                        icon="repeat"
                                        size={28}
                                        className="transition-all ease-linear fill-gray-900"
                                    />
                                    <h5 className="hidden md:flex">NounSwap</h5>
                                </LinkInternal>
                            </Suspense>
                        </div>
                        <span className="hidden md:flex">
                            <Nav navInfo={navInfo} />
                        </span>
                    </div>
                    <div className="flex-1 flex justify-end gap-1 text-gray-600 items-center">
                        <HowItWorksDialog />
                        <WalletButton />
                    </div>
                </div>
                <div className="flex md:hidden w-full justify-between bg-secondary rounded-2xl p-1">
                    <Nav navInfo={navInfo} />
                </div>
            </header>
        </>
    );
}

function Footer() {
    return (
        <footer className="w-full flex flex-row justify-center items-center gap-1 h-20 py-2 px-10">
            Made for{" "}
            <LinkExternal href="https://nouns.wtf/">
                <Image src="/nouns-icon.png" width={40} height={40} alt="Nouns" />
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
            <main className="flex flex-col px-4 md:px-8 grow justify-start items-start pt-10 pb-4 md:pb-8 gap-10 border-primary">
                {children}
            </main>
            <Footer />
        </>
    );
}
