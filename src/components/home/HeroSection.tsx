import Image from "next/image";
import CurvedWaveDivider from "../common/CurvedWaveDivider";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative text-white min-h-[440px] sm:min-h-[480px] md:min-h-[500px] flex flex-col justify-between overflow-hidden bg-surface">
      {/* Background Image: Full banner chiều dài & chiều rộng */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner-clean.webp"
          alt="Tiệm Lẩu Bò Trăm Rưỡi Tuyển Dụng"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Lớp phủ gradient: Phủ tối góc trái trên để chữ nổi bật, để mở bảng hiệu chính giữa & bên phải */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#160202]/70 via-40% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160202]/85 via-black/20 to-black/30" />
      </div>

      {/* Nội dung ở góc trên bên trái của banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6 md:pt-8 relative z-10">
        <div className="text-left max-w-xl md:max-w-2xl">
          {/* Breadcrumb / Tagline nhỏ */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold mb-2.5 sm:mb-3 shadow-lg border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Chuỗi F&B Lẩu Bò Trăm Rưỡi Tuyển Dụng</span>
          </div>

          {/* Tiêu đề H1 - đúng 2 dòng chuẩn chỉ */}
          <h1 className="text-[17px] xs:text-[19px] sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[40px] font-black tracking-tight uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-[1.25] lg:leading-[1.265]">
            <span className="block whitespace-nowrap">HỌC VIỆC, HỌC NGHỀ MIỄN PHÍ,</span>
            <span className="block whitespace-nowrap mt-1 sm:mt-1.5 md:mt-2 lg:mt-[1.5%] text-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              VẪN CÓ LƯƠNG ĐỦ
            </span>
          </h1>
        </div>
      </div>

      {/* Logo tuyển dụng hoà nhập tự nhiên vào vị trí tán cây xanh bên phải (ngay dưới chữ TRĂM RƯỠI) */}
      <div className="absolute right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 top-[28%] sm:top-[26%] md:top-[24%] lg:top-[22%] z-20 w-20 sm:w-28 md:w-36 lg:w-44 select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        <Image
          src="/images/logo-tuyendung.webp"
          alt="Logo Tuyển Dụng Tiệm Lẩu Bò Trăm Rưỡi"
          width={897}
          height={877}
          priority
          className="w-full h-auto object-contain block drop-shadow-md"
        />
      </div>

      {/* Đường cong vòm phía dưới Hero */}
      <CurvedWaveDivider fillColor="#F8F9FA" className="w-full relative z-10 mt-auto -mb-[2px]" />
    </section>
  );
}
