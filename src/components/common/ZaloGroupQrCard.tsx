"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MessageCircle, ExternalLink, QrCode as QrIcon, Check, Copy, MapPin } from "lucide-react";
import { ZaloGroupInfo, ZALO_REGION_GROUPS, getZaloGroupByRegion } from "@/data/zalo-groups";
import { trackZaloJoin } from "@/lib/analytics";

interface ZaloGroupQrCardProps {
  group?: ZaloGroupInfo;
  variant?: "compact" | "full" | "sidebar";
  className?: string;
  titlePrefix?: string;
  allowRegionChange?: boolean;
}

export default function ZaloGroupQrCard({
  group: initialGroup,
  variant = "full",
  className = "",
  titlePrefix = "Nhóm Zalo Tuyển Dụng",
  allowRegionChange = true,
}: ZaloGroupQrCardProps) {
  const [selectedGroup, setSelectedGroup] = useState<ZaloGroupInfo>(
    initialGroup || ZALO_REGION_GROUPS[0]
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Cập nhật khi prop initialGroup thay đổi từ bên ngoài (ví dụ đổi chi nhánh ở form)
  useEffect(() => {
    if (initialGroup) {
      setSelectedGroup(initialGroup);
    }
  }, [initialGroup]);

  // Tạo ảnh mã QR động theo URL nhóm Zalo được chọn
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(selectedGroup.zaloUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#1E3A8A", // Xanh navy đậm chuẩn Zalo, dễ quét
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Lỗi tạo mã QR:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedGroup.zaloUrl]);

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(selectedGroup.zaloUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = ZALO_REGION_GROUPS.find((g) => g.id === e.target.value);
    if (found) {
      setSelectedGroup(found);
    }
  };

  // Kiểu Sidebar: Nằm gọn gàng dưới Video ở Cột bên trái trang chi tiết việc làm
  if (variant === "sidebar") {
    return (
      <div
        className={`bg-white rounded-3xl p-5 border border-amber-200/90 shadow-sm space-y-3.5 text-center ${className}`}
      >
        <div className="flex items-center justify-center gap-2 text-brand-900 font-bold text-sm">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-xs">
            Z
          </div>
          <span className="truncate">{titlePrefix}</span>
        </div>

        {/* Bộ chọn Cụm Quận trực tiếp dưới video */}
        {allowRegionChange && (
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-600" />
              <span>Chọn cụm quận ứng tuyển:</span>
            </label>
            <select
              value={selectedGroup.id}
              onChange={handleSelectGroup}
              className="w-full px-2.5 py-1.5 text-xs font-bold text-gray-800 bg-amber-50/70 border border-amber-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
            >
              {ZALO_REGION_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  📍 {g.shortName} ({g.subtitle})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-0.5">
          <h4 className="font-extrabold text-sm sm:text-base text-blue-900 leading-tight">
            {selectedGroup.groupName}
          </h4>
          <p className="text-[11px] text-gray-500 mt-1">
            {selectedGroup.subtitle}
          </p>
        </div>

        {/* Khung QR Code */}
        <div className="mx-auto w-36 h-36 p-2 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-center relative shadow-inner">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code ${selectedGroup.groupName}`}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
              <QrIcon className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-500 leading-snug">
          Quét mã QR bằng Zalo hoặc bấm nút dưới để vào nhóm nhận lịch hẹn phỏng vấn
        </p>

        <a
          href={selectedGroup.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Tham gia nhóm Zalo</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
        </a>
      </div>
    );
  }

  // Kiểu Compact (nhỏ gọn)
  if (variant === "compact") {
    return (
      <div
        className={`bg-gradient-to-r from-blue-50/70 to-amber-50/60 rounded-2xl p-4 border border-blue-200/70 flex items-center gap-3.5 ${className}`}
      >
        <div className="w-20 h-20 bg-white p-1 rounded-xl border border-blue-200 shrink-0 flex items-center justify-center shadow-xs">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code Zalo"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <QrIcon className="w-6 h-6 text-blue-500 animate-spin" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
            {titlePrefix}
          </div>
          <h5 className="font-bold text-sm text-gray-900 truncate">
            {selectedGroup.shortName}
          </h5>
          <p className="text-[11px] text-gray-500 truncate">
            {selectedGroup.subtitle}
          </p>
          <a
            href={selectedGroup.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
          >
            <span>Vào nhóm Zalo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Kiểu Full (cho Màn hình Thành công Popup QuickApplyModal)
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-blue-50/80 border-2 border-[#0068FF]/30 p-4 sm:p-5 shadow-sm space-y-3.5 text-center ${className}`}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-300 text-blue-700 text-xs font-bold uppercase tracking-wider">
        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
          Z
        </div>
        <span>{titlePrefix}</span>
      </div>

      <div>
        <h4 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
          {selectedGroup.groupName}
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          {selectedGroup.description}
        </p>
      </div>

      {/* Lựa chọn đổi cụm quận nếu ứng viên muốn đổi khu vực */}
      {allowRegionChange && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">Khu vực:</span>
          <select
            value={selectedGroup.id}
            onChange={handleSelectGroup}
            className="px-2.5 py-1 text-xs font-bold text-blue-900 bg-white border border-blue-300 rounded-lg shadow-2xs focus:outline-none cursor-pointer"
          >
            {ZALO_REGION_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                📍 {g.shortName} ({g.subtitle})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Khung ảnh QR Code */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
        <div className="w-32 h-32 sm:w-36 sm:h-36 p-2 rounded-2xl bg-white border-2 border-blue-400/50 shadow-md flex items-center justify-center shrink-0">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code ${selectedGroup.groupName}`}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-600">
              <QrIcon className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>

        <div className="text-left space-y-2 max-w-xs">
          <div className="text-xs sm:text-[13px] text-gray-700 space-y-1">
            <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <span>✅</span> Nhận thông báo lịch phỏng vấn ưu tiên
            </p>
            <p className="flex items-center gap-1.5 text-gray-600">
              <span>💬</span> Trao đổi trực tiếp cùng Quản lý chi nhánh & HR
            </p>
            <p className="flex items-center gap-1.5 text-gray-600">
              <span>📱</span> Quét QR trên Zalo hoặc bấm nút dưới
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
              title="Sao chép đường link nhóm Zalo"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Đã chép link</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Chép link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nút bấm Tham Gia Nhóm Zalo */}
      <a
        href={selectedGroup.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackZaloJoin(selectedGroup.groupName, selectedGroup.shortName)}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-98 text-white font-black text-sm sm:text-base shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span>THAM GIA NHÓM ZALO {selectedGroup.shortName.toUpperCase()}</span>
        <ExternalLink className="w-4 h-4 shrink-0 opacity-80" />
      </a>
    </div>
  );
}
