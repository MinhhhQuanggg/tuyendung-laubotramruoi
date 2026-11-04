"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  Video,
  ImageIcon,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { JobItem, ConcisePoint } from "@/types/job";
import { extractFirstFrameFromFile } from "@/lib/video-thumbnail";

const POPULAR_ICONS = ["🔹", "🌙", "👤", "✨", "💰", "🛵", "🔥", "🍲", "⭐", "📍"];

const PRESET_AGE_TAGS = [
  "18 – 30 tuổi",
  "18 – 25 tuổi",
  "20 – 30 tuổi",
  "22 – 35 tuổi",
  "Đủ 18 tuổi trở lên",
  "Không giới hạn độ tuổi",
];

const PRESET_EXPERIENCE_TAGS = [
  "Chưa có kinh nghiệm (Đào tạo từ số 0)",
  "Không yêu cầu kinh nghiệm",
  "Ưu tiên kinh nghiệm F&B",
  "Kinh nghiệm 6 tháng – 1 năm",
  "Kinh nghiệm 1 – 2 năm",
  "Kinh nghiệm từ 2 năm trở lên",
  "Có tay nghề làm bếp / thớt",
  "Có kinh nghiệm phục vụ / order",
];

export default function JobDetailPageAdmin() {
  const params = useParams();
  const router = useRouter();
  const jobId = (params?.id as string) || "";

  const [job, setJob] = useState<JobItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [badgesInput, setBadgesInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "images">("images");
  const [newImageUrl, setNewImageUrl] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchJob = async () => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`);
      const data = await res.json();
      if (data.success && data.job) {
        setJob(data.job);
      } else {
        showToast(data.error || "Không tìm thấy thông tin vị trí", "error");
      }
    } catch {
      showToast("Lỗi khi tải thông tin vị trí", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  // Toggle active status
  const handleToggleActive = async () => {
    if (!job) return;
    const newStatus = !job.isActive;
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setJob({ ...job, isActive: newStatus });
        showToast(`Đã ${newStatus ? "bật hiển thị" : "ẩn"} vị trí "${job.title}"!`, "success");
      } else {
        showToast(data.error || "Không thể cập nhật trạng thái", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    }
  };

  // Copy shareable link
  const handleCopyLink = () => {
    if (!job) return;
    const url = `${window.location.origin}/viec-lam/${job.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    showToast("Đã sao chép liên kết tuyển dụng!", "success");
  };

  // Open Edit Form
  const handleOpenEdit = () => {
    if (!job) return;
    const images = job.images && Array.isArray(job.images) ? [...job.images].filter(Boolean) : [];

    // Lấy chính xác nội dung đang hiển thị bên trang chi tiết client
    const getClientContent = (j: JobItem): string => {
      if (j.concisePost) {
        const intro = (j.concisePost.intro || "").trim();
        const pointLines: string[] = [];

        if (j.concisePost.points && j.concisePost.points.length > 0) {
          j.concisePost.points.forEach((pt) => {
            const icon = pt.icon ? `${pt.icon} ` : "";
            const label = pt.label ? `${pt.label} ` : "";
            const content = pt.content || "";
            const line = `${icon}${label}${content}`.trim();
            if (line && (!intro || !intro.includes(line))) {
              pointLines.push(line);
            }
          });
        }

        if (pointLines.length > 0) {
          return intro ? `${intro}\n\n${pointLines.join("\n\n")}` : pointLines.join("\n\n");
        }
        return intro;
      }

      if (j.responsibilities && j.responsibilities.length > 0) {
        return j.responsibilities.map((r) => `• ${r}`).join("\n\n");
      }

      return "";
    };

    const existingContent = getClientContent(job);

    const concisePost = {
      headline: job.concisePost?.headline || "",
      intro: existingContent,
      points: [],
      zalo: job.contactZalo || job.concisePost?.zalo || "0981256712",
    };

    const currentBadges = job.badges && job.badges.length > 0
      ? job.badges.join(", ")
      : job.badge || "18–30 tuổi, Chưa có tay nghề";

    setBadgesInput(currentBadges);
    setEditingJob({
      ...job,
      images,
      videoUrl: job.videoUrl || "",
      videoPoster: job.videoPoster || "",
      concisePost,
    });
    setIsModalOpen(true);
  };

  // Add a new bullet point
  const handleAddPoint = () => {
    if (!editingJob || !editingJob.concisePost) return;
    const currentPoints = editingJob.concisePost.points || [];
    const updatedPoints = [
      ...currentPoints,
      { icon: "🔹", label: "Nội dung mới:", content: "Mô tả chi tiết quyền lợi hoặc công việc..." },
    ];
    setEditingJob({
      ...editingJob,
      concisePost: {
        ...editingJob.concisePost,
        points: updatedPoints,
      },
    });
  };

  // Remove a bullet point
  const handleRemovePoint = (index: number) => {
    if (!editingJob || !editingJob.concisePost) return;
    const updatedPoints = [...(editingJob.concisePost.points || [])];
    updatedPoints.splice(index, 1);
    setEditingJob({
      ...editingJob,
      concisePost: {
        ...editingJob.concisePost,
        points: updatedPoints,
      },
    });
  };

  // Update a bullet point
  const handleUpdatePoint = (index: number, field: keyof ConcisePoint, value: string) => {
    if (!editingJob || !editingJob.concisePost) return;
    const updatedPoints = [...(editingJob.concisePost.points || [])];
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    setEditingJob({
      ...editingJob,
      concisePost: {
        ...editingJob.concisePost,
        points: updatedPoints,
      },
    });
  };

  // Save Job
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.title) return;

    // Tự động đồng bộ Badges từ Độ tuổi & Kinh nghiệm
    const derivedBadges = [editingJob.ageRequirement, editingJob.experienceDisplay].filter(Boolean) as string[];
    const parsedBadges = derivedBadges.length > 0
      ? derivedBadges
      : (editingJob.badges || []);

    const cleanImages = (editingJob.images || []).filter((img) => Boolean(img && img.trim() !== ""));
    const jobToSave: JobItem = {
      ...editingJob,
      images: cleanImages,
      videoUrl: editingJob.videoUrl?.trim() || undefined,
      videoPoster: editingJob.videoPoster?.trim() || undefined,
      badges: parsedBadges,
      badge: parsedBadges.join(", "),
      contactZalo: editingJob.concisePost?.zalo || editingJob.contactZalo || "0981256712",
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobToSave.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobToSave),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Đã lưu thay đổi cho "${jobToSave.title}"!`, "success");
        setIsModalOpen(false);
        setJob(jobToSave);
      } else {
        showToast(data.error || "Không thể lưu dữ liệu", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi lưu dữ liệu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload video handler
  const handleUploadVideo = async (file: File) => {
    showToast("Đang tải video lên máy chủ...", "success");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        let thumb = "";
        try {
          thumb = await extractFirstFrameFromFile(file);
        } catch (e) {
          console.debug("Failed extracting video thumb:", e);
        }
        setEditingJob((prev) =>
          prev
            ? {
                ...prev,
                videoUrl: data.url,
                videoPoster: thumb || prev.videoPoster || "",
              }
            : prev
        );
        showToast("Đã tải video thành công!", "success");
      } else {
        showToast(data.error || "Tải video thất bại", "error");
      }
    } catch {
      showToast("Lỗi khi tải video", "error");
    }
  };

  // Upload multiple images handler (user có thể thêm bao nhiêu tùy thích)
  const handleUploadMultipleImages = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    showToast(`Đang tải ${fileList.length} ảnh lên...`, "success");
    try {
      const uploadedUrls: string[] = [];
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setEditingJob((prev) => {
          if (!prev) return prev;
          const current = (prev.images || []).filter(Boolean);
          return { ...prev, images: [...current, ...uploadedUrls] };
        });
        showToast(`Đã thêm thành công ${uploadedUrls.length} ảnh!`, "success");
      }
    } catch {
      showToast("Lỗi khi tải ảnh lên", "error");
    }
  };

  // Thay thế ảnh tại vị trí index
  const handleReplaceImage = async (file: File, index: number) => {
    showToast(`Đang thay đổi ảnh #${index + 1}...`, "success");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditingJob((prev) => {
          if (!prev) return prev;
          const updated = [...(prev.images || [])];
          updated[index] = data.url;
          return { ...prev, images: updated };
        });
        showToast(`Đã thay đổi ảnh #${index + 1} thành công!`, "success");
      }
    } catch {
      showToast("Lỗi khi tải ảnh", "error");
    }
  };

  // Thêm nhanh qua URL
  const handleAddQuickUrl = () => {
    if (!newImageUrl.trim() || !editingJob) return;
    const url = newImageUrl.trim();
    const isVideo =
      url.endsWith(".mp4") ||
      url.endsWith(".mov") ||
      url.endsWith(".webm") ||
      url.includes("/videos/");

    if (isVideo) {
      setEditingJob({ ...editingJob, videoUrl: url });
      showToast("Đã thêm link video!", "success");
    } else {
      const current = (editingJob.images || []).filter(Boolean);
      setEditingJob({ ...editingJob, images: [...current, url] });
      showToast("Đã thêm hình ảnh qua link!", "success");
    }
    setNewImageUrl("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Đang tải thông tin vị trí...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 max-w-md w-full text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy vị trí tuyển dụng</h2>
          <p className="text-sm text-gray-500 mb-6">Mã vị trí "{jobId}" không tồn tại hoặc đã bị xóa.</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 text-white font-bold text-sm shadow hover:bg-brand-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Quản Trị</span>
          </Link>
        </div>
      </div>
    );
  }

  // Display badges
  const displayBadges =
    job.badges && job.badges.length > 0
      ? job.badges
      : job.badge
      ? job.badge.split(",").map((s) => s.trim())
      : ["18–30 tuổi", "Chưa có tay nghề"];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold flex items-center gap-3 animate-in slide-in-from-bottom duration-200 ${
            toastMessage.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Danh Sách</span>
            </Link>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <span className="text-xs font-mono font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 hidden sm:inline">
              ID: {job.id}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle Status */}
            <button
              onClick={handleToggleActive}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                job.isActive
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${job.isActive ? "bg-emerald-600 animate-pulse" : "bg-gray-400"}`} />
              <span>{job.isActive ? "Đang Bật Tuyển" : "Đang Ẩn"}</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition flex items-center gap-1.5"
              title="Sao chép link ứng tuyển"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? "Đã chép" : "Chép link"}</span>
            </button>

            {/* View Live */}
            <Link
              href={`/viec-lam/${job.slug}`}
              target="_blank"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition flex items-center gap-1.5"
              title="Xem trang thực tế"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Xem Ngoài Web</span>
            </Link>

            {/* Edit Button */}
            <button
              onClick={handleOpenEdit}
              className="px-4 py-1.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh Sửa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Khớp 1:1 với bố cục trang Client */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI (70%): NỘI DUNG TUYỂN DỤNG THỰC TẾ TRÊN CLIENT */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80">
              {/* Badges, Tiêu đề, Lương */}
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {displayBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-100"
                    >
                      {badge}
                    </span>
                  ))}
                  {job.isUrgent && (
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
                      🔥 Tuyển gấp
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {job.title}
                </h1>

                <div className="mt-3 flex items-center text-lg sm:text-xl font-bold text-brand-900">
                  <span>💰 {job.salaryDisplay}</span>
                </div>
              </div>

              {/* Nội dung bài đăng thực tế (Intro + Points + Zalo) */}
              <div className="space-y-6">
                {/* Đoạn giới thiệu */}
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
                  {job.concisePost?.intro || "Chưa có đoạn giới thiệu."}
                </p>

                {/* Danh sách các gạch đầu dòng */}
                <div className="space-y-4 pt-1">
                  {job.concisePost?.points && job.concisePost.points.length > 0 ? (
                    job.concisePost.points.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3.5 text-base sm:text-lg text-gray-800 leading-relaxed"
                      >
                        <span className="text-2xl shrink-0 mt-0.5 select-none">{point.icon}</span>
                        <div>
                          {point.label && (
                            <span className="font-bold text-gray-950 mr-1.5">{point.label}</span>
                          )}
                          <span>{point.content}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa có các gạch đầu dòng chi tiết.</p>
                  )}

                  {/* Dòng liên hệ Zalo */}
                  <div className="flex items-center gap-3.5 text-base sm:text-lg pt-4 border-t border-gray-100">
                    <span className="text-2xl shrink-0 select-none">📲</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-950">Zl:</span>
                      <a
                        href={`https://zalo.me/${(job.concisePost?.zalo || job.contactZalo || "0981256712").replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-black text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-2"
                      >
                        <span>{job.concisePost?.zalo || job.contactZalo || "0981256712"}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          Nhắn Zalo Phỏng Vấn
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút chỉnh sửa nhanh */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Trang hiển thị này giống hệt những gì ứng viên xem trên website.
                </span>
                <button
                  onClick={handleOpenEdit}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-brand-900 text-xs font-bold transition flex items-center gap-1.5 border border-amber-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Nội Dung Này</span>
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (30%): MEDIA THỰC TẾ (VIDEO & HÌNH ẢNH) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box Video */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-600" />
                  <span>Video Công Việc</span>
                </span>
                <button
                  onClick={handleOpenEdit}
                  className="text-xs font-bold text-brand-900 hover:underline"
                >
                  Đổi video
                </button>
              </div>

              {job.videoUrl ? (
                <div className="rounded-2xl overflow-hidden aspect-[9/16] bg-black border border-gray-200 shadow-inner">
                  <video
                    src={job.videoUrl.includes("#t=") ? job.videoUrl : `${job.videoUrl}#t=0.001`}
                    poster={job.videoPoster && !job.videoPoster.includes("/images/jobs/") ? job.videoPoster : undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 aspect-[9/16] flex flex-col items-center justify-center p-6 text-center text-gray-400">
                  <Video className="w-10 h-10 mb-2 text-gray-300" />
                  <p className="text-xs font-semibold">Chưa có video</p>
                  <button
                    onClick={handleOpenEdit}
                    className="mt-2 text-xs font-bold text-brand-900 underline"
                  >
                    + Tải video lên
                  </button>
                </div>
              )}
            </div>

            {/* Box Hình Ảnh */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Hình Ảnh Thực Tế ({job.images?.length || 0})</span>
                </span>
                <button
                  onClick={handleOpenEdit}
                  className="text-xs font-bold text-brand-900 hover:underline"
                >
                  Quản lý ảnh
                </button>
              </div>

              {job.images && job.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {job.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200"
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Chưa có hình ảnh</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL CHỈNH SỬA VỊ TRÍ - TINH GỌN KHỚP 100% VỚI CLIENT */}
      {/* ========================================================================= */}
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-brand-900 to-[#701313] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white">Chỉnh Sửa Vị Trí: {editingJob.title}</h3>
                  <p className="text-xs text-white/70">Cập nhật đúng nội dung xuất hiện trên trang tuyển dụng</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveJob} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* SECTION 1: TIÊU ĐỀ, MỨC LƯƠNG & TRẠNG THÁI */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span>📌 1. Tiêu Đề, Mức Lương & Trạng Thái</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Tên Vị Trí *</label>
                    <input
                      type="text"
                      required
                      value={editingJob.title}
                      onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                      placeholder="VD: Học việc bếp"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold text-gray-900 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Mức Lương Hiển Thị *</label>
                    <input
                      type="text"
                      required
                      value={editingJob.salaryDisplay}
                      onChange={(e) => setEditingJob({ ...editingJob, salaryDisplay: e.target.value })}
                      placeholder="VD: 7,5 - 10 triệu/tháng"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold text-brand-900 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Số Zalo Liên Hệ Phỏng Vấn</label>
                    <input
                      type="text"
                      value={editingJob.concisePost?.zalo || editingJob.contactZalo || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingJob({
                          ...editingJob,
                          contactZalo: val,
                          concisePost: {
                            ...(editingJob.concisePost || { headline: "", intro: "", points: [] }),
                            zalo: val,
                          },
                        });
                      }}
                      placeholder="VD: 0981256712"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold text-xs text-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={editingJob.isUrgent}
                      onChange={(e) => setEditingJob({ ...editingJob, isUrgent: e.target.checked })}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                    />
                    <span>🔥 Tuyển gấp</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={editingJob.isActive}
                      onChange={(e) => setEditingJob({ ...editingJob, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Đang bật hiển thị trên Website</span>
                  </label>
                </div>
              </div>

              {/* SECTION 2: THẺ YÊU CẦU ĐỘ TUỔI (TAGS CHECKBOX + INPUT THỦ CÔNG) */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <span>🎂 2. Yêu Cầu Độ Tuổi (Thẻ Bật/Tắt & Điền Thủ Công)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Bấm vào thẻ để chọn/bỏ chọn độ tuổi, hoặc tự điền thủ công nếu không có thẻ phù hợp.
                    </p>
                  </div>
                  {editingJob.ageRequirement && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đang chọn: <strong>{editingJob.ageRequirement}</strong></span>
                    </span>
                  )}
                </div>

                {/* Danh sách thẻ độ tuổi dạng Pill Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {PRESET_AGE_TAGS.map((tag) => {
                    const isSelected = editingJob.ageRequirement === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const nextAge = isSelected ? "" : tag;
                          setEditingJob({
                            ...editingJob,
                            ageRequirement: nextAge,
                          });
                        }}
                        className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 shadow-sm ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/30"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-transparent" />
                          )}
                        </span>

                        <span>{tag}</span>

                        {isSelected ? (
                          <X className="w-3.5 h-3.5 text-emerald-700 hover:text-red-600 transition" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Input thủ công độ tuổi */}
                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold text-gray-700 shrink-0">
                    Hoặc tự điền độ tuổi thủ công:
                  </span>
                  <input
                    type="text"
                    value={editingJob.ageRequirement || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, ageRequirement: e.target.value })}
                    placeholder="Nhập độ tuổi tùy chỉnh nếu không có thẻ tag phù hợp (VD: 19 – 27 tuổi)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* SECTION 3: THẺ YÊU CẦU KINH NGHIỆM (TAGS CHECKBOX + INPUT THỦ CÔNG) */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <span>⭐ 3. Yêu Cầu Kinh Nghiệm (Thẻ Bật/Tắt & Điền Thủ Công)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Bấm vào thẻ để chọn/bỏ chọn yêu cầu kinh nghiệm, hoặc tự điền kinh nghiệm thủ công.
                    </p>
                  </div>
                  {editingJob.experienceDisplay && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đang chọn: <strong>{editingJob.experienceDisplay}</strong></span>
                    </span>
                  )}
                </div>

                {/* Danh sách thẻ kinh nghiệm dạng Pill Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {PRESET_EXPERIENCE_TAGS.map((tag) => {
                    const isSelected = editingJob.experienceDisplay === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const nextExp = isSelected ? "" : tag;
                          setEditingJob({
                            ...editingJob,
                            experienceDisplay: nextExp,
                          });
                        }}
                        className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 shadow-sm ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/30"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-transparent" />
                          )}
                        </span>

                        <span>{tag}</span>

                        {isSelected ? (
                          <X className="w-3.5 h-3.5 text-emerald-700 hover:text-red-600 transition" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Input thủ công kinh nghiệm */}
                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold text-gray-700 shrink-0">
                    Hoặc tự điền kinh nghiệm thủ công:
                  </span>
                  <input
                    type="text"
                    value={editingJob.experienceDisplay || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, experienceDisplay: e.target.value })}
                    placeholder="Nhập yêu cầu kinh nghiệm khác nếu có (VD: Ưu tiên có kinh nghiệm làm đồ nướng)..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* SECTION 4: NỘI DUNG CÔNG VIỆC */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span>📝 4. Nội Dung Công Việc</span>
                </h4>

                {/* Long Text (Intro) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700 block">Nội dung công việc *</label>
                    <span className="text-[11px] text-gray-400">Hiển thị nổi bật ở trang chi tiết</span>
                  </div>
                  <textarea
                    rows={6}
                    value={editingJob.concisePost?.intro || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        concisePost: {
                          ...(editingJob.concisePost || { headline: "", points: [], zalo: "" }),
                          intro: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs leading-relaxed bg-white"
                  />
                </div>
              </div>

              {/* SECTION 5: QUẢN LÝ MEDIA TỰ DO (VIDEO & ẢNH KHÔNG GIỚI HẠN) */}
              <div className="space-y-4 bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-800" />
                      <span>📸 5. Quản Lý Media: Video & Hình Ảnh Tự Do</span>
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Thêm video và hình ảnh tùy thích (không giới hạn số lượng). Bấm icon để tải từ máy hoặc dán link.
                    </p>
                  </div>

                  {/* Icon Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Icon Thêm Video */}
                    <label
                      className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition active:scale-95 shrink-0"
                      title={editingJob.videoUrl ? "Đổi video" : "Thêm video"}
                    >
                      <Video className="w-4 h-4" />
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleUploadVideo(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {/* Icon Thêm Hình Ảnh */}
                    <label
                      className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition active:scale-95 shrink-0"
                      title="Thêm ảnh (Chọn nhiều ảnh)"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleUploadMultipleImages(e.target.files);
                          }
                        }}
                      />
                    </label>

                    {/* Dán link trực tiếp */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Dán link ảnh/video..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddQuickUrl();
                          }
                        }}
                        className="w-36 sm:w-44 px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:ring-1 focus:ring-brand-700 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddQuickUrl}
                        className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs transition"
                        title="Thêm link này"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>

                {/* HÀNG MEDIA NẰM TRÊN 1 HÀNG CUỘN NGANG (CHỈ HIỂN THỊ KHI CÓ MEDIA ĐƯỢC THÊM) */}
                {Boolean(editingJob.videoUrl || (editingJob.images && editingJob.images.filter(Boolean).length > 0)) ? (
                  <div className="overflow-x-auto pb-3 pt-1 -mx-1 px-1 scrollbar-thin">
                    <div className="flex items-start gap-3 min-w-max">
                      
                      {/* THẺ VIDEO (CHỈ HIỂN THỊ KHI ĐÃ THÊM VIDEO) */}
                      {editingJob.videoUrl && (
                        <div className="w-40 sm:w-44 aspect-[3/4] bg-white p-2 rounded-2xl border-2 border-red-300 shadow-sm flex flex-col justify-between shrink-0 relative group">
                          <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-1 z-10">
                            <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-[10px]">
                              <Video className="w-3 h-3 text-red-600" /> Video
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Xóa video này?")) {
                                  setEditingJob({ ...editingJob, videoUrl: "", videoPoster: "" });
                                  showToast("Đã xóa video!", "success");
                                }
                              }}
                              className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition shadow-sm"
                              title="Xóa video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Video player */}
                          <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                            <video
                              controls
                              playsInline
                              preload="metadata"
                              poster={editingJob.videoPoster && !editingJob.videoPoster.includes("/images/jobs/") ? editingJob.videoPoster : undefined}
                              className="w-full h-full object-cover"
                              key={editingJob.videoUrl}
                            >
                              <source src={editingJob.videoUrl.includes("#t=") ? editingJob.videoUrl : `${editingJob.videoUrl}#t=0.001`} type="video/mp4" />
                            </video>
                          </div>

                          {/* Đổi video */}
                          <label className="cursor-pointer mt-1.5 w-full text-center py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] border border-red-200 transition flex items-center justify-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>Đổi video</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadVideo(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      )}

                      {/* CÁC THẺ HÌNH ẢNH (CHỈ HIỂN THỊ CÁC ẢNH ĐÃ THÊM, HIỂN THỊ DẦN DẦN, KHÔNG CÓ THẺ TRỐNG) */}
                      {(editingJob.images || []).filter(Boolean).map((img, idx) => (
                        <div
                          key={idx}
                          className="w-40 sm:w-44 aspect-[3/4] bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between shrink-0 relative group"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1 z-10">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                              Ảnh #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = (editingJob.images || []).filter(Boolean);
                                current.splice(idx, 1);
                                setEditingJob({ ...editingJob, images: current });
                                showToast(`Đã xóa ảnh #${idx + 1}!`, "success");
                              }}
                              className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition shadow-sm"
                              title="Xóa ảnh này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Image Preview */}
                          <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <Image
                              src={img}
                              alt={`Ảnh ${idx + 1}`}
                              fill
                              unoptimized={img.startsWith("http") || img.startsWith("data:")}
                              className="object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>

                          {/* Đổi ảnh này */}
                          <label className="cursor-pointer mt-1.5 w-full text-center py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-[10px] border border-gray-200 transition flex items-center justify-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>Đổi ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleReplaceImage(e.target.files[0], idx);
                                }
                              }}
                            />
                          </label>
                        </div>
                      ))}

                    </div>
                  </div>
                ) : (
                  <div className="py-6 px-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/40 text-center">
                    <p className="text-xs font-medium text-amber-900/70">
                      Chưa có video hoặc ảnh nào. Bấm vào icon <strong>Video</strong> hoặc <strong>Ảnh</strong> ở trên để thêm.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 font-bold text-gray-700"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
