import { getNounById } from "@/data/noun/getNounById";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessfulNounSwapGraphic } from "@/components/SuccessfulNounSwapGraphic";
import { SomethingWentWrong } from "@/components/SomethingWentWrong";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import WalletButton from "@/components/WalletButton";
import { Button } from "@/components/ui/button";

export default function SwapSuccessPage({ params }: { params: { fromNounId: string; toNounId: string } }) {
  return (
    <div className="flex grow flex-col">
      <div className="flex w-full items-center justify-between px-4 pb-2 pt-4 md:px-10">
        <Suspense fallback={<LoadingSpinner />}>
          <Link href="/" className="text-content-primary flex shrink grow-0 flex-row gap-2 [&>svg]:hover:rotate-12">
            <Icon icon="repeat" size={28} className="fill-gray-900 transition-all ease-linear" />
            <h5 className="hidden md:flex">NounSwap</h5>
          </Link>
        </Suspense>
        <WalletButton />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <DataWrapper fromNounId={params.fromNounId} toNounId={params.toNounId} />
      </Suspense>
      <div className="item-center border-border-secondary text-content-secondary flex w-full flex-col-reverse items-center justify-end gap-6 border-t-4 px-4 py-4 md:fixed md:bottom-0 md:flex-row md:bg-white md:px-10 md:py-2">
        <span className="text-center">📸 Take a screenshot and share with the world!</span>
        <Link href="/" className="w-full md:w-fit">
          <Button className="w-full">Back to NounSwap</Button>
        </Link>
      </div>
    </div>
  );
}

async function DataWrapper({ fromNounId, toNounId }: { fromNounId: string; toNounId: string }) {
  const fromNoun = await getNounById(fromNounId);
  const toNoun = await getNounById(toNounId);

  if (!fromNoun || !toNoun) {
    return <SomethingWentWrong message="One of these nouns doesn't exist." returnHref="/" />;
  }

  return (
    <div className="items flex w-full grow flex-col items-center gap-4 p-4 pt-[10vh]">
      <SuccessfulNounSwapGraphic fromNoun={fromNoun} toNoun={toNoun} />
      <h1>Swapped!</h1>
      <span className="paragraph-lg">Congratulations you now own Noun {toNounId}!</span>
    </div>
  );
}
