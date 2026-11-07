import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobsList, getJobByPath } from "@/lib/jobs-store";
import { getCategorySlug, getCleanJobSlug, getJobUrl } from "@/lib/job-url";
import { siteConfig } from "@/config/site";
import { generateJobPostingSchema } from "@/lib/schema";
import JobDetailView from "@/components/job-detail/JobDetailView";

interface JobDetailPageProps {
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
    // 1. Phân cấp 2 phân đoạn chuẩn: /viec-lam/full-time/phu-bep
    if (catSlug && cleanSlug) {
      params.push({ slug: [catSlug, cleanSlug] });
    }
    // 2. Slug danh mục cha trực tiếp (ví dụ /viec-lam/part-time)
    if (catSlug) {
      params.push({ slug: [catSlug] });
    }
    // 3. Phân đoạn 1 slug gốc dự phòng: /viec-lam/phu-bep-full-time
    params.push({ slug: [job.slug] });
  }

  return params;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const slugArray = params.slug || [];
  if (slugArray.length === 0 || slugArray[0] === "xem-truoc") {
    return { title: "Không tìm thấy công việc | Tuyển Dụng Lẩu Bò Trăm Rưỡi" };
  }

  const job =
    slugArray.length === 1
      ? await getJobByPath(slugArray[0])
      : await getJobByPath(slugArray[0], slugArray[1]);

  if (!job) {
    return {
      title: "Không tìm thấy công việc | Tuyển Dụng Lẩu Bò Trăm Rưỡi",
    };
  }

  const jobUrl = getJobUrl(job);
  const title = `${job.title} | Tuyển Dụng Lẩu Bò Trăm Rưỡi`;
  const description = `Tuyển dụng ${job.title} tại TP.HCM. Mức lương: ${job.salaryDisplay}. Đào tạo nghề F&B miễn phí có lương, phỏng vấn đi làm ngay tại hệ thống Lẩu Bò Trăm Rưỡi.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}${jobUrl}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${jobUrl}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const slugArray = params.slug || [];
  if (slugArray.length === 0 || slugArray[0] === "xem-truoc") {
    notFound();
  }

  const job =
    slugArray.length === 1
      ? await getJobByPath(slugArray[0])
      : await getJobByPath(slugArray[0], slugArray[1]);

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
