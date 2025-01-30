import Image from "next/image";
import { Suspense } from "react";
import { getImageSize } from "@/data/image/getImageSize";

export default async function MarkdownImageServer({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <Suspense fallback={null}>
      <MarkdownImageServerWrapper src={src} alt={alt} />
    </Suspense>
  );
}

async function MarkdownImageServerWrapper({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  if (!src) {
    return null;
  }

  const { width, height } = await getImageSize(src);

  let clampedWidth = 800;
  let clampedHeight = 0;
  if (width && height) {
    const aspect = width / height;

    clampedWidth = Math.min(800, width);
    clampedHeight = Math.min(height, width / aspect);
  }

  return (
    <Image
      src={src}
      width={clampedWidth}
      height={clampedHeight}
      alt={alt ?? ""}
      className="max-w-full rounded-md"
    />
  );
}
