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
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-brand-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
