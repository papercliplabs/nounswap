import Image from "next/image";
import NavCard from "./NavCard";
import JoinAuction from "./JoinAuction";
import { CurrentAuctionPrefetchWrapper } from "@/components/CurrentAuction/CurrentAuctionPrefetchWrapper";

export default function GetANoun() {
  return (
    <section className="flex w-full min-w-0 flex-col items-center justify-center gap-8 px-6 md:gap-16 md:px-10">
      <div className="flex max-w-[1600px] flex-col items-center justify-center gap-2 px-6 text-center md:px-10">
        <h2>Get a Noun!</h2>
        <div className="max-w-[480px] paragraph-lg">
          Bid, buy, or explore fractional ownership—choose the best way to make
          a Noun yours.
        </div>
      </div>

      <div className="flex w-full min-w-0 max-w-[1600px] flex-col gap-6 md:flex-row md:gap-10">
        <CurrentAuctionPrefetchWrapper>
          <JoinAuction />
        </CurrentAuctionPrefetchWrapper>
        <NavCard
          href="/explore?buyNow=1"
          iconSrc="/feature/shop/icon.svg"
          buttonLabel="Shop"
          description="Buy a Noun! Shop all major marketplaces in one place."
          className="bg-background-secondary"
        >
          <Image
            src="/feature/shop/main.png"
            width={400}
            height={332}
            alt="Buy Secondary Nouns"
            className="h-[332px] w-[400px] object-cover"
          />
        </NavCard>
        <NavCard
          href="/convert"
          iconSrc="/feature/redeem/icon.svg"
          buttonLabel="Redeem"
          description="Collect $nouns tokens! 1,000,000 $nouns = 1 Noun!"
          className="bg-blue-400 text-white"
        >
          <Image
            src="/feature/redeem/main.png"
            width={400}
            height={332}
            alt="Redeem $nouns"
            className="h-[332px] w-[400px] object-cover"
          />
        </NavCard>
      </div>
    </section>
  );
}
