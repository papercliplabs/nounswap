import { getNounById } from "@/data/noun/getNounById";
import { buildNounImage } from "@/hooks/useNounImage";
import { cn } from "@/utils/shadcn";
import Image from "next/image";
import { ComponentProps, Suspense } from "react";

interface NounImageProps extends Omit<ComponentProps<typeof Image>, "src" | "alt"> {
  nounId: string;
}

export function NounImage({ nounId, ...props }: NounImageProps) {
  return (
    <Suspense fallback={<NounImageImg src="/noun-loading-skull.gif" unoptimized={true} alt="" {...props} />}>
      <NounImageInternal nounId={nounId} {...props} />
    </Suspense>
  );
}

async function NounImageInternal({ nounId, ...props }: NounImageProps) {
  const noun = await getNounById(nounId);
  if (!noun) {
    throw Error(`NounImageInternal - no Noun found - ${nounId}`);
  }

  const imageSrc = buildNounImage(noun, "full");
  return <NounImageImg src={imageSrc} alt="" {...props} />;
}

function NounImageImg({ className, ...props }: ComponentProps<typeof Image>) {
  return (
    <Image
      className={cn("select-none rounded-3xl object-contain object-bottom", className)}
      draggable={false}
      {...props}
    />
  );
}
