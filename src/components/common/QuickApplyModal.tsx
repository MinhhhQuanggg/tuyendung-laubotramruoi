"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  MapPin,
  FileUp,
  FileText,
  Trash2,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink,
  Mail,
} from "lucide-react";
import { QuickApplyConfig } from "@/types/quick-apply";
import { Branch } from "@/types/branch";
import { JobItem } from "@/types/job";
import { ALL_BRANCHES, REGION_METADATA, getBranchRegionKey } from "@/data/branches";
import { MOCK_JOBS_DATA } from "@/data/mock-jobs";

/**
 * Chỉ các công việc thực sự là học việc, học nghề mới hiển thị huy hiệu "Học nghề có lương"
 */
export function isHocViecJob(
  job?: JobItem | { title?: string; category?: string; slug?: string } | null
): boolean {
  if (!job) return false;
  const title = (job.title || "").toLowerCase();
  const category = (job.category || "").toLowerCase();
  const slug = (job.slug || "").toLowerCase();

  // Chức danh giám sát, quản lý, trưởng bếp thực thụ tuyệt đối không phải học việc (trừ khi có từ học việc/học nghề)
  if (
    !title.includes("học việc") &&
    !title.includes("học nghề") &&
    !slug.includes("hoc-viec") &&
    !slug.includes("hoc-nghe") &&
    (title.includes("giám sát") ||
      title.includes("quản lý") ||
      title.includes("trưởng") ||
      category.includes("quản lý") ||
      category.includes("trưởng"))
  ) {
    return false;
  }

  return (
    title.includes("học việc") ||
    title.includes("học nghề") ||
    slug.includes("hoc-viec") ||
    slug.includes("hoc-nghe") ||
    category.includes("học nghề")
  );
}

/**
 * Tạo đường dẫn mở bản đồ Google Maps cho chi nhánh
 */
function getBranchMapsUrl(branch?: Branch | null): string {
  if (!branch) {
    return "https://www.google.com/maps/search/?api=1&query=L%E1%BA%A3u+B%C3%B2+Tr%C4%83m+R%C6%B0%E1%BB%A1i";
  }
  if (branch.mapUrl) return branch.mapUrl;
  if (branch.lat && branch.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Lẩu Bò Trăm Rưỡi CN ${branch.cnNumber} ${branch.address}`
  )}`;
}

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPositionSlug?: string;
  defaultPositionId?: string;
}

