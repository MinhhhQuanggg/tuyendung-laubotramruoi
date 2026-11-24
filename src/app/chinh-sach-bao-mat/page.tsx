import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import CurvedWaveDivider from "@/components/common/CurvedWaveDivider";
import {
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText,
  Lock,
  UserCheck,
  Phone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật Thông Tin Ứng Viên | Tuyển Dụng Lẩu Bò Trăm Rưỡi",
  description:
    "Chính sách bảo mật dữ liệu và quyền riêng tư của ứng viên tại Hệ thống Chuỗi Lẩu Bò Trăm Rưỡi.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#a82323] via-[#6B1414] to-[#2a0505] text-white pt-10 pb-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-amber-200/80 mb-5">
            <Link href="/" className="hover:text-white transition">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-amber-300/60" />
            <span className="text-white font-medium">Chính sách bảo mật</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bảo vệ quyền lợi ứng viên</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            CHÍNH SÁCH BẢO MẬT THÔNG TIN ỨNG VIÊN
          </h1>
          <p className="text-sm sm:text-base text-amber-100/85 leading-relaxed">
            Hệ thống Tiệm Lẩu Bò Trăm Rưỡi cam kết bảo vệ tuyệt đối thông tin cá nhân và hồ sơ ứng tuyển của tất cả người tìm việc.
          </p>
        </div>
      </section>

      <CurvedWaveDivider fillColor="#F8F9FA" className="w-full" />

      {/* Main Content Area */}
      <div className="bg-[#F8F9FA] py-10 -mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80 space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
            
            {/* Cam kết tuyển dụng 0 đồng */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5 text-amber-900 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950 mb-1">
                  Cam kết tuyển dụng 0 đồng:
                </strong>
                <p className="leading-relaxed text-amber-900/90">
                  Hệ thống Lẩu Bò Trăm Rưỡi <strong>tuyệt đối không thu bất kỳ khoản phí nào</strong> (không phí nộp hồ sơ, không phí đào tạo, không tiền cọc, không bắt mua đồng phục). Mọi thông tin ứng viên cung cấp chỉ được sử dụng cho mục đích liên hệ phỏng vấn và bố trí việc làm phù hợp.
                </p>
              </div>
            </div>

            {/* 1. Mục đích thu thập */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-brand-900 font-bold text-lg sm:text-xl border-b border-gray-100 pb-3">
                <FileText className="w-5 h-5 text-brand-800" />
                <h2>1. Mục đích thu thập thông tin</h2>
              </div>
              <p className="text-justify">
                Thông tin ứng tuyển được tiếp nhận qua website{" "}
                <Link href={siteConfig.url} className="text-brand-700 font-semibold underline hover:text-brand-900">
                  {siteConfig.url}
                </Link>{" "}
                hoặc Hotline/Zalo nhằm phục vụ các mục đích:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                <li>Tiếp nhận, đánh giá hồ sơ và mức độ phù hợp với các vị trí tuyển dụng.</li>
                <li>Liên hệ hẹn lịch phỏng vấn và trao đổi trực tiếp với ứng viên qua điện thoại hoặc Zalo.</li>
                <li>Bố trí chi nhánh làm việc gần nơi cư trú nhất để thuận tiện đi lại cho bạn.</li>
              </ul>
            </section>

            {/* 2. Dữ liệu thu thập */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-brand-900 font-bold text-lg sm:text-xl border-b border-gray-100 pb-3">
                <Building2 className="w-5 h-5 text-brand-800" />
                <h2>2. Thông tin ứng viên cung cấp</h2>
              </div>
              <p className="text-justify">
                Chúng tôi chỉ thu thập các thông tin cơ bản và cần thiết cho công việc:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                <li><strong>Họ và tên, Số điện thoại / Zalo:</strong> Dùng để liên hệ trao đổi công việc và thông báo kết quả.</li>
                <li><strong>Năm sinh / Độ tuổi:</strong> Xác nhận độ tuổi lao động hợp pháp (từ đủ 18 tuổi trở lên).</li>
                <li><strong>Vị trí & Chi nhánh mong muốn:</strong> Giúp bộ phận tuyển dụng sắp xếp công việc phù hợp với năng lực và nơi ở.</li>
                <li><strong>Kinh nghiệm / Hồ sơ đính kèm (nếu có):</strong> Phục vụ đánh giá mức lương và lộ trình đào tạo nghề bếp.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-600">
                💡 <strong>Lưu ý:</strong> Hệ thống <strong>không yêu cầu</strong> cung cấp số CCCD khi nộp đơn online, số tài khoản ngân hàng, hay các thông tin cá nhân nhạy cảm khác.
              </div>
            </section>

            {/* 3. Cam kết bảo mật & Chia sẻ nội bộ */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-brand-900 font-bold text-lg sm:text-xl border-b border-gray-100 pb-3">
                <Lock className="w-5 h-5 text-brand-800" />
                <h2>3. Cam kết bảo mật & Sử dụng dữ liệu</h2>
              </div>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                <li><strong>Tuyệt đối không bán dữ liệu:</strong> Chúng tôi không chia sẻ, mua bán hay chuyển nhượng thông tin ứng viên cho bất kỳ bên thứ ba nào vì mục đích thương mại, quảng cáo hay tài chính.</li>
                <li><strong>Chỉ lưu hành nội bộ:</strong> Thông tin chỉ được chuyển đến Quản lý chi nhánh hoặc Bếp trưởng trực tiếp phụ trách phỏng vấn và hướng dẫn nhận việc.</li>
                <li><strong>Mã hóa an toàn:</strong> Toàn bộ dữ liệu gửi qua website được mã hóa bằng giao thức bảo mật SSL/TLS (HTTPS).</li>
              </ul>
            </section>

            {/* 4. Quyền của ứng viên */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-brand-900 font-bold text-lg sm:text-xl border-b border-gray-100 pb-3">
                <UserCheck className="w-5 h-5 text-brand-800" />
                <h2>4. Quyền của ứng viên</h2>
              </div>
              <p className="text-justify">
                Ứng viên hoàn toàn có quyền chủ động đối với thông tin cá nhân của mình:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                <li>Yêu cầu kiểm tra, cập nhật lại số điện thoại hoặc đổi vị trí, chi nhánh mong muốn.</li>
                <li>Yêu cầu xóa vĩnh viễn thông tin hồ sơ ứng tuyển khỏi hệ thống khi không còn nhu cầu tìm việc.</li>
              </ul>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cách thực hiện:</strong> Chỉ cần nhắn tin trực tiếp qua Zalo hoặc gọi Hotline:{" "}
                  <a href={siteConfig.hrContact.zaloUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline text-emerald-800">
                    {siteConfig.hrContact.phone}
                  </a>{" "}
                  ({siteConfig.hrContact.name} - Phụ trách Tuyển dụng). Yêu cầu sẽ được xử lý ngay trong ngày làm việc.
                </div>
              </div>
            </section>

            {/* 5. Kênh liên hệ chính thức */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-brand-900 font-bold text-lg sm:text-xl border-b border-gray-100 pb-3">
                <Phone className="w-5 h-5 text-brand-800" />
                <h2>5. Kênh liên hệ tuyển dụng chính thức</h2>
              </div>
              <p className="text-justify">
                Để tránh các đối tượng mạo danh, ứng viên vui lòng liên hệ qua các kênh chính thức duy nhất sau:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Hotline / Zalo Tuyển Dụng</span>
                  </div>
                  <p className="text-base font-bold text-emerald-700">
                    <a href={siteConfig.hrContact.zaloUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {siteConfig.hrContact.phone}
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">
                    Phụ trách: {siteConfig.hrContact.name}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-brand-700" />
                    <span>Hệ Thống Tiệm Lẩu Bò Trăm Rưỡi</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Fanpage:{" "}
                    <a href={siteConfig.socials.facebookFanpage} target="_blank" rel="noopener noreferrer" className="text-brand-700 font-medium underline">
                      Lẩu Bò Trăm Rưỡi
                    </a>
                  </p>
                  <p className="text-xs text-gray-600">
                    Website:{" "}
                    <Link href={siteConfig.url} className="text-brand-700 font-medium underline">
                      {siteConfig.url}
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Sign-off */}
            <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
              <div>
                © {new Date().getFullYear()} {siteConfig.name} • Chuỗi F&B Lẩu Bò Trăm Rưỡi.
              </div>
              <Link
                href="/dieu-khoan-su-dung"
                className="text-brand-700 hover:text-brand-900 font-semibold underline"
              >
                Xem Điều khoản sử dụng →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
