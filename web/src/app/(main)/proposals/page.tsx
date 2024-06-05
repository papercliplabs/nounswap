import { ProposalTable } from "@/components/ProposalTable";

export default function Proposals() {
  return (
    <div className="flex w-full max-w-4xl flex-col items-start justify-start self-center">
      <h1>My Props</h1>
      <span className="pb-10">All of your Swap Props created with NounSwap</span>
      <ProposalTable />
    </div>
  );
}
