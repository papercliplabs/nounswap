import LoadingSkeletons from "@/components/LoadingSkeletons";
import FilteredProposalOverviews from "@/components/Proposal/FilteredProposalOverviews";
import SearchProvider, { SearchInput } from "@/components/Search";
import { getProposalOverviews } from "@/data/ponder/governance/getProposalOverviews";
import { Suspense } from "react";

export default function VotePage() {
  return (
    <SearchProvider>
      <div className="flex w-full max-w-[780px] flex-col gap-8 p-6 pb-20 md:p-10 md:pb-20">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <h1 className="heading-2">Nouns DAO Governance</h1>
            <p>Nouns can vote on proposals or delegate their vote.</p>
          </div>
          <SearchInput
            placeholder="Search proposals"
            className="md:max-w-[260px]"
          />
        </div>
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-4">
            <h2 className="heading-6">Active</h2>
            <Suspense
              fallback={
                <LoadingSkeletons
                  count={3}
                  className="h-[85px] w-full rounded-[16px]"
                />
              }
            >
              <ActiveProposalWrapper />
            </Suspense>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="heading-6">Upcoming</h2>
            <Suspense
              fallback={
                <LoadingSkeletons
                  count={3}
                  className="h-[85px] w-full rounded-[16px]"
                />
              }
            >
              <UpcomingProposalWrapper />
            </Suspense>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="heading-6">Past</h2>
            <Suspense
              fallback={
                <LoadingSkeletons
                  count={20}
                  className="h-[85px] w-full rounded-[16px]"
                />
              }
            >
              <PastProposalWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

async function ActiveProposalWrapper() {
  const proposalOverviews = await getProposalOverviews();
  const activeProposals = proposalOverviews.filter((p) => p.state == "active");

  return (
    <FilteredProposalOverviews overviews={activeProposals} type="active" />
  );
}

async function UpcomingProposalWrapper() {
  const proposalOverviews = await getProposalOverviews();
  const upcomingProposals = proposalOverviews.filter(
    (p) => p.state == "updateable" || p.state == "pending",
  );

  return (
    <FilteredProposalOverviews overviews={upcomingProposals} type="upcoming" />
  );
}

async function PastProposalWrapper() {
  const proposalOverviews = await getProposalOverviews();
  const pastProposals = proposalOverviews
    .filter(
      (p) =>
        p.state != "active" && p.state != "updateable" && p.state != "pending",
    )
    .reverse();

  return (
    <FilteredProposalOverviews overviews={pastProposals} type="upcoming" />
  );
}
