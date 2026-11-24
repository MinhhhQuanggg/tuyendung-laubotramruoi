"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Branch } from "@/types/branch";
import { REGION_METADATA, getBranchRegionKey } from "@/data/branches";
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

  // Phân chia danh sách chi nhánh theo 6 cụm (3 trên, 3 dưới):
  // Hàng 1 (3 trên): Quận Đông | Quận Trung Tâm | Quận Trung Tâm 2
  // Hàng 2 (3 dưới): Quận Bắc | Quận Tây | Biên Hòa - Đồng Nai
  const regionColumns = useMemo(() => {
    return REGION_METADATA.map((meta) => {
      const colBranches = branches.filter((b) => getBranchRegionKey(b) === meta.key);

      // Sắp xếp chi nhánh theo số thứ tự CN từ bé đến lớn
      colBranches.sort((a, b) => a.cnNumber - b.cnNumber);

      return {
        key: meta.key,
        code: meta.code,
        title: meta.title,
        subtitle: meta.subtitle,
        count: colBranches.length,
        branches: colBranches,
      };
    });
  }, [branches]);

  // Render card cụm chi nhánh
  const renderRegionCard = (col: (typeof regionColumns)[0]) => (
    <div key={col.key} className="space-y-3">
      {/* Header Tiêu Đề Của Từng Cụm */}
      <div className="pb-2 border-b border-brand-900/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <h4 className="text-white font-bold text-sm sm:text-base tracking-wide truncate">
            {col.title}
          </h4>
        </div>
      </div>

      {/* Danh Sách Chi Nhánh Trong Cụm */}
      <div className="space-y-1">
        {col.branches.map((b) => (
          <a
            key={b.id}
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              "Lẩu Bò Trăm Rưỡi " + b.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Mở chỉ đường Google Maps tới ${b.name}`}
            className={`group flex items-start gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.06] transition-all duration-150 text-left cursor-pointer ${
              b.address.toLowerCase().includes("nguyễn duy trinh")
                ? "bg-amber-400/[0.08] border border-amber-400/20"
                : ""
            }`}
          >
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
    </div>
  );

  return (
    <footer
      id="he-thong-chi-nhanh"
      className="relative bg-gradient-to-b from-[#8E1B24] via-[#3A0910] to-[#120202] text-gray-300 min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* Footer Gradient chuẩn Option A: Đỏ son (#8E1B24) -> Đỏ thẫm (#3A0910) -> Đen đỏ (#120202) */}
      {/* Hiệu ứng ánh sáng vàng đồng (#C9963F) lan tỏa tinh tế phía trên footer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(201,150,63,0.16),transparent_70%)] pointer-events-none" />

      {/* Đường vòm cong chuyển tiếp đầu Footer */}
      <CurvedWaveDivider
        fillColor="#8E1B24"
        className="w-full bg-surface shrink-0 relative z-10"
        heightClassName="h-6 sm:h-8 md:h-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 flex-1 flex flex-col justify-between w-full relative z-10 space-y-6">
        {/* PHẦN TRÊN: DANH SÁCH ĐỊA CHỈ CHI NHÁNH CHIA 3 TRÊN, 3 DƯỚI: (QUẬN ĐÔNG | QUẬN TRUNG TÂM | QUẬN TRUNG TÂM 2) - (QUẬN BẮC | QUẬN TÂY | BIÊN HÒA) */}
        <div className="pb-6 border-b border-brand-900/80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-7">
            {regionColumns.map((col) => renderRegionCard(col))}
          </div>
        </div>

        {/* PHẦN GIỮA: BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC THỰC CHIẾN HỆ THỐNG CHI NHÁNH */}
        <div>
          <BranchMap branches={branches} />
        </div>

        {/* PHẦN DƯỚI: BẢN QUYỀN, VỀ CHÚNG TÔI, CHÍNH SÁCH & MẠNG XÃ HỘI */}
        <div className="pt-4 border-t border-brand-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center md:text-left" suppressHydrationWarning>
            © {new Date().getFullYear()} {siteConfig.name}. Tất cả các quyền được bảo lưu.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/ve-chung-toi" className="hover:text-amber-400 transition font-medium">
              Về chúng tôi
            </Link>
            <span>•</span>
            <Link href="/chinh-sach-bao-mat" className="hover:text-amber-400 transition">
              Chính sách bảo mật
            </Link>
            <span>•</span>
            <Link href="/dieu-khoan-su-dung" className="hover:text-amber-400 transition">
              Điều khoản sử dụng
            </Link>
            <span>•</span>

            {/* Fanpage Facebook */}
            <a
              href={siteConfig.socials.facebookFanpage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#1877F2] hover:text-white text-gray-300 font-medium border border-white/10 hover:border-transparent transition-all hover:scale-105 active:scale-95"
              title="Fanpage Facebook Tiệm Lẩu Bò Trăm Rưỡi"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>

            {/* TikTok */}
            <a
              href={siteConfig.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-black hover:text-white text-gray-300 font-medium border border-white/10 hover:border-transparent transition-all hover:scale-105 active:scale-95"
              title="Kênh TikTok Lẩu Bò Trăm Rưỡi"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.86c.01 1.72-.4 3.46-1.33 4.88-1.43 2.21-3.92 3.6-6.55 3.66-2.6.06-5.18-1.12-6.72-3.18-1.54-2.07-1.89-4.83-1-7.25.88-2.4 2.94-4.14 5.48-4.62.48-.09.97-.13 1.46-.13.34 0 .68.02 1.02.06v4.07c-.4-.12-.83-.17-1.25-.15-1.24.04-2.43.68-3.09 1.71-.67 1.04-.73 2.38-.2 3.45.52 1.08 1.64 1.78 2.85 1.78 1.25 0 2.41-.75 2.89-1.9.21-.51.31-1.07.31-1.63V.02z"/>
              </svg>
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
