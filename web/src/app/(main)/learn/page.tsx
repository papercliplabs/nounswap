import { Skeleton } from "@/components/ui/skeleton";
import { getPostOverviews } from "@/data/cms/getPostOverviews";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function LearnPage() {
  return (
    <div className="flex w-full max-w-[800px] flex-col justify-center gap-[120px] px-6 pt-[72px] md:px-10">
      <section className="flex flex-col items-center justify-center gap-10">
        <Image
          src="/learn.png"
          width={332}
          height={104}
          alt="Learn Nouns DAO"
        />
        <div className="flex flex-col gap-3 text-center">
          <h1>Learn about Nouns DAO</h1>
          <p className="text-content-secondary paragraph-lg">
            Build your Nouns knowledge with these guides, tutorials, and
            explainers.
          </p>
        </div>
      </section>

      <div className="grid w-full grid-cols-1 gap-[44px_16px] md:grid-cols-2">
        <Suspense
          fallback={Array(10)
            .fill(0)
            .map((_, i) => (
              <Skeleton className="h-[340px] w-full rounded-[32px]" key={i} />
            ))}
        >
          <LearnPostGridWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function LearnPostGridWrapper() {
  const postOverviews = await getPostOverviews();

  return (
    <>
      {postOverviews?.map((overview) => (
        <Link
          href={`/learn/${overview.slug}`}
          className="flex h-[340px] w-full flex-col overflow-hidden rounded-[32px] transition-all hover:brightness-90"
          key={overview.id}
        >
          <Image
            src={overview.heroImage.url ?? ""}
            width={400}
            height={225}
            className="aspect-video h-[212px] w-full object-cover"
            alt={overview.heroImage.alt}
          />
          <div className="grow bg-background-secondary p-6">
            <h2 className="heading-4">{overview.title}</h2>
          </div>
        </Link>
      ))}
    </>
  );
}
