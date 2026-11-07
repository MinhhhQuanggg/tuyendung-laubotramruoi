import { siteConfig } from "@/config/site";
import { getJobsList } from "@/lib/jobs-store";
import { getJobUrl } from "@/lib/job-url";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobsList();
  const jobUrls = jobs
    .filter((j) => j.isActive)
    .map((job) => ({
      url: `${siteConfig.url}${getJobUrl(job)}`,
      lastModified: new Date(job.datePosted || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/ve-chung-toi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/dieu-khoan-su-dung`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticPages, ...jobUrls];
}
