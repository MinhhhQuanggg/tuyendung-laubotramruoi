import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOBS_DATA, getJobBySlug } from "@/data/jobs";
import { getJobByIdOrSlug } from "@/lib/jobs-store";
import { siteConfig } from "@/config/site";
import { generateJobPostingSchema } from "@/lib/schema";
import JobDetailView from "@/components/job-detail/JobDetailView";

interface JobDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return JOBS_DATA.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = (await getJobByIdOrSlug(params.slug)) || getJobBySlug(params.slug);
  if (!job) {
    return {
      title: "Không tìm thấy công việc | Tuyển Dụng Lẩu Bò Trăm Rưỡi",
    };
  }

  const title = `${job.title} | Tuyển Dụng Lẩu Bò Trăm Rưỡi`;
  const description = `Tuyển dụng ${job.title} tại TP.HCM. Mức lương: ${job.salaryDisplay}. Đào tạo nghề F&B miễn phí có lương, phỏng vấn đi làm ngay tại hệ thống Lẩu Bò Trăm Rưỡi.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/viec-lam/${job.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/viec-lam/${job.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = (await getJobByIdOrSlug(params.slug)) || getJobBySlug(params.slug);
  if (!job) {
    notFound();
  }

  const jsonLd = generateJobPostingSchema(job);

  return (
    <>
      {/* Schema JobPosting phục vụ Google Jobs chuẩn 100% */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Trang chi tiết phía Client độc lập hoàn toàn với Admin: luôn hiển thị giao diện Client (có Menu, Footer từ AppLayout, không thanh công cụ Admin) */}
      <JobDetailView job={job} isAdmin={false} />
    </>
  );
}