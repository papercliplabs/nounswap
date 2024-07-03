import SuccessDynamicLayout from "@/components/SuccessDynamicLayout";
import { FRAME_SERVER_URL } from "@/utils/constants";

export default function DepositSuccessPage({
  params,
}: {
  params: { txHash: string; fromNounId: string; toNounId: string };
}) {
  return (
    <SuccessDynamicLayout
      frameUrl={`${FRAME_SERVER_URL}/instant-swap/1/${params.fromNounId}/${params.toNounId}/${params.txHash}`}
      title={`You own Noun ${params.toNounId}!`}
      subtitle="Share the news and let everyone know you swapped your Noun!"
      socialShareCopy={`I just swapped Noun ${params.fromNounId} for Noun ${params.toNounId} on NounSwap.wtf!`}
    />
  );
}
