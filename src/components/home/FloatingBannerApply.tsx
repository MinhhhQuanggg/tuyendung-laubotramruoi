import { siteConfig } from "@/config/site";
import { Phone, Sparkles, MessageCircle } from "lucide-react";
import defaultConfig from "@/config/quick-apply-config.json";

export default function FloatingBannerApply() {
  const config = defaultConfig;
  const phone = config.hrPhone || siteConfig.hrContact.phone;
  const zaloUrl = config.zaloUrl || siteConfig.hrContact.zaloUrl;
  const hrName = config.hrName || siteConfig.hrContact.name || "Kiên HR";
  const hrDisplayName = hrName.replace(/\s*\(.*?\)\s*/g, "").trim() || hrName;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mb-10 relative z-20">
      <div className="bg-gradient-to-br from-white via-[#fffdf9] to-amber-50/40 rounded-3xl p-4 sm:p-7 lg:p-9 shadow-[0_22px_50px_-10px_rgba(28,5,5,0.28),0_12px_24px_-8px_rgba(0,0,0,0.16)] border border-amber-200/60 ring-1 ring-black/5 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 transition-all duration-300 hover:shadow-[0_28px_60px_-10px_rgba(28,5,5,0.36),0_16px_30px_-8px_rgba(0,0,0,0.2)]">
        {/* Viền nhấn màu đỏ nâu & vàng đồng đồng bộ nhận diện thương hiệu */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-900 via-amber-500 to-brand-800" />

        {/* Khối bên trái: Icon Zalo chuẩn nhận diện & Tiêu đề đồng bộ màu thương hiệu */}
        <div className="flex items-center gap-3.5 sm:gap-6 w-full lg:w-auto">
          {/* Icon Zalo dạng bong bóng chat nhận diện chính thức */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl bg-blue-50/90 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(0,104,255,0.18)] hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 48 48"
              className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C12.954 4 4 12.507 4 23C4 28.188 6.19 32.89 9.845 36.312C9.406 39.512 8.016 42.616 8 42.656C7.875 42.938 7.953 43.266 8.188 43.469C8.328 43.594 8.516 43.656 8.703 43.656C8.828 43.656 8.953 43.625 9.063 43.563C12.422 41.672 15.656 41.344 17.516 41.563C19.578 42.484 21.734 43 24 43C35.046 43 44 34.493 44 24C44 13.507 35.046 4 24 4Z"
                fill="#0068FF"
              />
              <text
                x="50%"
                y="54%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontFamily="'Helvetica Neue', Arial, sans-serif"
                fontWeight="900"
                fontSize="13.5"
                letterSpacing="-0.5"
              >
                Zalo
              </text>
            </svg>
          </div>

          {/* Tiêu đề đồng bộ màu đỏ nâu Trăm Rưỡi (brand-800) */}
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 mb-0.5 sm:mb-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
              <span>{config.bannerSub}</span>
            </div>
            <h3 className="text-[15px] sm:text-[19px] md:text-[22px] lg:text-[24px] font-extrabold text-gray-900 leading-snug">
              {config.bannerHeadline}
            </h3>
          </div>
        </div>

        {/* Khối bên phải: Khung con nhộng đồng bộ bảng màu đỏ nâu / vàng ấm */}
        <div className="w-full lg:w-auto flex-1 max-w-xl">
          <div className="bg-brand-50/70 rounded-full p-1.5 sm:p-2 pl-3 sm:pl-5 md:pl-6 flex items-center justify-between gap-2 sm:gap-3 border border-brand-200/80 shadow-[0_4px_16px_rgba(28,5,5,0.08),inset_0_2px_4px_rgba(0,0,0,0.04)]">
            {/* Thông tin số điện thoại */}
            <div className="flex items-center gap-2 sm:gap-3 text-gray-800 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 shadow-[0_2px_6px_rgba(217,119,6,0.2)]">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1.5 min-w-0 leading-tight">
                <a
                  href={`tel:${phone}`}
                  className="text-[13px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-bold text-brand-950 hover:text-brand-800 transition tracking-wide whitespace-nowrap"
                  title={`Bấm để gọi điện cho ${hrDisplayName}`}
                >
                  {phone}
                </a>
                <span className="text-[10px] sm:text-xs md:text-sm text-brand-900/75 font-semibold whitespace-nowrap">
                  ({hrDisplayName})
                </span>
              </div>
            </div>

            {/* Nút Nhắn Zalo đồng bộ với màu thương hiệu đỏ nâu & icon màu vàng */}
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 rounded-full bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 hover:from-brand-950 hover:to-brand-850 text-white font-bold text-[12px] sm:text-sm md:text-base shadow-[0_6px_18px_rgba(139,30,30,0.4)] hover:shadow-[0_8px_24px_rgba(139,30,30,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>Nhắn Zalo</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

