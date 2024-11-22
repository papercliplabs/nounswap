import { unstable_cache } from "next/cache";

type Callback = (...args: any[]) => Promise<any>;
export function safeUnstableCache<T extends Callback>(
  cb: T,
  keyParts?: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
) {
  return async function (...args: Parameters<T>) {
    try {
      return await unstable_cache(cb, keyParts, options)(...args);
    } catch (e) {
      console.error(`safeUnstableCache error ${e}`);
      return null;
    }
  } as (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null>;
}
