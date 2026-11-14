"use client";

import { useState, useEffect, useMemo } from "react";
import { JobItem } from "@/types/job";
import JobCard from "./JobCard";
import QuickApplyModal from "../common/QuickApplyModal";
import { CheckCircle2 } from "lucide-react";

// Thứ tự hiển thị chuẩn 100% theo các menu con trong Header
const ORDERED_SLUGS = [
  "hoc-viec-bep",
  "phu-bep-hoc-nghe",
  "hoc-viec-to-truong",
  "giam-sat-bep",
  "phuc-vu-part-time",
  "cham-soc-khach-hang",
  "phuc-vu-full-time",
  "phu-bep-full-time",
  "thu-ngan",
  "pha-che-full-time",
  "quan-ly-vung",
  "quan-ly-tiem",
  "pho-quan-ly-tiem",
  "bep-truong",
  "to-truong",
];

export default function JobGridSection() {
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobItem | null>(null);
  const [jobsList, setJobsList] = useState<JobItem[]>([]);

  // Cập nhật dữ liệu việc làm tức thì khi Admin tạo mới hoặc chỉnh sửa
  useEffect(() => {
    const loadJobs = () => {
      fetch(`/api/jobs?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.jobs && data.jobs.length > 0) {
            setJobsList(data.jobs);
          }
        })
        .catch(() => {});
    };

    loadJobs();

    const handleJobsUpdated = () => {
      loadJobs();
    };

    window.addEventListener("jobs-updated", handleJobsUpdated);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("jobs-sync");
        channel.onmessage = () => {
          loadJobs();
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("jobs-updated", handleJobsUpdated);
      if (channel) channel.close();
    };
  }, []);

  // Lọc và sắp xếp danh sách công việc
  const filteredJobs = useMemo(() => {
    return [...jobsList]
      .filter((j) => j.isActive)
      .sort((a, b) => {
        const indexA = ORDERED_SLUGS.indexOf(a.slug);
        const indexB = ORDERED_SLUGS.indexOf(b.slug);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
  }, [jobsList]);

  return (
    <section id="danh-sach-viec-lam" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Thông tin số lượng hiển thị */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4 px-1">
        <span>
          Hiển thị <b>{filteredJobs.length}</b> vị trí đang nhận hồ sơ
        </span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Phỏng vấn & đi làm ngay
        </span>
      </div>

      {/* Lưới 2 Cột danh sách việc làm đầy đủ */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={(j) => setSelectedJobForModal(j)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-base font-bold text-gray-800">Hiện chưa có vị trí tuyển dụng khả dụng</h3>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng quay lại sau hoặc liên hệ trực tiếp phòng nhân sự để được hỗ trợ.
          </p>
        </div>
      )}

      {selectedJobForModal && (
        <QuickApplyModal
          isOpen={!!selectedJobForModal}
          onClose={() => setSelectedJobForModal(null)}
          defaultPositionSlug={selectedJobForModal.slug}
          defaultPositionId={selectedJobForModal.id}
        />
      )}
    </section>
  );
}
