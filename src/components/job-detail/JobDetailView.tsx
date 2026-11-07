"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { JobItem } from "@/types/job";
import AdminDetailToolbar from "@/components/admin/AdminDetailToolbar";
import StickyJobSidebar from "@/components/job-detail/StickyJobSidebar";
import { JobDetailImages, JobDetailVideo } from "@/components/job-detail/JobDetailMedia";
import JobDetailApplyButton from "@/components/job-detail/JobDetailApplyButton";
import { ChevronRight } from "lucide-react";

interface JobDetailViewProps {
  job: JobItem;
  isAdmin?: boolean;
}

export default function JobDetailView({ job: initialJob, isAdmin = false }: JobDetailViewProps) {
  const [job, setJob] = useState<JobItem>(initialJob);

  // Đồng bộ lại state khi initialJob thay đổi từ server
  useEffect(() => {
    setJob(initialJob);
  }, [initialJob]);

  // Lắng nghe cập nhật realtime từ Admin hoặc tab khác để hiển thị tức thì
  useEffect(() => {
    const handleSync = () => {
      fetch(`/api/admin/jobs/${job.id}?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.job) {
            setJob(data.job);
          }
        })
        .catch(() => {});
    };

    window.addEventListener("jobs-updated", handleSync);
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("jobs-sync");
        channel.onmessage = () => {
          handleSync();
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("jobs-updated", handleSync);
      if (channel) channel.close();
    };
  }, [job.id]);

  return (
    <>
      {/* Header Banner với Breadcrumb & Các nút thao tác Admin */}
      <section className="relative bg-gradient-to-r from-[#a82323] via-[#6B1414] to-[#2a0505] text-white py-3.5 sm:py-4 overflow-hidden border-b border-white/10 shadow-sm">
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

          {/* Thanh công cụ thao tác quản trị gộp trực tiếp vào Banner */}
          {isAdmin && (
            <AdminDetailToolbar
              initialJob={job}
              onJobUpdated={(updated) => setJob(updated)}
            />
          )}
        </div>
      </section>

      {/* Bố cục 3 cột hiện đại: Cột trái (Logo + Video), Cột giữa (Mô tả công việc), Cột phải (2 cột ảnh thumbnail) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* CỘT 1 (BÊN TRÁI): Logo thương hiệu & Video thực tế */}
          <div className="order-2 lg:order-1 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:sticky lg:top-6 self-start space-y-4 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            {/* Logo thương hiệu */}
            <StickyJobSidebar job={job} />

            {/* 1 Khung video thực tế khung dọc 3:4 */}
            <JobDetailVideo
              videoUrl={job.videoUrl}
              videoPoster={job.videoPoster}
            />
          </div>

          {/* CỘT 2 (Ở GIỮA): Bảng mô tả công việc */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-4 lg:row-start-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
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
              <h1
                className={`text-[24px] sm:text-[28px] lg:text-[26px] xl:text-[30px] font-black leading-tight ${
                  isAdmin
                    ? job.isActive
                      ? "text-emerald-600"
                      : "text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {job.title}
              </h1>
              <div className="mt-2.5 flex items-center text-[17px] sm:text-[19px] text-gray-600">
                <span className="flex items-center gap-1.5 font-bold text-brand-900">
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

                  {/* Thanh nút hành động: Nộp hồ sơ nhanh & Nhắn Zalo */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <JobDetailApplyButton job={job} />

                    {job.concisePost.zalo && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-700">Hoặc</span>
                        <a
                          href={`https://zalo.me/${job.concisePost.zalo.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-xs px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>💬 Chat Zalo Tuyển Dụng</span>
                        </a>
                      </div>
                    )}
                  </div>
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
                  <div className="pt-4">
                    <JobDetailApplyButton job={job} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CỘT 3 (BÊN PHẢI): 2 Cột ảnh thực tế dạng thumbnail thu nhỏ 50%, nằm đúng cột scroll */}
          <div className="order-3 lg:order-3 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:sticky lg:top-6 self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            <JobDetailImages images={job.images} />
          </div>

        </div>
      </div>
    </>
  );
}
