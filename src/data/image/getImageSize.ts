"use server";
import sharp from "sharp";
import https from "https";
import { unstable_cache } from "next/cache";

async function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
  });
}

async function getImageSizeUncached(src: string) {
  try {
    let buffer: Buffer;

    if (src.startsWith("data:image")) {
      // Handle base64 image
      const base64Data = src.split(",")[1];
      buffer = Buffer.from(base64Data, "base64");
    } else {
      // Handle remote image
      buffer = await fetchImageBuffer(src);
    }

    // Extract dimensions
    const { width, height } = await sharp(buffer).metadata();
    return { width, height };
  } catch (e) {
    console.log("Error fetching image size", e);
    return { width: undefined, height: undefined };
  }
}

export const getImageSize = unstable_cache(getImageSizeUncached, [
  "get-image-size",
]);
