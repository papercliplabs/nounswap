import { getNounById } from "@/data/noun/getNounById";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserNounSelect from "../../../components/UserNounSelect";
import DynamicSwapLayout from "@/components/DynamicSwapLayout";
import { isAddressEqual } from "viem";
import { CHAIN_CONFIG } from "@/config";

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

  if (!isAddressEqual(treasuryNoun.owner, CHAIN_CONFIG.addresses.nounsTreasury)) {
    return <>Not a treasury noun.</>;
  }

  return <UserNounSelect treasuryNoun={treasuryNoun} />;
}
