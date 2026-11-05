"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Briefcase,
  Search,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  FileText,
  Download,
  ExternalLink,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  RefreshCw,
  Paperclip,
  Check,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { ApplicationItem, ApplicationStatus } from "@/types/application";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    label: "Chờ liên hệ",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  contacted: {
    label: "Đã liên hệ",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  interviewed: {
    label: "Đã phỏng vấn",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  hired: {
    label: "Đã nhận việc",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Không phù hợp",
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>("ALL");
  const [hasCvFilter, setHasCvFilter] = useState<"ALL" | "YES" | "NO">("ALL");

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      } else {
        showToast(data.error || "Không thể tải danh sách ứng viên", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi tải danh sách hồ sơ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update status handler
  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        showToast(`Đã chuyển trạng thái sang "${STATUS_CONFIG[newStatus].label}"`, "success");
      } else {
        showToast(data.error || "Không thể cập nhật trạng thái", "error");
      }
    } catch {
      showToast("Lỗi khi cập nhật trạng thái", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete handler
  const handleDelete = async (appId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hồ sơ ứng viên này? Thao tác này không thể hoàn tác.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications?id=${appId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((app) => app.id !== appId));
        setSelectedApp(null);
        showToast("Đã xóa hồ sơ ứng viên thành công", "success");
      } else {
        showToast(data.error || "Không thể xóa hồ sơ", "error");
      }
    } catch {
      showToast("Lỗi khi xóa hồ sơ ứng viên", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Preview CV in new tab
  const handlePreviewCv = (cvBase64?: string, cvUrl?: string) => {
    const fileSource = cvBase64 || cvUrl;
    if (!fileSource) return;

    if (fileSource.startsWith("data:")) {
      try {
        const arr = fileSource.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch {
        window.open(fileSource, "_blank");
      }
    } else {
      window.open(fileSource, "_blank");
    }
  };

  // Download CV
  const handleDownloadCv = (app: ApplicationItem) => {
    const fileSource = app.cvBase64 || app.cvFileUrl;
    if (!fileSource) return;

    const link = document.createElement("a");
    link.href = fileSource;
    link.download = app.cvFileName || `CV_${app.fullName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Query search: name or position
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = app.fullName.toLowerCase().includes(q);
        const matchJob = app.positionTitle.toLowerCase().includes(q);
        if (!matchName && !matchJob) return false;
      }
      // Status filter
      if (statusFilter !== "ALL" && app.status !== statusFilter) {
        return false;
      }
      // CV filter
      if (hasCvFilter === "YES" && !app.cvBase64 && !app.cvFileUrl && !app.cvFileName) {
        return false;
      }
      if (hasCvFilter === "NO" && (app.cvBase64 || app.cvFileUrl || app.cvFileName)) {
        return false;
      }
      return true;
    });
  }, [applications, searchQuery, statusFilter, hasCvFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const contacted = applications.filter((a) => a.status === "contacted").length;
    const withCv = applications.filter((a) => a.cvBase64 || a.cvFileUrl || a.cvFileName).length;
    return { total, pending, contacted, withCv };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-medium text-sm animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Banner Giới Thiệu & Thống Kê */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-brand-900 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-amber-900/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-3xl shadow-inner">
            👥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                Danh Sách Hồ Sơ Ứng Tuyển
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                Tuyển Dụng
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Lưu giữ thông tin và hồ sơ CV của các ứng viên nộp qua website. Nhấn vào từng ứng viên để xem chi tiết, gọi điện, nhắn Zalo hoặc tải CV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchApplications}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-2 text-xs font-bold"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Thẻ Thống Kê Nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tổng Hồ Sơ</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Chờ Liên Hệ</span>
          <div className="text-2xl font-black text-amber-900 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Đã Liên Hệ</span>
          <div className="text-2xl font-black text-blue-900 mt-1">{stats.contacted}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Đính Kèm CV</span>
          <div className="text-2xl font-black text-emerald-900 mt-1">{stats.withCv}</div>
        </div>
      </div>

      {/* Thanh Tìm Kiếm & Bộ Lọc */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên ứng viên hoặc vị trí job..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Lọc Trạng Thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="pending">Chờ liên hệ</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="interviewed">Đã phỏng vấn</option>
            <option value="hired">Đã nhận việc</option>
            <option value="rejected">Không phù hợp</option>
          </select>

          {/* Lọc CV */}
          <select
            value={hasCvFilter}
            onChange={(e) => setHasCvFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            <option value="ALL">Tất cả hồ sơ</option>
            <option value="YES">Chỉ hồ sơ có CV</option>
            <option value="NO">Hồ sơ không có CV</option>
          </select>
        </div>
      </div>

      {/* DANH SÁCH ỨNG VIÊN BÊN NGOÀI - CHỈ HIỂN THỊ TÊN & JOB (CLICK VÀO MỚI XEM CHI TIẾT) */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Đang tải danh sách hồ sơ ứng viên...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-800 text-base">Không tìm thấy hồ sơ ứng viên nào</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Chưa có hồ sơ ứng tuyển nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const hasCv = Boolean(app.cvBase64 || app.cvFileUrl || app.cvFileName);
            const statusMeta = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;

            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="group relative bg-white rounded-2xl border border-gray-200/90 p-5 shadow-sm hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Trạng thái & huy hiệu CV (nếu có) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                      <span>{statusMeta.label}</span>
                    </span>

                    {hasCv && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide">
                        <Paperclip className="w-3 h-3 text-amber-700" />
                        <span>Có CV</span>
                      </span>
                    )}
                  </div>

                  {/* BÊN NGOÀI: TÊN ỨNG VIÊN */}
                  <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-brand-800 transition line-clamp-1">
                    {app.fullName}
                  </h3>

                  {/* BÊN NGOÀI: TÊN JOB ỨNG TUYỂN */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-900 bg-brand-50/70 px-3 py-1.5 rounded-xl border border-brand-100/80">
                    <Briefcase className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span className="line-clamp-1">{app.positionTitle}</span>
                  </div>
                </div>

                {/* Chân Thẻ: Thời gian nộp & Gợi ý Click Xem Chi Tiết */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {formatDate(app.createdAt)}
                  </span>

                  <span className="text-brand-800 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Xem chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CHI TIẾT ỨNG VIÊN KHI CLICK VÀO */}
      {/* ========================================================================= */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-amber-950 text-white p-5 sm:p-6 relative shrink-0">
              <div className="flex items-start justify-between gap-4 pr-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-brand-950 inline-block mb-2">
                    Chi Tiết Hồ Sơ Ứng Tuyển
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedApp.fullName}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200 font-bold mt-1 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{selectedApp.positionTitle}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Action Nhanh: Gọi Điện & Nhắn Zalo Trực Tiếp Cho Ứng Viên */}
              <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Số Điện Thoại / Zalo
                    </span>
                    <div className="text-base sm:text-lg font-black text-brand-950">
                      {selectedApp.phoneZalo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${selectedApp.phoneZalo}`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi Ngay</span>
                  </a>
                  <a
                    href={`https://zalo.me/${selectedApp.phoneZalo.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat Zalo</span>
                  </a>
                </div>
              </div>

              {/* Thông Tin Cơ Bản */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Độ Tuổi
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedApp.age} tuổi
                  </span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Thời Gian Nộp Đơn
                  </span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {formatDate(selectedApp.createdAt)}
                  </span>
                </div>

                <div className="sm:col-span-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Khu Vực / Chi Nhánh Ứng Tuyển
                  </span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    {selectedApp.appliedRegion || selectedApp.preferredBranch || selectedApp.address || "Gần nhà nhất (HR tự xếp)"}
                  </span>
                </div>

                {selectedApp.note && (
                  <div className="sm:col-span-2 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                      Lời Nhắn / Ghi Chú Của Ứng Viên
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 italic leading-relaxed">
                      &ldquo;{selectedApp.note}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* PHẦN LƯU GIỮ VÀ XEM FILE CV CỦA ỨNG VIÊN */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-800" />
                  <span>Hồ Sơ CV Đính Kèm</span>
                </h4>

                {selectedApp.cvBase64 || selectedApp.cvFileUrl || selectedApp.cvFileName ? (
                  <div className="bg-gradient-to-r from-gray-50 to-amber-50/40 p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm shrink-0 border border-amber-300/60">
                        📄
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">
                          {selectedApp.cvFileName || "Hồ sơ ứng viên (CV)"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {selectedApp.cvFileSize ? formatFileSize(selectedApp.cvFileSize) : "Tệp PDF / Word"}
                          {selectedApp.cvFileType && ` • ${selectedApp.cvFileType.split("/")[1]?.toUpperCase() || selectedApp.cvFileType}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                      <button
                        onClick={() => handlePreviewCv(selectedApp.cvBase64, selectedApp.cvFileUrl)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xem Trực Tiếp</span>
                      </button>

                      <button
                        onClick={() => handleDownloadCv(selectedApp)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Về Máy</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                    Ứng viên này không đính kèm file CV (ứng tuyển nhanh qua số điện thoại/Zalo).
                  </div>
                )}
              </div>

              {/* CẬP NHẬT TRẠNG THÁI TUYỂN DỤNG */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-brand-800" />
                  <span>Trạng Thái Xử Lý Hồ Sơ</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { key: "pending", label: "Chờ liên hệ", color: "hover:border-amber-400 active:bg-amber-100" },
                      { key: "contacted", label: "Đã liên hệ", color: "hover:border-blue-400 active:bg-blue-100" },
                      { key: "interviewed", label: "Đã phỏng vấn", color: "hover:border-purple-400 active:bg-purple-100" },
                      { key: "hired", label: "Đã nhận việc", color: "hover:border-emerald-400 active:bg-emerald-100" },
                      { key: "rejected", label: "Không phù hợp", color: "hover:border-gray-400 active:bg-gray-200" },
                    ] as const
                  ).map((st) => {
                    const isCurrent = selectedApp.status === st.key;
                    return (
                      <button
                        key={st.key}
                        disabled={isUpdatingStatus}
                        onClick={() => handleStatusChange(selectedApp.id, st.key)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${st.color} ${
                          isCurrent
                            ? "bg-brand-800 text-white border-brand-800 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        {isCurrent && <Check className="w-3.5 h-3.5" />}
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Modal: Xóa & Đóng */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                disabled={isDeleting}
                onClick={() => handleDelete(selectedApp.id)}
                className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa hồ sơ này</span>
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
