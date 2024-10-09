import SuccessDynamicLayout from "@/components/SuccessDynamicLayout";
import { FRAME_SERVER_URL } from "@/utils/constants";

export default function DepositSuccessPage({ params }: { params: { txHash: string; nounId: string } }) {
  return (
    <SuccessDynamicLayout
      frameUrl={`${FRAME_SERVER_URL}/purchase/1/${params.nounId}/${params.txHash}`}
      title={`You purchased Noun ${params.nounId}!`}
      subtitle={`Share the news and let everyone know you own  a new Noun!`}
      socialShareCopy={`I just purchased Noun ${params.nounId} on NounSwap.wtf!`}
    />
  );
}
