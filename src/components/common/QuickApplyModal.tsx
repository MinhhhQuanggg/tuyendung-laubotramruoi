"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  Sparkles,
  MapPin,
  FileUp,
  FileText,
  Trash2,
  Briefcase,
  DollarSign,
  Clock,
  ExternalLink,
  Building2,
  Check,
  Mail,
} from "lucide-react";
import { QuickApplyConfig } from "@/types/quick-apply";
import { Branch } from "@/types/branch";
import { JobItem } from "@/types/job";

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

  const [branchesList, setBranchesList] = useState<Branch[]>([]);
  const [jobsList, setJobsList] = useState<JobItem[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneZalo: "",
    email: "",
    appliedRegion: "",
    positionId: "",
    positionTitle: "",
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

  // Tự động liên kết và chọn sẵn công việc nếu được truyền defaultPositionSlug hoặc defaultPositionId
  useEffect(() => {
    if (isOpen) {
      const targetIdentifier = defaultPositionSlug || defaultPositionId;
      if (targetIdentifier) {
        const foundJob = jobsList.find(
          (j) =>
            j.slug === targetIdentifier ||
            j.id === targetIdentifier ||
            j.title.toLowerCase().includes(targetIdentifier.toLowerCase())
        );

        if (foundJob) {
          setFormData((prev) => ({
            ...prev,
            positionId: foundJob.id,
            positionTitle: foundJob.title,
          }));
          return;
        }
      }
    }
  }, [isOpen, defaultPositionSlug, defaultPositionId, jobsList]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      setErrorMsg("Vui lòng nhập địa chỉ email của bạn để nhận xác nhận hồ sơ");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMsg("Địa chỉ email không hợp lệ (ví dụ: tenban@gmail.com)");
      setLoading(false);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      age: formData.age.trim(),
      phoneZalo: formData.phoneZalo.trim(),
      email: emailTrimmed,
      appliedRegion: regionToSend,
      positionId: selectedJob ? selectedJob.id : formData.positionId,
      positionTitle: selectedJob ? selectedJob.title : formData.positionTitle,
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
      appliedRegion: "",
      positionId: "",
      positionTitle: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#8B1818] via-[#6B1414] to-[#4A0D0D] text-white p-5 sm:p-6 relative shrink-0 flex items-center gap-3.5 pr-14">
          <Image
            src="/logo.webp"
            alt="Lẩu Bò Trăm Rưỡi"
            width={48}
            height={48}
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0 drop-shadow-sm"
          />
          <div>
            <h3 className="text-xl sm:text-[22px] font-bold">{config.formTitle}</h3>
            <p className="text-xs sm:text-sm text-red-100 mt-1">
              {config.formSubtitle}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {config.successTitle}
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                {config.successMessage}
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs text-left mb-6 space-y-2">
                <div>💡 <b>Lưu ý:</b> {config.successNote}</div>
                {formData.email && (
                  <div className="pt-2 border-t border-emerald-200/60 text-emerald-950 font-medium leading-relaxed">
                    ✉️ Email xác nhận và hướng dẫn chi tiết đã được gửi tự động tới <b>{formData.email}</b>. Bạn vui lòng kiểm tra hộp thư (cả mục Quảng cáo/Spam) nhé!
                  </div>
                )}
              </div>
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 bg-brand-800 hover:bg-brand-900 text-white font-semibold rounded-xl transition cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 1. VỊ TRÍ CÔNG VIỆC (LIÊN KẾT ĐỘNG VỚI DANH MỤC VIỆC LÀM) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Vị trí muốn ứng tuyển <span className="text-red-500">*</span></span>
                  {selectedJob && (
                    <span className="text-[11px] font-semibold text-brand-800 normal-case flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Đã liên kết việc làm
                    </span>
                  )}
                </label>

                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.positionId}
                    onChange={handlePositionChange}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white cursor-pointer ${
                      !formData.positionId
                        ? "text-gray-400 font-normal border-gray-300"
                        : "text-gray-900 font-bold border-brand-300 bg-brand-50/20"
                    }`}
                    required
                  >
                    <option value="" disabled hidden className="text-gray-400">
                      Hãy chọn vị trí công việc phù hợp
                    </option>
                    {jobsList.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.salaryDisplay || "Lương thỏa thuận"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Card Liên Kết Thông Tin Công Việc Đang Chọn */}
                {selectedJob && (
                  <div className="mt-2 p-3 rounded-2xl bg-gradient-to-r from-amber-50/80 via-brand-50/40 to-white border border-amber-200/70 text-xs space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-brand-950 text-sm">
                        {selectedJob.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 uppercase tracking-wide">
                        {selectedJob.category || "Tuyển gấp"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-gray-700 text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-brand-900">
                        <DollarSign className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Lương: {selectedJob.salaryDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 truncate">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{selectedJob.workHours || selectedJob.workTypeDisplay || "Ca xoay / linh hoạt"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* 2. ĐỊA CHỈ CHI NHÁNH (LIÊN KẾT ĐỘNG VỚI HỆ THỐNG CHI NHÁNH) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Địa chỉ chi nhánh làm việc <span className="text-red-500">*</span></span>
                  {selectedBranch && (
                    <span className="text-[11px] font-semibold text-brand-800 normal-case flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-600" />
                      {selectedBranch.district}
                    </span>
                  )}
                </label>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.appliedRegion}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        appliedRegion: e.target.value,
                      }))
                    }
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white cursor-pointer ${
                      !formData.appliedRegion
                        ? "text-gray-400 font-normal border-gray-300"
                        : "text-gray-900 font-bold border-brand-300 bg-brand-50/20"
                    }`}
                    required
                  >
                    <option value="" disabled hidden className="text-gray-400">
                      Hãy chọn chi nhánh gần bạn nhất
                    </option>

                    {/* Lựa chọn linh hoạt */}
                    <option value="Gần nhà nhất (HR liên hệ xếp chi nhánh thuận tiện)">
                      ⭐ Gần nhà nhất (HR sẽ liên hệ xếp chi nhánh gần bạn nhất)
                    </option>

                    {/* Danh sách các chi nhánh thực tế từ database / admin */}
                    {branchesList.map((b) => {
                      const branchText = `CN ${b.cnNumber} (${b.district}): ${b.address}`;
                      return (
                        <option key={b.id} value={branchText}>
                          CN {b.cnNumber} • {b.name} ({b.address}, {b.district})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Card Liên Kết Hiển Thị Địa Chỉ Chi Tiết */}
                {selectedBranch ? (
                  <div className="mt-2 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-black text-brand-950 text-sm">
                        <Building2 className="w-4 h-4 text-brand-800 shrink-0" />
                        <span>CN {selectedBranch.cnNumber} - {selectedBranch.name}</span>
                      </div>
                      {selectedBranch.mapUrl && (
                        <a
                          href={selectedBranch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 shrink-0"
                          title="Xem vị trí trên Google Maps"
                        >
                          <span>Bản đồ</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="text-gray-700 text-xs leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{selectedBranch.address}, {selectedBranch.district}, {selectedBranch.city || "TP.HCM"}</span>
                    </div>

                    {selectedBranch.phone && (
                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Hotline chi nhánh: <b>{selectedBranch.phone}</b></span>
                      </div>
                    )}
                  </div>
                ) : formData.appliedRegion.startsWith("Gần nhà nhất") ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-[11px] text-blue-900 leading-relaxed flex items-center gap-2">
                    <span>💡</span>
                    <span>
                      <b>Tuyệt vời!</b> Anh Kiên HR sẽ gọi điện hỏi địa chỉ nhà bạn và sắp xếp chi nhánh gần bạn nhất để tiện đi lại.
                    </span>
                  </div>
                ) : null}
              </div>

              {/* ========================================================================= */}
              {/* 3. HỌ TÊN & TUỔI */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Họ và tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tuổi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={16}
                    max={60}
                    placeholder="VD: 20"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 4. SỐ ĐIỆN THOẠI / ZALO */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại Zalo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0981256712 (để HR gọi phỏng vấn)"
                    value={formData.phoneZalo}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneZalo: e.target.value })
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none font-bold text-brand-950"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 5. EMAIL ỨNG VIÊN (BẮT BUỘC ĐỂ GỬI XÁC NHẬN TỰ ĐỘNG) */}
              {/* ========================================================================= */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Email của bạn <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-brand-800 font-semibold normal-case">
                    Nhận xác nhận & lịch phone check
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="VD: nguyenvanan@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-700 focus:outline-none font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 6. ĐÍNH KÈM FILE CV (NẾU ĐƯỢC BẬT TRONG CẤU HÌNH) */}
              {/* ========================================================================= */}
              {config.allowCvUpload && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      CV đính kèm <span className="text-gray-400 font-normal lowercase">(không bắt buộc)</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">PDF, Word, Ảnh ≤ 10MB</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  {cvFile ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-950 truncate">
                          {cvFile.name}
                        </span>
                        <span className="text-emerald-700 text-[11px] shrink-0 font-medium">
                          ({formatFileSize(cvFile.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition shrink-0 cursor-pointer"
                        title="Xóa file CV"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3.5 border border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-50/20 rounded-xl text-xs text-gray-600 hover:text-brand-900 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileUp className="w-4 h-4 text-brand-700" />
                      <span>Bấm vào đây để tải lên CV hoặc ảnh hồ sơ của bạn</span>
                    </button>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* 6. NÚT GỬI ĐƠN ỨNG TUYỂN */}
              {/* ========================================================================= */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-brand-950 active:scale-[0.99] text-white font-black rounded-xl shadow-lg shadow-brand-900/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm uppercase tracking-wide"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Đơn Ứng Tuyển Ngay</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center pt-1 font-medium">
                🔒 Cam kết không thu bất kỳ khoản phí nào khi phỏng vấn hoặc nhận việc.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
