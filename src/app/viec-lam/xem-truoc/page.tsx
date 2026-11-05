"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, XCircle } from "lucide-react";
import { JobItem } from "@/types/job";
import JobDetailView from "@/components/job-detail/JobDetailView";
import { PREVIEW_STORAGE_KEY, PREVIEW_CHANNEL_NAME } from "@/lib/job-preview";

export default function JobPreviewPage() {
  const [job, setJob] = useState<JobItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDraft = () => {
      try {
        const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setJob(parsed);
          if (parsed.title) {
            document.title = `[Xem Trước] ${parsed.title} | Lẩu Bò Trăm Rưỡi`;
          }
        }
      } catch (e) {
        console.error("Lỗi khi đọc bản nháp xem trước:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();

    // Lắng nghe cập nhật thời gian thực từ tab admin qua BroadcastChannel
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel(PREVIEW_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data) {
          setJob(event.data);
          if (event.data.title) {
            document.title = `[Xem Trước] ${event.data.title} | Lẩu Bò Trăm Rưỡi`;
          }
        }
      };
    }

    // Lắng nghe cập nhật khi sửa từ tab admin khác qua StorageEvent
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PREVIEW_STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setJob(updated);
          if (updated.title) {
            document.title = `[Xem Trước] ${updated.title} | Lẩu Bò Trăm Rưỡi`;
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      channel?.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-brand-800 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-semibold text-sm">Đang tải bản nháp xem trước...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[65vh] max-w-xl mx-auto flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-sm">
          <Eye className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Chưa có dữ liệu xem trước</h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Trang này dùng để xem trước bài tuyển dụng trong lúc bạn đang soạn thảo. Vui lòng mở form chỉnh sửa vị trí trong trang Quản trị và bấm nút <strong>"Xem Trước"</strong>.
        </p>
        <Link
          href="/admin"
          className="px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-950 text-white font-bold text-sm shadow-md transition"
        >
          Quay lại Bảng Điều Khiển Quản Trị
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Banner thông báo chế độ xem trước bản nháp (dữ liệu đang chỉnh sửa) */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-amber-950 px-4 py-2.5 shadow-md border-b border-amber-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
            <span className="font-extrabold tracking-wide uppercase text-white drop-shadow-sm">
              Chế Độ Xem Trước Bản Nháp (Đang Chỉnh Sửa)
            </span>
            <span className="hidden md:inline text-amber-100 font-medium">
              — Dữ liệu chưa lưu vào hệ thống
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-amber-100 text-[11px]">
              Tự động cập nhật tức thì khi bạn bấm "Xem Trước" trong form
            </span>
            <button
              type="button"
              onClick={() => window.close()}
              className="px-3 py-1 rounded-lg bg-amber-950/80 hover:bg-black text-white text-[11px] font-bold transition flex items-center gap-1"
              title="Đóng tab xem trước này"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Đóng Tab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hiển thị giao diện Client chuẩn xác 100% */}
      <JobDetailView job={job} isAdmin={false} />
    </>
  );
}
