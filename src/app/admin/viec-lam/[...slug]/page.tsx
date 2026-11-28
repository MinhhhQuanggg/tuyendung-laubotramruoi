import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getJobsList, getJobByPath } from "@/lib/jobs-store";
import { getCategorySlug, getCleanJobSlug } from "@/lib/job-url";
import JobDetailView from "@/components/job-detail/JobDetailView";

interface AdminJobDetailPageProps {
  params: {
    slug: string[];
  };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const jobs = await getJobsList();
  const params: { slug: string[] }[] = [];

  for (const job of jobs) {
    const catSlug = getCategorySlug(job.parentMenu || job.category);
    const cleanSlug = getCleanJobSlug(job.slug, catSlug);
    // 1. URL 2 phân đoạn chuẩn: /admin/viec-lam/full-time/phu-bep, /admin/viec-lam/quan-ly/quan-ly-vung
    if (catSlug && cleanSlug && catSlug !== cleanSlug) {
      params.push({ slug: [catSlug, cleanSlug] });
    }
    // 2. Slug danh mục cha trực tiếp: /admin/viec-lam/part-time
    if (catSlug) {
      params.push({ slug: [catSlug] });
    }
    // 3. URL 1 phân đoạn gốc: /admin/viec-lam/phu-bep-full-time
    params.push({ slug: [job.slug] });
  }

  return params;
}

export async function generateMetadata({ params }: AdminJobDetailPageProps): Promise<Metadata> {
  const slugArray = params.slug || [];
  if (slugArray.length === 0) {
    return { title: "Không tìm thấy công việc | Admin Tuyển Dụng Lẩu Bò Trăm Rưỡi" };
  }

  const job =
    slugArray.length === 1
      ? await getJobByPath(slugArray[0])
      : await getJobByPath(slugArray[0], slugArray[1]);

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
  const slugArray = params.slug || [];
  if (slugArray.length === 0) {
    notFound();
  }

  // Chuyển hướng nếu truy cập URL cũ /admin/viec-lam/quan-ly/vung
  if (slugArray.length === 2 && slugArray[0] === "quan-ly" && slugArray[1] === "vung") {
    redirect("/admin/viec-lam/quan-ly/quan-ly-vung");
  }

  const job =
    slugArray.length === 1
      ? await getJobByPath(slugArray[0])
      : await getJobByPath(slugArray[0], slugArray[1]);

  if (!job) {
    notFound();
  }

  return <JobDetailView job={job} isAdmin={true} />;
}
