"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

export default function MarkdownImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const img = new window.Image();
    img.src = src ?? "";
    img.onload = () => {
      setSize({ width: img.width, height: img.height });
    };
  }, [src]);

  if (!size) {
    return <Skeleton className="h-48 w-full rounded-md" />;
  } else {
    return (
      <Image
        src={src ?? ""}
        width={size?.width}
        height={size?.height}
        alt={alt ?? ""}
        className="max-w-full rounded-md"
      />
    );
  }
}
