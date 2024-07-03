import Image from "next/image";
import { ReactNode } from "react";
import ShareToFarcaster from "./ShareToFarcaster";

export interface SuccessDynamicLayoutProps {
  frameUrl: string;
  title: string;
  subtitle: string;
  socialShareCopy: string;
  secondaryButton?: ReactNode;
}

export default function SuccessDynamicLayout({
  frameUrl,
  title,
  subtitle,
  socialShareCopy,
  secondaryButton,
}: SuccessDynamicLayoutProps) {
  return (
    <div className="flex max-w-[900px] flex-col items-center justify-center gap-[40px] md:flex-row md:gap-[96px]">
      <div className="aspect-square max-h-[400px] w-full max-w-[400px] rounded-[32px] p-[7px] shadow-2xl md:p-[12px]">
        <Image src={`${frameUrl}/image`} alt="" width={400} height={400} className="h-full w-full rounded-[24px]" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 pb-[120px] md:pb-0">
          <span className="label-lg text-semantic-positive">Success!</span>
          <div>
            <h1>{title}</h1>
            <div className="paragraph-lg">{subtitle}</div>
          </div>
        </div>
        <div className="border-border-secondary fixed bottom-0 left-0 flex w-screen flex-col gap-2 border-t-2 bg-white px-4 py-2 md:static md:w-auto md:border-none md:p-0">
          <ShareToFarcaster text={socialShareCopy} embeds={[frameUrl]} />
          {secondaryButton}
        </div>
      </div>
    </div>
  );
}
