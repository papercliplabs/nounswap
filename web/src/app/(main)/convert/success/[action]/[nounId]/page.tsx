import { getNounById } from "@/data/noun/getNounById";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SomethingWentWrong } from "@/components/SomethingWentWrong";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConvertNounGraphic from "@/components/ConvertNounGraphic";
import BridgeToBaseDialog from "@/components/dialog/BridgeToBaseDialog";

export default function ConvertSuccessPage({ params }: { params: { nounId: string; action: string } }) {
  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <Suspense fallback={<LoadingSpinner />}>
        <DataWrapper nounId={params.nounId} action={params.action} />
      </Suspense>
      <div className="item-center border-border-secondary text-content-secondary flex w-screen flex-col-reverse items-center justify-end gap-6 border-t-4 px-4 py-4 md:fixed md:bottom-0 md:flex-row md:bg-white md:px-10 md:py-2">
        <span className="text-center">📸 Take a screenshot and share with the world!</span>
        <Link href="/convert" className="w-full md:w-fit">
          <Button className="w-full">Back to NounSwap</Button>
        </Link>
      </div>
    </div>
  );
}

async function DataWrapper({ nounId, action }: { nounId: string; action: string }) {
  const noun = await getNounById(nounId);

  if (!noun) {
    return <SomethingWentWrong message={`Noun ${nounId} doesn't exist.`} returnHref="/" />;
  }

  if (action != "deposit" && action != "redeem") {
    return <SomethingWentWrong message={`Action ${action} is invalid.`} returnHref="/" />;
  }

  return (
    <div className="items flex w-full grow flex-col items-center gap-4 p-4 pb-[40px] pt-[10vh] text-center">
      <div className="h-[100px]">
        <ConvertNounGraphic noun={noun} action={action} scale={1.5} />
      </div>
      <h1>Converted!</h1>
      {action === "deposit" ? (
        <>
          <span className="paragraph-lg">Congratulations, you deposited Noun {noun.id} for 1,000,000 $nouns!</span>
          <BridgeToBaseDialog />
        </>
      ) : (
        <span className="paragraph-lg">Congratulations, you redeemed 1,000,000 $nouns for Noun {noun.id}!</span>
      )}
    </div>
  );
}
