import { getNounById } from "@/data/noun/getNounById";
import { Address } from "viem";
import { getNounsForAddress } from "@/data/noun/getNounsForAddress";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import DynamicSwapLayout from "@/app/swap/[chain]/[treasuryNounId]/_partials/DynamicSwapLayout";
import UserNounSelect from "./_partials/UserNounSelect";

export default function UserNounSelectPage({
  params,
  searchParams,
}: {
  params: { chain: number; treasuryNounId: string };
  searchParams: { address?: Address };
}) {
  return (
    <DynamicSwapLayout
      currentStep={1}
      title="Create your offer"
      subtitle="Select your Noun and tip."
      backButtonHref="/"
    >
      <Suspense fallback={<LoadingSpinner />}>
        <UserNounSelectContainer
          userAddress={searchParams.address}
          treasuryNounId={params.treasuryNounId}
          chain={params.chain}
        />
      </Suspense>
    </DynamicSwapLayout>
  );
}

async function UserNounSelectContainer({
  userAddress,
  treasuryNounId,
  chain,
}: {
  userAddress?: Address;
  treasuryNounId: string;
  chain: number;
}) {
  const treasuryNoun = await getNounById(treasuryNounId);

  if (!treasuryNoun) {
    return <>No treasury noun exists!</>;
  }

  const userNouns = await getNounsForAddress(userAddress!); // Using treasury noun chain, not active one

  return <UserNounSelect userNouns={userNouns} treasuryNoun={treasuryNoun} address={userAddress} />;
}
