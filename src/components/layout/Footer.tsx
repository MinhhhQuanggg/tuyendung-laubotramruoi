"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Branch } from "@/types/branch";
import { MapPin, Navigation } from "lucide-react";
import CurvedWaveDivider from "../common/CurvedWaveDivider";
import BranchMap from "./BranchMap";

export default function Footer() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const loadBranches = () => {
      fetch(`/api/branches?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.branches) {
            setBranches(data.branches);
          }
        })
        .catch(() => {});
    };

    loadBranches();
    window.addEventListener("branches-updated", loadBranches);
    return () => {
      window.removeEventListener("branches-updated", loadBranches);
    };
  }, []);

  const part = Math.ceil(branches.length / 3) || 1;
  const col1 = branches.slice(0, part);
  const col2 = branches.slice(part, part * 2);
  const col3 = branches.slice(part * 2);
  const columns = [col1, col2, col3];

  return (
    <footer
      id="he-thong-chi-nhanh"
      className="relative bg-gradient-to-b from-[#7a1717] via-[#3a0808] to-[#120202] text-gray-300 min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* Footer Gradient 3 cấp độ từ trên xuống: Nhẹ (#7a1717) -> Trung (#3a0808) -> Đậm (#120202) */}
      {/* Hiệu ứng ánh sáng lan tỏa nhẹ phía trên footer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />

      {/* Đường vòm cong chuyển tiếp đầu Footer */}
      <CurvedWaveDivider
        fillColor="#7a1717"
        className="w-full bg-surface shrink-0 relative z-10"
        heightClassName="h-6 sm:h-8 md:h-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 flex-1 flex flex-col justify-between w-full relative z-10 space-y-6">
        {/* PHẦN TRÊN: DANH SÁCH ĐỊA CHỈ CHI NHÁNH CHIA THÀNH 3 CỘT */}
        <div className="pb-6 border-b border-brand-900/80">
          <div className="mb-6">
            <h3 className="text-white font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              Hệ Thống {branches.length > 0 ? `${branches.length} ` : ""}Chi Nhánh Lẩu Bò Trăm Rưỡi
            </h3>
          </div>

          {/* GRID 3 CỘT ĐỊA CHỈ - THIẾT KẾ KHÔNG KHUNG THOÁNG ĐẸP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {columns.map((colBranches, colIdx) => (
              <div key={colIdx} className="space-y-1.5">
                {colBranches.map((b) => (
                  <a
                    key={b.id}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      "Lẩu Bò Trăm Rưỡi " + b.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Mở chỉ đường Google Maps tới CN ${b.cnNumber} (${b.name})`}
                    className="group flex items-start gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.06] transition-all duration-150 text-left cursor-pointer"
                  >
                    {/* Badge CN + số thứ tự đồng bộ với ghim trên Google Maps */}
                    <span className="shrink-0 px-2 py-0.5 mt-0.5 rounded-md bg-amber-400 text-brand-950 font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
                      CN {b.cnNumber}
                    </span>

                    {/* Tên & Địa chỉ chi nhánh */}
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-xs sm:text-sm font-bold group-hover:text-amber-300 transition-colors flex items-center justify-between gap-1">
                        <span className="truncate">{b.name}</span>
                        <Navigation className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-gray-400 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-gray-200 transition-colors mt-0.5">
                        {b.address}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* PHẦN GIỮA: BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC THỰC CHIẾN (CHỈ DÀNH RIÊNG CHO 13 CHI NHÁNH TP.HCM) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Bản đồ định vị Google Maps hệ thống chi nhánh
            </span>
            <span className="text-[11px] text-amber-200/80 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-full w-fit">
              💡 Bấm vào từng ghim đỏ để xem địa chỉ và mở chỉ đường trực tiếp
            </span>
          </div>

          <BranchMap branches={branches} />
        </div>

        {/* PHẦN DƯỚI: BẢN QUYỀN & THÔNG TIN DOANH NGHIỆP */}
        <div className="pt-4 border-t border-brand-900/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/chinh-sach-bao-mat" className="hover:text-amber-400 transition">
              Chính sách bảo mật
            </Link>
            <span>•</span>
            <Link href="/dieu-khoan-su-dung" className="hover:text-amber-400 transition">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
