import Link from "next/link";
import Icon from "./ui/Icon";
import Image from "next/image";
import { LinkExternal } from "./ui/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MailingListForm from "./MailingListForm";
import { NounSwapLogoLink } from "./NounSwapLogoLink";

const NAV_ITEMS: { name: string; href: string; external?: boolean }[][] = [
  [
    { name: "Explore", href: "/explore" },
    { name: "Stats", href: "/stats" },
    { name: "Convert", href: "/convert" },
  ],
  [
    { name: "Bid", href: "/" },
    { name: "Shop", href: "/explore?buyNow=1" },
    { name: "Swap", href: "/explore?instantSwap=1" },
    { name: "Trade", href: "/explore?onlyTreasuryNouns=1" },
  ],
  [
    {
      name: "Contact us",
      href: "https://paperclip.xyz/contact",
      external: true,
    },
    { name: "FAQ's", href: "/#faq" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ],
];

const SOCIALS: { name: string; icon: string; href: string }[] = [
  { name: "X", icon: "/socials/x.svg", href: "https://x.com/PaperclipLabs" },
  {
    name: "Farcaster",
    icon: "/socials/farcaster.svg",
    href: "https://warpcast.com/nounswap",
  },
];

export default function Footer() {
  return (
    <footer className="mt-[80px] flex w-full flex-col items-center justify-center gap-14 bg-background-dark pb-[60px] text-content-secondary md:pb-0 pwa:pb-[72px]">
      <div className="flex w-full flex-col justify-between gap-20 px-4 pt-14 md:flex-row md:px-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 paragraph-lg">
            <NounSwapLogoLink darkMode />
            <span className="pt-[4px]">for Nouns DAO</span>
          </div>
          <div className="flex max-w-[448px] flex-col gap-5">
            <span>
              Join our mailing list to stay in the loop with our newest feature
              releases and tips and tricks for navigating NounSwap.
            </span>
            <MailingListForm />
          </div>
          <div className="flex gap-4">
            {SOCIALS.map((item) => (
              <LinkExternal
                href={item.href}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-content-secondary"
                key={item.name}
              >
                <Image src={item.icon} width={20} height={20} alt={item.name} />
              </LinkExternal>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-12 text-white md:flex-row md:gap-[100px] lg:gap-[150px]">
          {NAV_ITEMS.map((items, i) => (
            <div key={i} className="flex flex-col gap-4">
              {items.map((item, j) =>
                item.external ? (
                  <LinkExternal
                    href={item.href}
                    key={j}
                    className="transition-all hover:text-content-secondary hover:brightness-100"
                  >
                    {item.name}
                  </LinkExternal>
                ) : (
                  <Link
                    href={item.href}
                    key={j}
                    className="transition-all hover:text-content-secondary"
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-4 md:px-10">
        Made by{" "}
        <LinkExternal href="https://paperclip.xyz" className="underline">
          Paperclip Labs
        </LinkExternal>
      </div>
      <div className="flex w-full min-w-0 justify-between">
        <Image
          src="/footer-left.png"
          width={208}
          height={135}
          alt="Nouns"
          className="h-[67.5px] w-[104px] md:h-[135px] md:w-[208px]"
        />
        <Image
          src="/footer-right.png"
          width={208}
          height={135}
          alt="Nouns"
          className="h-[67.5px] w-[104px] md:h-[135px] md:w-[208px]"
        />
      </div>
    </footer>
  );
}
