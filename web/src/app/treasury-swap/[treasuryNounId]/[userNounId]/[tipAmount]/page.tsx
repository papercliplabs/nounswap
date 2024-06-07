import DynamicSwapLayout from "@/components/DynamicSwapLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getNounById } from "@/data/noun/getNounById";
import { Suspense } from "react";
import TreasurySwapStepTwo from "./TreasurySwapStepTwo";

export default function TreasurySwapStepTwoPage({
  params,
}: {
  params: { treasuryNounId: string; userNounId: string; tipAmount: bigint };
}) {
  return (
    <DynamicSwapLayout
      currentStep={2}
      numSteps={2}
      title="Give a reason"
      subtitle="Share why you want this noun."
      backButtonHref={`/treasury-swap/${params.treasuryNounId}`}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <DataWrapper
          treasuryNounId={params.treasuryNounId}
          userNounId={params.userNounId}
          tipAmount={params.tipAmount}
        />
      </Suspense>
    </DynamicSwapLayout>
  );
}

async function DataWrapper({
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

  return <TreasurySwapStepTwo userNoun={userNoun} treasuryNoun={treasuryNoun} tip={tipAmount} />;
}
