import SuccessDynamicLayout from "@/components/SuccessDynamicLayout";
import { FRAME_SERVER_URL } from "@/utils/constants";

export default function DepositSuccessPage({ params }: { params: { txHash: string; nounId: string } }) {
  return (
    <SuccessDynamicLayout
      frameUrl={`${FRAME_SERVER_URL}/redeem/1/${params.nounId}/${params.txHash}`}
      title={`You own Noun ${params.nounId}!`}
      subtitle="Share the news and let everyone know you redeemed 1,000,000 $nouns for a Noun!"
      socialShareCopy={`I just redeemed 1,000,000 $nouns for Noun ${params.nounId} on NounSwap.wtf!`}
    />
  );
}
