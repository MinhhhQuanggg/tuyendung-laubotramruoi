"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import QuickApplyModal from "@/components/common/QuickApplyModal";
import { JobItem } from "@/types/job";

export default function JobDetailApplyButton({ job }: { job: JobItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "click_apply_button", { button_location: "job_detail", job_title: job.title });
          }
          setIsOpen(true);
        }}
        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8E1B24] via-[#6B1414] to-[#3A0910] hover:from-[#7a171f] hover:to-[#2e070c] border border-[#C9963F]/40 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-[#8E1B24]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Send className="w-4 h-4 text-amber-300" />
        <span>Nộp Hồ Sơ Ứng Tuyển Nhanh</span>
      </button>

      <QuickApplyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultPositionSlug={job.slug}
        defaultPositionId={job.id}
      />
    </>
  );
}