export default function QuickApplyModal({
  isOpen,
  onClose,
  defaultPositionSlug,
  defaultPositionId,
}: QuickApplyModalProps) {
  const [config, setConfig] = useState<QuickApplyConfig>({
    formTitle: "Ứng Tuyển Lẩu Bò Trăm Rưỡi",
    formSubtitle: "Đào tạo nghề miễn phí có lương • Phỏng vấn đi làm ngay",
    hrName: "Nguyễn Trung Kiên (Kiên HR)",
    hrPhone: "0981256712",
    zaloUrl: "https://zalo.me/0981256712",
    successTitle: "Nộp Hồ Sơ Thành Công!",
    successMessage: "Thông tin của bạn đã được chuyển thẳng tới Bộ phận Tuyển dụng (HR). Anh Kiên sẽ gọi điện hoặc nhắn tin Zalo cho bạn trong ít phút!",
    successNote: "Vui lòng để ý chuông điện thoại từ số 0981256712 để không bỏ lỡ lịch phỏng vấn nhé.",
    bannerHeadline: "Liên hệ với chúng tôi để nhận thông tin tuyển dụng",
    bannerSub: "Hỗ Trợ Ứng Viên 24/7",
    allowCvUpload: true,
  });

  const [branchesList, setBranchesList] = useState<Branch[]>(ALL_BRANCHES);
  const [jobsList, setJobsList] = useState<JobItem[]>(MOCK_JOBS_DATA);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneZalo: "",
    email: "",
    appliedRegion: "CN 14 (Quận 2): 210 Nguyễn Duy Trinh, Quận 2",
    positionId: "JOB-GS-BEP",
    positionTitle: "Giám sát Bếp Chi Nhánh",
  });

  const [cvFile, setCvFile] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tải dữ liệu cấu hình, danh sách công việc và địa chỉ chi nhánh mới nhất
  useEffect(() => {
    if (isOpen) {
      // 1. Tải cấu hình form
      fetch("/api/quick-apply-config")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.config) setConfig(data.config);
        })
        .catch(() => {});

      // 2. Tải danh sách địa chỉ chi nhánh thực tế
      fetch("/api/branches")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.branches && data.branches.length > 0) {
            setBranchesList(data.branches);
          }
        })
        .catch(() => {});

      // 3. Tải danh mục việc làm đang tuyển thực tế
      fetch("/api/jobs")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.jobs && data.jobs.length > 0) {
            setJobsList(data.jobs);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Tự động liên kết và ưu tiên chọn sẵn vị trí Giám sát Bếp Chi Nhánh & Chi nhánh Nguyễn Duy Trinh Q2
  useEffect(() => {
    if (isOpen) {
      const targetIdentifier = defaultPositionSlug || defaultPositionId;
      let foundJob: JobItem | undefined;

      if (targetIdentifier) {
        foundJob = jobsList.find(
          (j) =>
            j.slug === targetIdentifier ||
            j.id === targetIdentifier ||
            j.title.toLowerCase().includes(targetIdentifier.toLowerCase())
        );
      }

      if (!foundJob) {
        foundJob = jobsList.find(
          (j) =>
            j.slug === "giam-sat-bep" ||
            j.title.toLowerCase().includes("giám sát bếp")
        );
      }

      let defaultBranchText = "CN 14 (Quận 2): 210 Nguyễn Duy Trinh, Quận 2";
      const ndtBranch = branchesList.find(
        (b) =>
          b.address.toLowerCase().includes("nguyễn duy trinh") ||
          b.name.toLowerCase().includes("nguyễn duy trinh")
      );
      if (ndtBranch) {
        defaultBranchText = `CN ${ndtBranch.cnNumber} (${ndtBranch.district}): ${ndtBranch.address}`;
      }

      setFormData((prev) => ({
        ...prev,
        positionId: foundJob ? foundJob.id : (prev.positionId || "JOB-GS-BEP"),
        positionTitle: foundJob ? foundJob.title : (prev.positionTitle || "Giám sát Bếp Chi Nhánh"),
        appliedRegion: prev.appliedRegion || defaultBranchText,
      }));
    }
  }, [isOpen, defaultPositionSlug, defaultPositionId, jobsList, branchesList]);

  // Danh sách vị trí ưu tiên: "Giám sát Bếp Chi Nhánh" được đưa lên hàng đầu tiên
  const prioritizedJobsList = useMemo(() => {
    const gsJob = jobsList.find(
      (j) =>
        j.slug === "giam-sat-bep" ||
        j.title.toLowerCase().includes("giám sát bếp")
    );
    if (!gsJob) return jobsList;
    return [gsJob, ...jobsList.filter((j) => j.id !== gsJob.id)];
  }, [jobsList]);

  // Đối tượng Job đang được chọn hiện tại
  const selectedJob = useMemo(() => {
    return jobsList.find(
      (j) => j.id === formData.positionId || j.slug === formData.positionId || j.title === formData.positionTitle
    );
  }, [jobsList, formData.positionId, formData.positionTitle]);

  // Đối tượng Chi nhánh đang được chọn hiện tại
  const selectedBranch = useMemo(() => {
    if (!formData.appliedRegion || formData.appliedRegion.startsWith("Gần nhà nhất")) {
      return null;
    }
    return branchesList.find(
      (b) =>
        formData.appliedRegion.includes(b.address) ||
        formData.appliedRegion.includes(`CN ${b.cnNumber}`) ||
        formData.appliedRegion.includes(b.name)
    );
  }, [branchesList, formData.appliedRegion]);

  // Phân chia danh sách chi nhánh theo 5 cụm quận (Quận Đông • Quận Trung Tâm 2 • Quận Bắc • Quận Trung Tâm • Quận Tây)
  const regionGroups = useMemo(() => {
    return REGION_METADATA.map((meta) => {
      const branches = branchesList.filter(
        (b) => getBranchRegionKey(b) === meta.key
      );

      branches.sort((a, b) => {
        const isANdt =
          a.address.toLowerCase().includes("nguyễn duy trinh") ||
          a.name.toLowerCase().includes("nguyễn duy trinh");
        const isBNdt =
          b.address.toLowerCase().includes("nguyễn duy trinh") ||
          b.name.toLowerCase().includes("nguyễn duy trinh");
        if (isANdt && !isBNdt) return -1;
        if (!isANdt && isBNdt) return 1;
        return a.cnNumber - b.cnNumber;
      });

      return {
        key: meta.key,
        code: meta.code,
        title: meta.title,
        subtitle: meta.subtitle,
        branches,
      };
    }).filter((group) => group.branches.length > 0);
  }, [branchesList]);

  if (!isOpen) return null;

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const found = jobsList.find((p) => p.id === val || p.slug === val);
    setFormData((prev) => ({
      ...prev,
      positionId: val,
      positionTitle: found ? found.title : val,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Dung lượng file CV tối đa là 10MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCvFile({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!formData.positionId && !formData.positionTitle) {
      setErrorMsg("Vui lòng chọn vị trí muốn ứng tuyển");
      setLoading(false);
      return;
    }

    const regionToSend = formData.appliedRegion.trim();

    if (!regionToSend) {
      setErrorMsg("Vui lòng chọn khu vực chi nhánh hoặc chọn 'Gần nhà nhất'");
      setLoading(false);
      return;
    }

    const phoneTrimmed = formData.phoneZalo.trim();
    if (!phoneTrimmed) {
      setErrorMsg("Vui lòng nhập số điện thoại hoặc Zalo để HR liên hệ phỏng vấn");
      setLoading(false);
      return;
    }

    const emailTrimmed = formData.email.trim();
    if (emailTrimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setErrorMsg("Địa chỉ email không hợp lệ (ví dụ: tenban@gmail.com)");
        setLoading(false);
        return;
      }
    }

    const payload = {
      fullName: formData.fullName.trim() || "Ứng viên",
      age: formData.age.trim(),
      phoneZalo: phoneTrimmed,
      email: emailTrimmed,
      appliedRegion: regionToSend,
      positionId: selectedJob ? selectedJob.id : formData.positionId,
      positionTitle: selectedJob ? selectedJob.title : formData.positionTitle,
      salaryDisplay: selectedJob ? selectedJob.salaryDisplay : undefined,
      preferredBranch: selectedBranch ? `${selectedBranch.name} (${selectedBranch.address})` : regionToSend,
      cvFileName: cvFile ? cvFile.name : undefined,
      cvBase64: cvFile ? cvFile.base64 : undefined,
      cvFileSize: cvFile ? cvFile.size : undefined,
      cvFileType: cvFile ? cvFile.type : undefined,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gửi đơn không thành công");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Đã xảy ra sự cố kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setErrorMsg("");
    setCvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      fullName: "",
      age: "",
      phoneZalo: "",
      email: "",
      appliedRegion: "CN 14 (Quận 2): 210 Nguyễn Duy Trinh, Quận 2",
      positionId: "JOB-GS-BEP",
      positionTitle: "Giám sát Bếp Chi Nhánh",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg md:max-w-[615px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[96vh] sm:max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal - Gradient Option A (Đỏ son + Vàng đồng) */}
        <div className="bg-gradient-to-r from-[#8E1B24] via-[#5c1015] to-[#3A0910] text-white p-3 sm:p-4 md:p-5 px-4 sm:px-5 md:px-6 relative shrink-0 flex items-center justify-between gap-3 border-b border-[#C9963F]/30">
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5 min-w-0">
            <Image
              src="/logo.webp"
              alt="Lẩu Bò Trăm Rưỡi"
              width={48}
              height={48}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain shrink-0 drop-shadow-sm"
            />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg md:text-[21px] font-bold truncate leading-tight">{config.formTitle}</h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-red-100 truncate mt-0.5 leading-tight">
                {config.formSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Nút Submit ở Header (tránh lỗi bàn phím điện thoại che nút bên dưới) */}
            {!success && (
              <button
                type="submit"
                form="quick-apply-form"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-[#3A0910] font-black text-xs sm:text-sm md:text-base shadow-md flex items-center gap-1.5 md:gap-2 cursor-pointer disabled:opacity-70 transition-all shrink-0"
                title="Bấm để nộp đơn ứng tuyển ngay"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-[#3A0910] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#3A0910]" />
                    <span>Nộp đơn</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleResetAndClose}
              className="p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
              aria-label="Đóng"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto space-y-2.5 sm:space-y-3 md:space-y-4">
          {success ? (
            <div className="text-center py-4 sm:py-6 md:py-8">
              <CheckCircle2 className="w-14 h-14 md:w-16 md:h-16 text-emerald-500 mx-auto mb-3 md:mb-4 animate-bounce" />
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2">
                {config.successTitle}
              </h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 md:mb-5 max-w-sm md:max-w-md mx-auto">
                {config.successMessage}
              </p>
              <div className="p-3 md:p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs md:text-sm text-left mb-4 md:mb-5 space-y-1.5 md:space-y-2">
                <div>💡 <b>Lưu ý:</b> {config.successNote}</div>
                {formData.email && (
                  <div className="pt-1.5 md:pt-2 border-t border-emerald-200/60 text-emerald-950 font-medium leading-relaxed">
                    ✉️ Email xác nhận và hướng dẫn chi tiết đã được gửi tự động tới <b>{formData.email}</b>. Bạn vui lòng kiểm tra hộp thư nhé!
                  </div>
                )}
              </div>
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 md:py-3.5 bg-brand-800 hover:bg-brand-900 text-white font-semibold rounded-xl transition cursor-pointer text-sm md:text-base"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <form id="quick-apply-form" onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-4">
              {errorMsg && (
                <div className="p-2.5 md:p-3 bg-red-50 text-red-700 text-xs md:text-sm rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 1. VỊ TRÍ ỨNG TUYỂN & LƯƠNG (KHÔNG DUPLICATE, LƯƠNG TO NỔI BẬT NGANG TIÊU ĐỀ) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1 md:mb-1.5">
                  <span>Vị trí muốn ứng tuyển</span> <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-800 absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.positionId}
                    onChange={handlePositionChange}
                    className="w-full pl-8 md:pl-9.5 pr-7 py-2 md:py-2.5 text-xs sm:text-sm md:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white font-bold text-gray-900 truncate"
                    required
                  >
                    {prioritizedJobsList.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Khối LƯƠNG: Font size to ngang Tiêu đề title, nổi bật & không bị duplicate */}
                <div className="mt-1.5 md:mt-2 px-3 md:px-3.5 py-1.5 sm:py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-red-50/30 to-white border border-amber-200/80 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-amber-700 shrink-0" />
                    <span className="font-black text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#8E1B24] via-[#B83232] to-[#C9963F] bg-clip-text text-transparent truncate">
                      Lương: {selectedJob?.salaryDisplay || "Thoả thuận hấp dẫn"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    {/* Chỉ có học việc mới có thẻ Học nghề có lương */}
                    {isHocViecJob(selectedJob) && (
                      <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 uppercase tracking-wide shadow-xs">
                        Học nghề có lương
                      </span>
                    )}

                    {selectedJob?.workHours && (
                      <div className="text-[11px] md:text-xs text-gray-500 flex items-center gap-1 font-medium hidden sm:flex">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[130px] md:max-w-[170px]">{selectedJob.workHours}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 2. ĐỊA CHỈ CHI NHÁNH (KẾ BÊN ĐỊA CHỈ THÊM NÚT ĐIỀU HƯỚNG TỚI MAPS, BỎ HOTLINE, KHÔNG DUPLICATE) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1 md:mb-1.5">
                  <span>Địa chỉ chi nhánh làm việc</span> <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                  <div className="relative flex-1 min-w-0">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-800 absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.appliedRegion}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          appliedRegion: e.target.value,
                        }))
                      }
                      className="w-full pl-8 md:pl-9.5 pr-6 py-2 md:py-2.5 text-xs sm:text-sm md:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white font-medium text-gray-800 truncate"
                      required
                    >
                      <option value="" disabled hidden>
                        Chọn chi nhánh gần bạn nhất
                      </option>
                      <option value="Gần nhà nhất (HR liên hệ xếp chi nhánh thuận tiện)">
                        ⭐ Gần nhà nhất (HR sẽ liên hệ xếp chi nhánh gần bạn)
                      </option>
                      {regionGroups.map((group) => (
                        <optgroup
                          key={group.key}
                          label={`📍 ${group.title.toUpperCase()}`}
                          className="font-bold text-[#8E1B24] bg-amber-50/60"
                        >
                          {group.branches.map((b) => {
                            const branchText = `CN ${b.cnNumber} (${b.district}): ${b.address}`;
                            const displayAddr = b.address.includes(b.district)
                              ? b.address
                              : `${b.address}, ${b.district}`;
                            return (
                              <option
                                key={b.id}
                                value={branchText}
                                className="font-normal text-gray-800 bg-white"
                              >
                                CN {b.cnNumber} • {displayAddr}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Nút điều hướng tới Google Maps kế bên địa chỉ */}
                  <a
                    href={getBranchMapsUrl(selectedBranch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 sm:px-3 md:px-3.5 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/80 hover:from-amber-100 hover:to-amber-200 text-brand-950 border border-amber-300/80 text-xs md:text-sm font-bold flex items-center gap-1 md:gap-1.5 shrink-0 transition shadow-xs"
                    title="Chỉ đường Google Maps đến chi nhánh này"
                  >
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600 shrink-0" />
                    <span className="text-[11px] sm:text-xs md:text-sm">Bản đồ</span>
                    <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-800 shrink-0" />
                  </a>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 3. SỐ ĐIỆN THOẠI ZALO (ĐƯỢC ĐƯA LÊN TRÊN HỌ TÊN!) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1 md:mb-1.5 flex items-center justify-between">
                  <span>Số điện thoại Zalo <span className="text-red-500">*</span></span>
                  <span className="text-[11px] md:text-xs font-semibold text-emerald-700 normal-case">HR gọi sau 5 phút</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 md:w-4.5 md:h-4.5 text-brand-800 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0981256712 (để HR gọi phỏng vấn)"
                    value={formData.phoneZalo}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneZalo: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10.5 pr-3 py-2 md:py-2.5 text-sm md:text-base border-2 border-brand-700/60 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none font-bold text-brand-950 placeholder:font-normal placeholder:text-xs md:placeholder:text-sm bg-white shadow-xs"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 4. HỌ TÊN & TUỔI (OPTION TÙY CHỌN) */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 flex items-center justify-between">
                    <span>Họ và tên</span>
                    <span className="text-[10px] md:text-[11px] text-gray-400 font-normal">(Tùy chọn)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn An"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-700 focus:outline-none text-gray-800 placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 flex items-center justify-between">
                    <span>Tuổi</span>
                    <span className="text-[10px] md:text-[11px] text-gray-400 font-normal">(Tùy chọn)</span>
                  </label>
                  <input
                    type="number"
                    min={16}
                    max={60}
                    placeholder="VD: 20"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-700 focus:outline-none text-gray-800 placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 5. EMAIL ỨNG VIÊN (KHÔNG BẮT BUỘC) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-[11px] md:text-xs font-semibold text-gray-500 mb-0.5 md:mb-1 flex items-center justify-between">
                  <span>Email của bạn</span>
                  <span className="text-[10px] md:text-[11px] text-gray-400 font-normal">(Không bắt buộc)</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Khuyến khích điền email để nhận lịch phỏng vấn"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-8 md:pl-9.5 pr-2.5 md:pr-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-700 focus:outline-none text-gray-800 placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 6. ĐÍNH KÈM FILE CV (TÙY CHỌN, NHỎ GỌN) */}
              {/* ========================================================================= */}
              {config.allowCvUpload && (
                <div>
                  <div className="flex items-center justify-between mb-0.5 md:mb-1">
                    <label className="block text-[11px] md:text-xs font-semibold text-gray-500">
                      CV đính kèm <span className="text-gray-400 font-normal">(không bắt buộc)</span>
                    </label>
                    <span className="text-[10px] md:text-[11px] text-gray-400">PDF, Word, Ảnh ≤ 10MB</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  {cvFile ? (
                    <div className="flex items-center justify-between p-2 md:p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs md:text-sm">
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-950 truncate text-[11px] md:text-xs">
                          {cvFile.name}
                        </span>
                        <span className="text-emerald-700 text-[10px] md:text-[11px] shrink-0 font-medium">
                          ({formatFileSize(cvFile.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition shrink-0 cursor-pointer"
                        title="Xóa file CV"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 md:py-2.5 px-3 border border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-50/20 rounded-lg text-[11px] md:text-xs text-gray-500 hover:text-brand-900 transition flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer"
                    >
                      <FileUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-700" />
                      <span>Bấm vào đây để tải lên CV hoặc ảnh hồ sơ của bạn</span>
                    </button>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 7. NÚT SUBMIT BÊN DƯỚI (HIỂN THỊ RÕ RÀNG TRÊN PC KHÔNG CẦN SCROLL) */}
              {/* ========================================================================= */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 md:mt-2 py-2.5 sm:py-3 md:py-3.5 px-4 bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 active:scale-[0.99] text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 md:gap-2.5 cursor-pointer disabled:opacity-70 text-xs sm:text-sm md:text-base uppercase tracking-wide"
              >
                {loading ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Gửi Đơn Ứng Tuyển Ngay</span>
                  </>
                )}
              </button>

              <p className="text-[10px] md:text-xs text-gray-400 text-center font-medium">
                🔒 Cam kết không thu bất kỳ khoản phí nào khi phỏng vấn hoặc nhận việc.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
