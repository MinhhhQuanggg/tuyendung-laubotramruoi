"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { JobItem } from "@/types/job";
import StickyJobSidebar from "@/components/job-detail/StickyJobSidebar";
import { JobDetailImages, JobDetailVideo } from "@/components/job-detail/JobDetailMedia";
import { ChevronRight, Clock } from "lucide-react";

interface JobDetailViewProps {
  job: JobItem;
  isAdmin?: boolean;
}

export default function JobDetailView({ job, isAdmin = false }: JobDetailViewProps) {
  useEffect(() => {
    if (job?.title && !isAdmin && typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "view_item", {
        content_type: "job",
        item_id: job.id || job.title,
        item_name: job.title,
      });
    }
  }, [job?.title, job?.id, isAdmin]);

  return (
    <>
      {/* Header Banner với Breadcrumb - Gradient Option A */}
      <section className="relative bg-gradient-to-r from-[#8E1B24] via-[#5c1015] to-[#3A0910] text-white py-3.5 sm:py-4 overflow-hidden border-b border-[#C9963F]/30 shadow-sm">
        <div className="w-[94%] xl:w-[92%] 2xl:w-[90%] max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-wrap items-center justify-between gap-3">
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

      {/* Bố cục: Luôn đồng nhất 3 cột (20% - 60% - 20%) chuẩn trên mọi trang công việc */}
      <div className="w-[94%] xl:w-[92%] 2xl:w-[90%] max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 xl:gap-8 items-start">
          
          {/* CỘT 1 (BÊN TRÁI 20%): Logo thương hiệu & Video thực tế - lg:col-span-2 */}
          <div className="order-2 lg:order-1 lg:col-span-2 lg:row-start-1 lg:sticky lg:top-6 self-start space-y-4 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            {/* Logo thương hiệu */}
            <StickyJobSidebar job={job} />

            {/* 1 Khung video thực tế khung dọc 3:4 */}
            <JobDetailVideo
              videoUrl={job.videoUrl}
              videoPoster={job.videoPoster}
            />
          </div>

          {/* CỘT 2: Bảng mô tả công việc & FAQ (60% - lg:col-span-6) */}
          <div className="order-1 lg:order-2 lg:col-span-6 lg:row-start-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
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

              {/* Thanh Lương & Ca làm việc theo mẫu chuẩn sếp gửi (image2.png) */}
              {(() => {
                let rawHours = (job.workHours || job.workTypeDisplay || "").replace(/24h00/g, "00h00");
                rawHours = rawHours.replace(/\\n/g, " - ").replace(/\n/g, " - ");
                rawHours = rawHours.replace(/\s*\(Đăng ký linh hoạt, nghỉ 1 ngày\/tuần\)/gi, "").trim();

                return (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF7] border border-[#F3E2B8] rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    {/* Vế trái: Icon tiền xanh lá + Mức lương đồng bộ [icon + text + background + border + radius + shadow] */}
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 px-3 py-1.5 rounded-xl text-emerald-950 shadow-sm">
                      <Image
                        src="/images/icon-salary.webp"
                        alt="Mức lương"
                        width={22}
                        height={16}
                        className="w-5 h-auto sm:w-5.5 object-contain shrink-0"
                      />
                      <span className="text-[15px] sm:text-[17px] font-bold text-emerald-950 tracking-tight">
                        {job.salaryDisplay}
                      </span>
                    </div>

                    {/* Vế phải: Icon Clock xanh + Thời gian ca làm việc */}
                    {rawHours && (
                      <div className="flex items-center gap-2 text-slate-700 text-[14px] sm:text-[15px] font-medium shrink-0">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{rawHours}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Nội dung tuyển dụng ngắn gọn trực quan theo mẫu bài post thực tế */}
            {job.concisePost ? (
              <div className="space-y-5">
                {/* Đoạn mô tả nội dung công việc */}
                <p className="text-[16px] sm:text-[17px] text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                  {job.concisePost.intro}
                </p>

                <div className="space-y-3.5 pt-1">
                  {/* Danh sách các gạch đầu dòng ngắn gọn với Icon / Emoji chuẩn mẫu, ưu tiên lương lên đầu */}
                  {job.concisePost.points &&
                    job.concisePost.points.map((point, i) => {
                      const isSalary =
                        point.label &&
                        (point.label.toLowerCase().includes("thu nhập") ||
                          point.label.toLowerCase().includes("lương"));

                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-[16px] sm:text-[17px] text-gray-800 leading-relaxed"
                        >
                          {isSalary ? (
                            <Image
                              src="/images/icon-salary.webp"
                              alt="Mức thu nhập"
                              width={22}
                              height={16}
                              className="w-5 h-auto object-contain shrink-0 mt-1"
                            />
                          ) : (
                            <span className="text-xl shrink-0 mt-0.5 select-none">{point.icon}</span>
                          )}
                          <div>
                            {point.label && (
                              <span className="font-bold text-gray-950 mr-1.5">
                                {point.label}
                              </span>
                            )}
                            <span className="whitespace-pre-line">{point.content}</span>
                          </div>
                        </div>
                      );
                    })}
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

          {/* CỘT 3 (BÊN PHẢI 20%): Ảnh thực tế dạng thumbnail - Luôn hiển thị đồng nhất 3 cột */}
          <div className="order-3 lg:order-3 lg:col-span-2 lg:row-start-1 lg:sticky lg:top-6 self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            <JobDetailImages images={job.images} />
          </div>

        </div>
      </div>
    </>
  );
}
