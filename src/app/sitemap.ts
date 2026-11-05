import { siteConfig } from "@/config/site";
import { JOBS_DATA } from "@/data/jobs";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const jobUrls = JOBS_DATA.map((job) => ({
    url: `${siteConfig.url}/viec-lam/${job.slug}`,
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
