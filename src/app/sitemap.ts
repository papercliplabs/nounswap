import { getPostOverviews } from "@/data/cms/getPostOverviews";
import { getProposalOverviews } from "@/data/ponder/governance/getProposalOverviews";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postOverviews = await getPostOverviews();
  const learnBlogs = (postOverviews?.map((post) => ({
    url: `https://www.nounswap.wtf/learn/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  })) ?? []) as MetadataRoute.Sitemap;

  const proposalOverviews = await getProposalOverviews();
  const proposals = (proposalOverviews?.map((proposal) => ({
    url: `https://www.nounswap.wtf/vote/${proposal.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  })) ?? []) as MetadataRoute.Sitemap;

  return [
    {
      url: "https://www.nounswap.wtf",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://www.nounswap.wtf/vote",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.nounswap.wtf/$nouns",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: "https://www.nounswap.wtf/learn",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.nounswap.wtf/explore",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://www.nounswap.wtf/convert",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.nounswap.wtf/stats/treasury",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.nounswap.wtf/stats/leaderboard",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://www.nounswap.wtf/stats/activity",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.nounswap.wtf/stats/clients",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...proposals,
    ...learnBlogs,
  ];
}
