import Link from "next/link";
import { JobItem } from "@/types/job";
import { Clock, Calendar, ArrowRight, Flame } from "lucide-react";
import { getJobUrl } from "@/lib/job-url";

interface JobCardProps {
  job: JobItem;
  onApplyClick?: (job: JobItem) => void;
}

/**
 * Ở thẻ công việc: Chỉ giữ số lương + đơn vị (/tháng hoặc /giờ),
 * loại bỏ phần chữ phía sau dấu cộng (+) và các ghi chú trong ngoặc
 */
export function formatCardSalary(salary?: string): string {
  if (!salary) return "";

  // Nếu lương có nhiều hình thức (Full-time | Part-time)
  if (salary.includes("|")) {
    const parts = salary.split("|").map((p) => {
      let cleaned = p.split(/[+＋]/)[0];
      cleaned = cleaned.replace(/\([^)]*\)/g, "");
      cleaned = cleaned.replace(/\s*-\s*Nhận lương tuần/i, "");
      return cleaned.trim();
    });
    return parts.join(" | ");
  }

  // Ưu tiên trích xuất định dạng khoảng lương theo tháng dạng: "X - Y triệu/tháng" hoặc "X triệu/tháng"
  const monthMatch = salary.match(/(\d+[\d,.]*(?:\s*-\s*\d+[\d,.]*)?\s*triệu\/tháng)/i);
  if (monthMatch) {
    return monthMatch[1].trim();
  }

  // Đối với các vị trí tính theo giờ hoặc định dạng khác, loại bỏ dấu cộng (+), ghi chú trong ngoặc đơn
  let cleaned = salary.split(/[+＋]/)[0];
  cleaned = cleaned.replace(/\([^)]*\)/g, "");
  cleaned = cleaned.replace(/\s*-\s*Nhận lương tuần/i, "");
  return cleaned.trim();
}

export default function JobCard({ job, onApplyClick }: JobCardProps) {
  const salaryText = formatCardSalary(job.salaryDisplay);

  return (
    <div className="relative group bg-white rounded-2xl p-6 sm:p-7 border border-red-200 sm:border-gray-100 shadow-md sm:shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Họa tiết chìm mờ góc phải dưới như ảnh 11.JPG */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 text-brand-900">
        <Flame className="w-full h-full fill-current" />
      </div>

      <div>
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
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {displayBadges.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-0.5 rounded-full text-[11px] sm:text-[13px] font-semibold bg-brand-50 text-brand-800 border border-brand-100"
                >
                  {item}
                </span>
              ))}
            </div>
          );
        })()}

        {/* Tiêu đề vị trí & Mức lương: Mobile xếp dọc (lương dưới tiêu đề), Desktop cùng hàng (lương bên phải) */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 sm:gap-3 mb-4">
          <h3 className="text-[19px] sm:text-[21px] font-bold text-gray-900 group-hover:text-brand-800 transition-colors line-clamp-2 leading-snug flex-1">
            <Link href={getJobUrl(job)}>{job.title}</Link>
          </h3>
          {salaryText && (
            <span className="self-start w-fit shrink-0 text-[13px] sm:text-[15px] font-bold text-brand-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 sm:mt-0.5">
              {salaryText.includes("|") ? (
                <span className="flex flex-col sm:items-end text-left sm:text-right leading-tight gap-0.5">
                  <span>{salaryText.split("|")[0].trim()}</span>
                  <span className="text-[12px] font-semibold text-amber-800">
                    {salaryText.split("|")[1].trim()}
                  </span>
                </span>
              ) : (
                <span className="whitespace-nowrap">{salaryText}</span>
              )}
            </span>
          )}
        </div>

        {/* Thông tin: Ca làm & Yêu cầu */}
        <div className="space-y-3 text-[17px] sm:text-[19px] text-gray-700 mb-6 leading-relaxed">
          {/* ⏰ Ca làm */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-blue-700" />
            </div>
            {(() => {
              let rawHours = (job.workHours || job.workTypeDisplay || "").replace(/24h00/g, "00h00");
              rawHours = rawHours.replace(/\s*\(Đăng ký linh hoạt, nghỉ 1 ngày\/tuần\)/gi, "").trim();

              if (rawHours.includes("\n") || rawHours.includes("|")) {
                const lines = rawHours
                  .split(/[\n|]/)
                  .map((s) => s.trim())
                  .filter(Boolean);

                return (
                  <span className="line-clamp-2 leading-snug sm:leading-relaxed break-words block">
                    <span>
                      <b>Ca làm:</b> {lines[0]}
                    </span>
                    {lines.slice(1).map((line, idx) => (
                      <span key={idx} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                );
              }

              const match = rawHours.match(/^(.*?)\s+(hoặc)\s+(.*)$/i);

              if (match) {
                const [, shift1, conjunction, shift2] = match;
                return (
                  <span className="line-clamp-2 leading-snug sm:leading-relaxed break-words">
                    <b>Ca làm:</b> {shift1} {conjunction} {shift2}
                  </span>
                );
              }

              return (
                <span className="line-clamp-2 leading-snug sm:leading-relaxed break-words">
                  <b>Ca làm:</b> {rawHours}
                </span>
              );
            })()}
          </div>

          {/* 📅 Độ tuổi / Yêu cầu */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-gray-700" />
            </div>
            <span className="truncate">
              <b>Yêu cầu:</b> {job.ageRequirement}
            </span>
          </div>
        </div>
      </div>

      {/* Footer của Thẻ: Nút Xem chi tiết & Ứng tuyển */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
        {onApplyClick && (
          <button
            onClick={() => onApplyClick(job)}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-sm sm:text-base font-semibold bg-amber-400 hover:bg-amber-500 text-brand-950 transition"
          >
            Nộp nhanh
          </button>
        )}
        <Link
          href={getJobUrl(job)}
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-brand-800 group-hover:text-brand-900 hover:underline"
        >
          <span>Chi tiết</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
