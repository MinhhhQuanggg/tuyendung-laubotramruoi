import Link from "next/link";
import { SearchX, Home, Briefcase, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-stone-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-amber-100 p-6 sm:p-8 text-center transition-all">
        {/* Biểu tượng 404 */}
        <div className="w-20 h-20 bg-amber-50 text-brand-800 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-amber-200">
          <SearchX className="w-10 h-10 text-brand-800" />
        </div>

        <div className="inline-block px-3 py-1 bg-brand-50 text-brand-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          Lỗi 404
        </div>

        {/* Tiêu đề & Mô tả */}
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-2">
          Không tìm thấy trang yêu cầu
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          Vị trí tuyển dụng hoặc đường dẫn bạn đang tìm kiếm có thể đã hết hạn, bị thay đổi hoặc không tồn tại.
        </p>

        {/* Các nút hành động chính */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>

          <Link
            href="/viec-lam/full-time/phu-bep"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            <Briefcase className="w-4 h-4" />
            Xem các việc làm
          </Link>
        </div>

        {/* Hotline hỗ trợ */}
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-center gap-2">
          <span>Liên hệ phòng Nhân sự:</span>
          <a
            href={`tel:${siteConfig.hrContact.phone}`}
            className="font-semibold text-brand-800 hover:underline inline-flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            {siteConfig.hrContact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
