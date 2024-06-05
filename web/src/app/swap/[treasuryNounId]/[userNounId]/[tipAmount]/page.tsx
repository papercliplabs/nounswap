import DynamicSwapLayout from "@/components/DynamicSwapLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import SwapReasonSelect from "@/components/SwapReasonSelect";
import { getNounById } from "@/data/noun/getNounById";
import { Suspense } from "react";

export default function SwapReasonPage({
  params,
}: {
  params: { treasuryNounId: string; userNounId: string; tipAmount: bigint };
}) {
  return (
    <DynamicSwapLayout
      currentStep={2}
      title="Give a reason"
      subtitle="Share why you want this noun."
      backButtonHref={`/swap/${params.treasuryNounId}`}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <SwapReasonContainer
          treasuryNounId={params.treasuryNounId}
          userNounId={params.userNounId}
          tipAmount={params.tipAmount}
        />
      </Suspense>
    </DynamicSwapLayout>
  );
}

async function SwapReasonContainer({
  treasuryNounId,
  userNounId,
  tipAmount,
}: {
  treasuryNounId: string;
  userNounId: string;
  tipAmount: bigint;
}) {
  const treasuryNoun = await getNounById(treasuryNounId);
  const userNoun = await getNounById(userNounId);

  if (!treasuryNoun || !userNoun) {
    return <>Nouns don{"'"}t exists!</>;
  }

  return <SwapReasonSelect userNoun={userNoun} treasuryNoun={treasuryNoun} tip={tipAmount} />;
}
