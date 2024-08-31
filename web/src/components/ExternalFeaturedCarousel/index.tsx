"use client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ExternalFeaturedCard, ExternalFeaturedCardButton } from "./ExternalFeaturedCard";
import { ReactNode } from "react";

interface BannerItem {
  node: ReactNode;
}

const BANNER_ITEMS: BannerItem[] = [
  {
    node: (
      <ExternalFeaturedCard
        href="https://nounstown.wtf"
        leftImgSrc={{
          desktop: "/featured/nouns-town/desktop/left.png",
          mobile: "/featured/nouns-town/mobile/left.png",
        }}
        rightImgSrc={{
          desktop: "/featured/nouns-town/desktop/right.png",
          mobile: "/featured/nouns-town/mobile/right.png",
        }}
        className="bg-[#76CEF6]"
      >
        <div className="label-sm text-[#0949A9]">Featured event</div>
        <h3>Nouns Town LA</h3>
        <ExternalFeaturedCardButton>Visit Site</ExternalFeaturedCardButton>
      </ExternalFeaturedCard>
    ),
  },
  {
    node: (
      <ExternalFeaturedCard
        href="https://cares.tv/products/noun-swap-staff-t-shirt"
        leftImgSrc={{
          desktop: "/featured/nounswap-shirt/desktop/left.png",
          mobile: "/featured/nounswap-shirt/mobile/left.png",
        }}
        rightImgSrc={{
          desktop: "/featured/nounswap-shirt/desktop/right.png",
          mobile: "/featured/nounswap-shirt/mobile/right.png",
        }}
        className="bg-[#F6A376]"
      >
        <div className="label-sm text-[#C42F3D]">Featured product</div>
        <h3>NounSwap Tee</h3>
        <ExternalFeaturedCardButton>Get a shirt</ExternalFeaturedCardButton>
      </ExternalFeaturedCard>
    ),
  },
  {
    node: (
      <ExternalFeaturedCard
        href="https://zora.co/collect/zora:0x665ff4fe759756fe891a6cd92654246d1a1f16d4/3?referrer=0x65599970Af18EeA5f4ec0B82f23B018fd15EBd11"
        leftImgSrc={{
          desktop: "/featured/shark-pickle-cone/desktop/left.png",
          mobile: "/featured/shark-pickle-cone/mobile/left.png",
        }}
        rightImgSrc={{
          desktop: "/featured/shark-pickle-cone/desktop/right.png",
          mobile: "/featured/shark-pickle-cone/mobile/right.png",
        }}
        className="bg-background-dark"
      >
        <div className="label-sm text-semantic-warning">Featured mint</div>
        <h3 className="text-white">Shark, Pickle, Cone</h3>
        <ExternalFeaturedCardButton>Mint on Zora</ExternalFeaturedCardButton>
      </ExternalFeaturedCard>
    ),
  },
];

export default function ExternalFeaturedCarousel() {
  return (
    <Carousel opts={{ loop: true, align: "start" }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}>
      <CarouselContent className="-ml-4 flex">
        {BANNER_ITEMS.map((item, i) => (
          <CarouselItem className="h-fit basis-full pl-4 md:basis-1/2" key={i}>
            {item.node}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
