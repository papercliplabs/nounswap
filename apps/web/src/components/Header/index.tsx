import Link from "next/link";
import WalletButton from "../WalletButton";
import { CurrentAuctionSmall } from "../CurrentAuction";
import HidingHeader from "./HidingHeader";
import DesktopNav from "../Nav/DesktopNav";
import { NounSwapLogoLink } from "../NounSwapLogoLink";
import { CurrentAuctionPrefetchWrapper } from "../CurrentAuction/CurrentAuctionPrefetchWrapper";

export function Header() {
  return (
    <HidingHeader>
      <div className="shadow-bottom-only flex w-full flex-row justify-between bg-white px-4 py-2 md:px-8">
        <div className="flex items-center gap-6 md:flex-1">
          <NounSwapLogoLink />
          <DesktopNav />
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 text-gray-600">
          <Link
            href="/"
            className="rounded-lg border-transparent p-2 transition-all hover:bg-background-secondary/50"
          >
            <CurrentAuctionPrefetchWrapper>
              <CurrentAuctionSmall />
            </CurrentAuctionPrefetchWrapper>
          </Link>
          <WalletButton />
        </div>
      </div>
    </HidingHeader>
  );
}
