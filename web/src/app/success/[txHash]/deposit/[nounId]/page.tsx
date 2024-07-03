import SuccessDynamicLayout from "@/components/SuccessDynamicLayout";
import BridgeToBaseDialog from "@/components/dialog/BridgeToBaseDialog";
import { FRAME_SERVER_URL } from "@/utils/constants";

export default function DepositSuccessPage({ params }: { params: { txHash: string; nounId: string } }) {
  return (
    <SuccessDynamicLayout
      frameUrl={`${FRAME_SERVER_URL}/deposit/1/${params.nounId}/${params.txHash}`}
      title="Converted!"
      subtitle={`You deposited Noun ${params.nounId} for 1,000,000 $nouns! Let everyone know your old Noun is available for swapping!`}
      socialShareCopy={`I just deposited Noun ${params.nounId} for 1,000,000 $nouns on NounSwap.wtf!\n\nNoun ${params.nounId} is now available for swapping!`}
      secondaryButton={<BridgeToBaseDialog />}
    />
  );
}
