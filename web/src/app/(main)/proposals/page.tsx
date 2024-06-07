import { Proposals } from "./Proposals";

export default function ProposalsPage() {
  return (
    <div className="flex w-full max-w-4xl flex-col items-start justify-start self-center">
      <h1>My Props</h1>
      <span className="pb-10">All of your Swap Props created with NounSwap</span>
      <Proposals />
    </div>
  );
}
