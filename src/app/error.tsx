"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, PhoneCall, ChevronDown, ChevronUp } from "lucide-react";
import { siteConfig } from "@/config/site";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Ghi nhận lỗi ra console hệ thống
    console.error("🔴 [Client/Server Error Caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-stone-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-red-100 p-6 sm:p-8 text-center transition-all">
        {/* Biểu tượng cảnh báo */}
        <div className="w-16 h-16 bg-red-50 text-brand-800 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-red-200 shadow-inner">
          <AlertTriangle className="w-8 h-8 text-brand-800" />
        </div>

        {/* Tiêu đề & Mô tả */}
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-2">
          Đã có lỗi xảy ra!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          Hệ thống gặp sự cố bất ngờ trong quá trình tải trang. Đừng lo lắng, dữ liệu của bạn vẫn an toàn. Vui lòng thử tải lại trang hoặc quay về trang chủ.
        </p>

        {/* Các nút hành động chính */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại trang
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Hotline hỗ trợ */}
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-center gap-2">
          <span>Cần hỗ trợ tuyển dụng gấp?</span>
          <a
            href={`tel:${siteConfig.hrContact.phone}`}
            className="font-semibold text-brand-800 hover:underline inline-flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            {siteConfig.hrContact.phone}
          </a>
        </div>

        {/* Chi tiết kỹ thuật cho Dev/Admin */}
        {(error?.message || error?.digest) && (
          <div className="mt-5 text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 transition-colors mx-auto block"
            >
              {showDetails ? "Ẩn thông tin kỹ thuật" : "Xem thông tin kỹ thuật lỗi"}
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showDetails && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-left font-mono text-xs text-gray-700 overflow-x-auto max-h-48">
                {error.digest && (
                  <div className="text-gray-500 mb-1">
                    <span className="font-semibold text-gray-600">Digest:</span> {error.digest}
                  </div>
                )}
                {error.message && (
                  <div>
                    <span className="font-semibold text-gray-600">Message:</span> {error.message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
