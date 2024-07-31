import AdvertisingBanner from ".";

export default function SharkPickleConeAdvertisingBanner() {
  return (
    <AdvertisingBanner
      href="https://zora.co/collect/zora:0x665ff4fe759756fe891a6cd92654246d1a1f16d4/3?referrer=0x65599970Af18EeA5f4ec0B82f23B018fd15EBd11"
      leftImgSrc={{
        desktop: "/advertising/shark-pickle-cone/desktop/left.png",
        mobile: "/advertising/shark-pickle-cone/mobile/left.png",
      }}
      rightImgSrc={{
        desktop: "/advertising/shark-pickle-cone/desktop/right.png",
        mobile: "/advertising/shark-pickle-cone/mobile/right.png",
      }}
    >
      <div className="flex min-w-0 shrink flex-col items-center justify-center">
        <span className="label-sm text-semantic-warning pb-2">Featured Mint</span>
        <span className="font-londrina text-[32px] text-white md:text-[36px] md:leading-[44px]">
          Shark, Pickle, Cone
        </span>
        <div className="text-background-dark label-sm mt-3 rounded-full bg-white px-4 py-1.5 hover:brightness-90">
          Mint on Zora
        </div>
      </div>
    </AdvertisingBanner>
  );
}
