"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Play, Sparkles, ExternalLink } from "lucide-react";
import { LifeVideo } from "@/types/life-video";

interface LifeAtTramRuoiProps {
  initialVideos?: LifeVideo[];
}

const FALLBACK_VIDEOS: LifeVideo[] = [
  {
    id: "VID-01",
    title: "Chính thức ra mắt lẩu bò 2 ngăn nóng hổi tại Lẩu Bò Trăm Rưỡi",
    author: "@tiemlaubotramruoi",
    platform: "TikTok",
    thumbnail: "/images/tiktok/tiktok-1.webp",
    tag: "Món mới • Lẩu 2 ngăn",
    url: "https://www.tiktok.com/@tiemlaubotramruoi/video/7639325827200503060",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "VID-02",
    title: "Chi nhánh 828 Sư Vạn Hạnh sẵn sàng bùng nổ ngày khai trương",
    author: "@tiemlaubotramruoi",
    platform: "TikTok",
    thumbnail: "/images/tiktok/tiktok-2.webp",
    tag: "Khai trương chi nhánh",
    url: "https://www.tiktok.com/@tiemlaubotramruoi/video/7699785501078752513",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "VID-03",
    title: "Đêm tiệc náo nhiệt: Vừa ăn lẩu bò vừa xem múa cổ trang tại Ung Văn Khiêm",
    author: "@tiemlaubotramruoi",
    platform: "TikTok",
    thumbnail: "/images/tiktok/tiktok-3.webp",
    tag: "Sự kiện & Không khí",
    url: "https://www.tiktok.com/@tiemlaubotramruoi/video/7688300127995432213",
    displayOrder: 3,
    isActive: true,
  },
];

export default function LifeAtTramRuoi({ initialVideos }: LifeAtTramRuoiProps) {
  const tiktokVideos =
    initialVideos && initialVideos.length > 0 ? initialVideos : FALLBACK_VIDEOS;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header phần đời sống */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>KÊNH TRUYỀN THÔNG & MẠNG XÃ HỘI</span>
          </div>
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-black text-gray-900 tracking-tight leading-tight">
            Đời Sống Tại <span className="text-brand-800">Lẩu Bò Trăm Rưỡi</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1.5 max-w-2xl">
            Hình ảnh chân thực về môi trường làm việc, đồng đội và gian bếp mỗi ngày
          </p>
        </div>

        {/* Nút mạng xã hội */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={siteConfig.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-black text-white hover:bg-gray-800 transition shadow-sm"
          >
            <span>TikTok {siteConfig.socials.tiktokHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={siteConfig.socials.recruitmentPage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1877F2] text-white hover:bg-blue-600 transition shadow-sm"
          >
            <span>Fanpage Tuyển Dụng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Lưới 3 cột Video chân thực theo mẫu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiktokVideos.slice(0, 3).map((video) => (
          <a
            key={video.id || video.url}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-3xl overflow-hidden aspect-[9/13.5] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 bg-brand-950 border border-gray-100/10"
          >
            {/* Ảnh thumbnail nền */}
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              unoptimized
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />

            {/* Lớp phủ tối hỗ trợ đọc chữ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 via-45% to-black/30 group-hover:from-black/95 transition-colors" />

            {/* Hàng trên: Tag bên trái, chữ TikTok bên phải */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                {video.tag}
              </span>
              <span className="text-amber-400 font-bold text-xs sm:text-[13px] tracking-wide drop-shadow">
                TikTok
              </span>
            </div>

            {/* Nút Play kính mờ ở chính giữa */}
            <div className="relative z-10 mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/35 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-2xl group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-brand-950 transition-all duration-300">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>

            {/* Hàng dưới: Tiêu đề video và username */}
            <div className="relative z-10 space-y-1.5">
              <h3 className="text-white font-bold text-base sm:text-[17px] leading-snug line-clamp-2 drop-shadow-md">
                {video.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-300 font-medium drop-shadow">
                {video.author}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
