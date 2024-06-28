import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { HTMLAttributes } from "react";
import { cn } from "@/utils/shadcn";

interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  cta: string;
  imgSrc: string;
  onCtaClick: () => void;
}

export default function FeatureCard({
  title,
  description,
  cta,
  onCtaClick,
  imgSrc,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "label-md bg-background-secondary relative flex h-[160px] flex-1 justify-between overflow-hidden rounded-2xl",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 py-6 pl-6 text-start">
        <div>
          <span>{title}.</span> <span className="text-content-secondary">{description}</span>
        </div>
        <Button variant="secondary" className="h-8 w-fit rounded-full px-5 py-3" onClick={onCtaClick}>
          {cta}
        </Button>
      </div>
      <Image src={imgSrc} alt="" width={140} height={160} className="h-[160px] w-[140px]" />
    </div>
  );
}
