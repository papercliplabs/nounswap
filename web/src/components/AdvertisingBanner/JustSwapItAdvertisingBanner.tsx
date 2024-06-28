import Image from "next/image";
import AdvertisingBanner from ".";

export default function JustSwapItAdvertisingBanner() {
  return (
    <AdvertisingBanner
      href="https://zora.co/collect/base:0x64fcefb7e9785d9ab453b9e4a310ab9c8218d298/1"
      leftImgSrc={{
        desktop: "/advertising/just-swap-it-mint/desktop/left.png",
        mobile: "/advertising/just-swap-it-mint/mobile/left.png",
      }}
      rightImgSrc={{
        desktop: "/advertising/just-swap-it-mint/desktop/right.png",
        mobile: "/advertising/just-swap-it-mint/mobile/right.png",
      }}
    >
      <div className="flex min-w-0 shrink flex-col items-center justify-center gap-3">
        <span className="label-sm text-semantic-warning">Instant swaps have arrived!</span>
        <>
          <Image
            src="/advertising/just-swap-it-mint/desktop/just-swap-it.png"
            width={227}
            height={40}
            alt="Just Swap It"
            className="hidden h-auto w-auto md:block"
          />
          <Image
            src="/advertising/just-swap-it-mint/mobile/just-swap-it.png"
            width={182}
            height={32}
            alt="Just Swap It"
            className="block h-auto w-auto md:hidden"
          />
        </>
        <div className="text-background-dark label-sm rounded-full bg-white px-4 py-1.5 hover:brightness-90">
          Mint on Zora
        </div>
      </div>
    </AdvertisingBanner>
  );
}
