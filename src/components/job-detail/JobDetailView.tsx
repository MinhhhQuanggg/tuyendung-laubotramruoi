"use client";

import { useEffect } from "react";
import Link from "next/link";
import { JobItem } from "@/types/job";
import StickyJobSidebar from "@/components/job-detail/StickyJobSidebar";
import { JobDetailImages, JobDetailVideo } from "@/components/job-detail/JobDetailMedia";
import { ChevronRight } from "lucide-react";
import { trackJobView } from "@/lib/analytics";

interface JobDetailViewProps {
  job: JobItem;
  isAdmin?: boolean;
}

export default function JobDetailView({ job, isAdmin = false }: JobDetailViewProps) {
  useEffect(() => {
    if (job?.title && !isAdmin) {
      trackJobView(job.title, job.id);
    }
  }, [job?.title, job?.id, isAdmin]);

  const hasImages = Boolean(
    job.images && job.images.filter((src) => Boolean(src && src.trim())).length > 0
  );

  return (
    <>
      {/* Header Banner với Breadcrumb - Gradient Option A */}
      <section className="relative bg-gradient-to-r from-[#8E1B24] via-[#5c1015] to-[#3A0910] text-white py-3.5 sm:py-4 overflow-hidden border-b border-[#C9963F]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-amber-200/80">
            <Link href="/" className="hover:text-white transition">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/#danh-sach-viec-lam" className="hover:text-white transition">
              Việc làm
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{job.title}</span>
          </nav>
        </div>
      </section>

      {/* Bố cục: 3 cột khi có ảnh, 2 cột cân đối thoáng rộng khi không có ảnh */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className={`grid grid-cols-1 ${hasImages ? "lg:grid-cols-12" : "lg:grid-cols-12 max-w-5xl mx-auto"} gap-6 xl:gap-8 items-start`}>
          
          {/* CỘT 1 (BÊN TRÁI): Logo thương hiệu & Video thực tế */}
          <div className={`order-2 lg:order-1 ${hasImages ? "lg:col-span-3 lg:col-start-1" : "lg:col-span-4 lg:col-start-1"} lg:row-start-1 lg:sticky lg:top-6 self-start space-y-4 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1`}>
            {/* Logo thương hiệu */}
            <StickyJobSidebar job={job} />

            {/* 1 Khung video thực tế khung dọc 3:4 */}
            <JobDetailVideo
              videoUrl={job.videoUrl}
              videoPoster={job.videoPoster}
            />
          </div>

          {/* CỘT 2: Bảng mô tả công việc & FAQ */}
          <div className={`order-1 lg:order-2 ${hasImages ? "lg:col-span-5 lg:col-start-4" : "lg:col-span-8 lg:col-start-5"} lg:row-start-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100`}>
            {/* Badge & Tên vị trí */}
            <div className="border-b border-gray-100 pb-5 mb-6">
              {/* Pill Badges phân loại đưa lên trên tiêu đề thẻ: hiển thị từ Độ tuổi & Kinh nghiệm */}
              {(() => {
                const reqBadges = [job.ageRequirement, job.experienceDisplay].filter(Boolean);
                const displayBadges = reqBadges.length > 0
                  ? reqBadges
                  : (job.badges && job.badges.length > 0
                    ? job.badges
                    : job.badge
                    ? job.badge.split(",").map((s) => s.trim())
                    : [job.category]);

                return (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {displayBadges.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-0.5 rounded-full text-[11px] sm:text-[12px] font-semibold bg-brand-50 text-brand-800 border border-brand-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                );
              })()}
              <h1 className="text-[24px] sm:text-[28px] lg:text-[26px] xl:text-[30px] font-black leading-tight text-gray-900">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 text-[14px] sm:text-[16px] font-bold text-brand-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80 shadow-xs">
                  💰 {job.salaryDisplay}
                </span>
              </div>
            </div>

            {/* Nội dung tuyển dụng ngắn gọn trực quan theo mẫu bài post thực tế */}
            {job.concisePost ? (
              <div className="space-y-5">
                {/* Đoạn mô tả nội dung công việc */}
                <p className="text-[16px] sm:text-[17px] text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                  {job.concisePost.intro}
                </p>

                <div className="space-y-3.5 pt-1">
                  {/* Danh sách các gạch đầu dòng ngắn gọn với Icon / Emoji chuẩn mẫu */}
                  {job.concisePost.points &&
                    job.concisePost.points
                      .filter((point) => !job.concisePost?.intro?.includes(point.content))
                      .map((point, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-[16px] sm:text-[17px] text-gray-800 leading-relaxed"
                        >
                          <span className="text-xl shrink-0 mt-0.5 select-none">{point.icon}</span>
                          <div>
                            {point.label && (
                              <span className="font-bold text-gray-950 mr-1.5">
                                {point.label}
                              </span>
                            )}
                            <span className="whitespace-pre-line">{point.content}</span>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Fallback nếu không có concisePost */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Mô tả công việc</h3>
                  <ul className="space-y-2 text-gray-700 text-[15px] sm:text-[16px]">
                    {job.responsibilities && job.responsibilities.length > 0 ? (
                      job.responsibilities.map((res, i) => <li key={i}>• {res}</li>)
                    ) : (
                      <li>Đang cập nhật nội dung công việc.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* CỘT 3 (BÊN PHẢI): 2 Cột ảnh thực tế dạng thumbnail thu nhỏ 50%, chỉ hiển thị khi có ảnh */}
          {hasImages && (
            <div className="order-3 lg:order-3 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:sticky lg:top-6 self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
              <JobDetailImages images={job.images} />
            </div>
          )}

        </div>
      </div>
    </>
  );
}
