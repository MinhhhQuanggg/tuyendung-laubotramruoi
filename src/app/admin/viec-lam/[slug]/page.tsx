import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOBS_DATA, getJobBySlug } from "@/data/jobs";
import { getJobByIdOrSlug } from "@/lib/jobs-store";
import JobDetailView from "@/components/job-detail/JobDetailView";

interface AdminJobDetailPageProps {
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

export async function generateMetadata({ params }: AdminJobDetailPageProps): Promise<Metadata> {
  const job = (await getJobByIdOrSlug(params.slug)) || getJobBySlug(params.slug);
  if (!job) {
    return {
      title: "Không tìm thấy công việc | Admin Tuyển Dụng Lẩu Bò Trăm Rưỡi",
    };
  }

  return {
    title: `[Quản Trị] ${job.title} | Lẩu Bò Trăm Rưỡi`,
  };
}

export default async function AdminJobDetailPage({ params }: AdminJobDetailPageProps) {
  const job = (await getJobByIdOrSlug(params.slug)) || getJobBySlug(params.slug);
  if (!job) {
    notFound();
  }

  return <JobDetailView job={job} isAdmin={true} />;
}