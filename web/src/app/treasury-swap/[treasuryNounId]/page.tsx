import { getNounById, getNounByIdUncached } from "@/data/noun/getNounById";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import DynamicSwapLayout from "@/components/DynamicSwapLayout";
import { isAddressEqual } from "viem";
import { CHAIN_CONFIG } from "@/config";
import TreasurySwapStepOne from "./TreasurySwapStepOne";
import { SomethingWentWrong } from "@/components/SomethingWentWrong";

export default function TreasurySwapStepOnePage({ params }: { params: { chain: number; treasuryNounId: string } }) {
  return (
    <DynamicSwapLayout
      currentStep={1}
      numSteps={2}
      title="Create your offer"
      subtitle="Select your Noun and tip."
      backButtonHref="/"
    >
      <Suspense fallback={<LoadingSpinner />}>
        <DataWrapper treasuryNounId={params.treasuryNounId} />
      </Suspense>
    </DynamicSwapLayout>
  );
}

async function DataWrapper({ treasuryNounId }: { treasuryNounId: string }) {
  const treasuryNoun = await getNounByIdUncached(treasuryNounId);

  if (!treasuryNoun) {
    return <SomethingWentWrong message={`Noun ${treasuryNounId} doesn't exists.`} returnHref="/" />;
  }

  if (!isAddressEqual(treasuryNoun.owner, CHAIN_CONFIG.addresses.nounsTreasury)) {
    return <SomethingWentWrong message={`Noun ${treasuryNounId} is not owned by the Nouns Treasury.`} returnHref="/" />;
  }

  return <TreasurySwapStepOne treasuryNoun={treasuryNoun} />;
}
