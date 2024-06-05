import { getNounById } from "@/data/noun/getNounById";
import { Address } from "viem";
import { getNounsForAddress } from "@/data/noun/getNounsForAddress";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserNounSelect from "../../../components/UserNounSelect";
import DynamicSwapLayout from "@/components/DynamicSwapLayout";

export default function UserNounSelectPage({ params }: { params: { chain: number; treasuryNounId: string } }) {
  return (
    <DynamicSwapLayout
      currentStep={1}
      title="Create your offer"
      subtitle="Select your Noun and tip."
      backButtonHref="/"
    >
      <Suspense fallback={<LoadingSpinner />}>
        <UserNounSelectContainer treasuryNounId={params.treasuryNounId} />
      </Suspense>
    </DynamicSwapLayout>
  );
}

async function UserNounSelectContainer({ treasuryNounId }: { treasuryNounId: string }) {
  const treasuryNoun = await getNounById(treasuryNounId);

  if (!treasuryNoun) {
    return <>No treasury noun exists!</>;
  }

  return <UserNounSelect treasuryNoun={treasuryNoun} />;
}
