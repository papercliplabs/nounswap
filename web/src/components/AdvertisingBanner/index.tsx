import { cn } from "@/utils/shadcn";
import Image from "next/image";
import { ComponentProps } from "react";
import { LinkExternal } from "@/components/ui/link";

interface AdvertisingBannerProps extends ComponentProps<typeof LinkExternal> {
  leftImgSrc: {
    desktop: string;
    mobile: string;
  };
  rightImgSrc: {
    desktop: string;
    mobile: string;
  };
}

export default function AdvertisingBanner({
  href,
  leftImgSrc,
  rightImgSrc,
  className,
  children,
  ...props
}: AdvertisingBannerProps) {
  return (
    <LinkExternal
      href={href}
      className={cn("bg-background-dark flex h-[136px] w-full justify-between overflow-hidden rounded-2xl", className)}
      {...props}
    >
      <div className="relative flex h-full min-w-fit shrink-0 grow">
        {/* Lazy loading won't load hidden image (which is desired) */}
        <Image src={leftImgSrc.desktop} fill alt="" className="hidden object-contain object-left-bottom md:block" />
        <Image src={leftImgSrc.mobile} fill alt="" className="block object-contain object-left-bottom md:hidden" />
      </div>
      {children}
      <div className="relative flex h-full min-w-fit shrink-0 grow">
        {/* Lazy loading won't load hidden image (which is desired) */}
        <Image src={rightImgSrc.desktop} fill alt="" className="hidden object-contain object-right-bottom md:block" />
        <Image src={rightImgSrc.mobile} fill alt="" className="block object-contain object-right-bottom md:hidden" />
      </div>
    </LinkExternal>
  );
}
