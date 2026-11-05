"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Edit3,
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
  Eye,
} from "lucide-react";
import { JobItem, JobCategory } from "@/types/job";
import { extractFirstFrameFromFile } from "@/lib/video-thumbnail";
import { uploadMediaFile } from "@/lib/upload-client";
import { slugify } from "@/lib/utils";
import { savePreviewDraft } from "@/lib/job-preview";

const CATEGORIES: JobCategory[] = [
  "Học nghề có lương",
  "Part-time, Thời vụ",
  "Full-time",
  "Trưởng, Quản lý",
];

const PRESET_AGE_TAGS = [
  "18 – 30 tuổi",
  "18 – 25 tuổi",
  "20 – 30 tuổi",
  "22 – 35 tuổi",
  "25 – 35 tuổi",
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

interface AdminDetailToolbarProps {
  initialJob: JobItem;
}

export default function AdminDetailToolbar({ initialJob }: AdminDetailToolbarProps) {
  const router = useRouter();
  const [job, setJob] = useState<JobItem>(initialJob);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickMediaUrl, setQuickMediaUrl] = useState("");

  // Khóa cuộn trang nền khi mở modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const notifyJobsUpdated = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("jobs-updated"));
      try {
        if ("BroadcastChannel" in window) {
          const ch = new BroadcastChannel("jobs-sync");
          ch.postMessage({ type: "jobs-updated" });
          ch.close();
        }
      } catch {}
    }
  };

  // Toggle active status
  const handleToggleActive = async () => {
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
        notifyJobsUpdated();
        showToast(`Đã ${newStatus ? "bật hiển thị" : "ẩn"} vị trí "${job.title}"!`, "success");
        router.refresh();
      } else {
        showToast(data.error || "Không thể cập nhật trạng thái", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    }
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/viec-lam/${job.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    showToast("Đã sao chép liên kết tuyển dụng!", "success");
  };

  // Open Edit Form
  const handleOpenEdit = () => {
    const images = job.images && Array.isArray(job.images) ? [...job.images].filter(Boolean) : [];

    // Lấy chính xác nội dung đang hiển thị bên trang chi tiết
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

    setEditingJob({
      ...job,
      showInMenu: job.showInMenu !== false,
      menuPlacement: job.menuPlacement || "PARENT",
      parentMenu: job.parentMenu || job.category || "Học nghề có lương",
      images,
      videoUrl: job.videoUrl || "",
      videoPoster: job.videoPoster || "",
      concisePost: {
        headline: job.concisePost?.headline || "",
        intro: existingContent,
        points: [],
        zalo: job.contactZalo || job.concisePost?.zalo || "0981256712",
      },
    });
    setQuickMediaUrl("");
    setIsModalOpen(true);
  };

  // Save Job
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.title) return;

    setIsSubmitting(true);
    try {
      const finalSlug = slugify(editingJob.slug || editingJob.title || "");
      const derivedBadges = [editingJob.ageRequirement, editingJob.experienceDisplay].filter(Boolean) as string[];
      const cleanImages = (editingJob.images || []).filter((img) => Boolean(img && img.trim() !== ""));

      const jobPayload: JobItem = {
        ...editingJob,
        showInMenu: editingJob.showInMenu !== false,
        menuPlacement: editingJob.menuPlacement || "PARENT",
        parentMenu:
          editingJob.menuPlacement === "PARENT"
            ? (editingJob.parentMenu || editingJob.category || "Học nghề có lương")
            : undefined,
        slug: finalSlug,
        images: cleanImages,
        videoUrl: editingJob.videoUrl?.trim() || undefined,
        videoPoster: editingJob.videoPoster?.trim() || undefined,
        badges: derivedBadges.length > 0 ? derivedBadges : (editingJob.badges || []),
        badge: derivedBadges.join(", "),
        contactZalo: editingJob.contactZalo || editingJob.concisePost?.zalo || "0981256712",
      };

      const res = await fetch(`/api/admin/jobs/${jobPayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Đã lưu thay đổi cho "${jobPayload.title}"!`, "success");
        setIsModalOpen(false);
        const prevSlug = job.slug;
        setJob(jobPayload);
        notifyJobsUpdated();

        // Chuyển hướng nếu đổi slug hoặc refresh dữ liệu trang
        if (prevSlug !== finalSlug) {
          const isAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
          window.location.href = isAdminRoute
            ? `/admin/viec-lam/${finalSlug}`
            : `/viec-lam/${finalSlug}`;
        } else {
          router.refresh();
        }
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
    try {
      const data = await uploadMediaFile(file);
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

  // Upload multiple images handler
  const handleUploadMultipleImages = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    showToast(`Đang tải ${fileList.length} ảnh lên...`, "success");
    try {
      const uploadedUrls: string[] = [];
      for (const file of fileList) {
        const data = await uploadMediaFile(file);
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

  // Replace image at index
  const handleReplaceImage = async (file: File, index: number) => {
    showToast(`Đang thay đổi ảnh #${index + 1}...`, "success");
    try {
      const data = await uploadMediaFile(file);
      if (data.success && data.url) {
        const newImageUrl = data.url;
        setEditingJob((prev) => {
          if (!prev) return prev;
          const updated = [...(prev.images || [])];
          updated[index] = newImageUrl;
          return { ...prev, images: updated };
        });
        showToast(`Đã thay đổi ảnh #${index + 1} thành công!`, "success");
      } else {
        showToast(data.error || "Tải ảnh thất bại", "error");
      }
    } catch {
      showToast("Lỗi khi tải ảnh", "error");
    }
  };

  // Quick URL
  const handleAddQuickUrl = () => {
    if (!quickMediaUrl.trim() || !editingJob) return;
    const url = quickMediaUrl.trim();
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
    setQuickMediaUrl("");
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-[10000] px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold flex items-center gap-3 animate-in slide-in-from-bottom duration-200 ${
            toastMessage.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Action Buttons (Gộp trực tiếp vào Banner) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Toggle Status */}
        <button
          type="button"
          onClick={handleToggleActive}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm shadow-sm ${
            job.isActive
              ? "bg-emerald-500/25 text-emerald-100 border border-emerald-300/40 hover:bg-emerald-500/35"
              : "bg-red-500/30 text-red-100 border border-red-300/40 hover:bg-red-500/40"
          }`}
          title="Nhấp để bật / ẩn vị trí tuyển dụng"
        >
          <span className={`w-2 h-2 rounded-full ${job.isActive ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
          <span>{job.isActive ? "Đang Bật Tuyển" : "Đang Ẩn"}</span>
        </button>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-white/20 backdrop-blur-sm shadow-sm"
          title="Sao chép link trang"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copiedLink ? "Đã chép" : "Chép link"}</span>
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={handleOpenEdit}
          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black shadow-md transition flex items-center gap-1.5 active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Chỉnh Sửa Vị Trí</span>
        </button>
      </div>

      {/* MODAL CHỈNH SỬA VỊ TRÍ */}
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 text-gray-900">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-brand-900 to-[#701313] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white">Chỉnh Sửa Vị Trí: {editingJob.title}</h3>
                  <p className="text-xs text-white/70">ID: {editingJob.id} • Slug: /viec-lam/{editingJob.slug || "(Tự động)"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveJob} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* SECTION 1: TIÊU ĐỀ, SLUG, MỨC LƯƠNG & HOTLINE */}
              <div className="space-y-4 bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <span>📌 1. Tiêu Đề Công Việc & Mức Lương</span>
                </h4>

                {/* Hàng 1: Tiêu đề công việc & Slug URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Tiêu đề công việc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingJob.title || ""}
                      onChange={(e) => {
                        const title = e.target.value;
                        const autoSlug = slugify(title);
                        const shouldAutoSlug = !editingJob.slug || editingJob.slug === slugify(editingJob.title || "");
                        setEditingJob({
                          ...editingJob,
                          title,
                          slug: shouldAutoSlug ? autoSlug : editingJob.slug,
                        });
                      }}
                      placeholder="Ví dụ: Lái xe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-brand-700 outline-none bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">
                        Đường dẫn Slug (URL) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingJob.title) {
                            setEditingJob({
                              ...editingJob,
                              slug: slugify(editingJob.title),
                            });
                          }
                        }}
                        className="text-[11px] text-brand-900 font-semibold hover:underline"
                        title="Tự động đồng bộ slug theo tiêu đề"
                      >
                        Đồng bộ tiêu đề
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-gray-400 font-mono select-none pointer-events-none">
                        /viec-lam/
                      </span>
                      <input
                        type="text"
                        required
                        value={editingJob.slug || ""}
                        onChange={(e) => {
                          setEditingJob({
                            ...editingJob,
                            slug: slugify(e.target.value),
                          });
                        }}
                        placeholder="lai-xe"
                        className="w-full pl-24 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-bold text-brand-950 focus:ring-2 focus:ring-brand-700 outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Hàng 2: Mức lương hiển thị & Số Hotline / Zalo (Đưa xuống dòng rộng rãi) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mức lương hiển thị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingJob.salaryDisplay || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, salaryDisplay: e.target.value })}
                      placeholder="Ví dụ: 7,5 - 10 triệu/tháng"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-black text-brand-900 focus:ring-2 focus:ring-brand-700 outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Số Hotline / Zalo liên hệ phỏng vấn
                    </label>
                    <input
                      type="text"
                      value={editingJob.contactZalo || editingJob.concisePost?.zalo || "0981256712"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingJob({
                          ...editingJob,
                          contactZalo: val,
                          concisePost: editingJob.concisePost
                            ? { ...editingJob.concisePost, zalo: val }
                            : undefined,
                        });
                      }}
                      placeholder="0981256712"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-brand-700 outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Urgent & Active Toggles */}
                <div className="flex flex-wrap gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingJob.isActive ?? true}
                      onChange={(e) => setEditingJob({ ...editingJob, isActive: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-gray-800">Hiển thị bài đăng trên website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingJob.isUrgent ?? false}
                      onChange={(e) => setEditingJob({ ...editingJob, isUrgent: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-xs font-bold text-red-700">Đánh dấu tuyển gấp (Urgent 🔥)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer" title="Hiển thị công việc này trong danh mục menu trên thanh điều hướng Header">
                    <input
                      type="checkbox"
                      checked={editingJob.showInMenu !== false}
                      onChange={(e) => setEditingJob({ ...editingJob, showInMenu: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <span>Hiển thị trên Menu điều hướng</span>
                      {!(editingJob.isActive ?? true) && (
                        <span className="text-[11px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          (tự động ẩn khi bài đăng Tắt)
                        </span>
                      )}
                    </span>
                  </label>
                </div>

                {/* Khối tùy chọn vị trí hiển thị Menu khi showInMenu = true */}
                {editingJob.showInMenu !== false && (
                  <div className="mt-3 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Vị trí hiển thị trên Menu điều hướng:</span>
                      </span>
                      {!(editingJob.isActive ?? true) ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                          ⚠️ Đang tạm ẩn trên Header vì bài đăng Tắt
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Đang sẵn sàng hiển thị trên Header
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Lựa chọn 1: Gắn vào menu cha có sẵn */}
                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          (editingJob.menuPlacement || "PARENT") === "PARENT"
                            ? "bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20"
                            : "bg-white/60 border-blue-100 hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="detailJobMenuPlacement"
                          value="PARENT"
                          checked={(editingJob.menuPlacement || "PARENT") === "PARENT"}
                          onChange={() =>
                            setEditingJob({
                              ...editingJob,
                              menuPlacement: "PARENT",
                              parentMenu: editingJob.parentMenu || editingJob.category || "Học nghề có lương",
                            })
                          }
                          className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-gray-800 block">
                            📂 Gắn vào Menu cha có sẵn (Dropdown)
                          </span>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            Nằm trong danh sách thả xuống của menu cha được chọn
                          </span>
                        </div>
                      </label>

                      {/* Lựa chọn 2: Hiển thị trực tiếp ở menu điều hướng */}
                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          editingJob.menuPlacement === "DIRECT"
                            ? "bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20"
                            : "bg-white/60 border-blue-100 hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="detailJobMenuPlacement"
                          value="DIRECT"
                          checked={editingJob.menuPlacement === "DIRECT"}
                          onChange={() =>
                            setEditingJob({
                              ...editingJob,
                              menuPlacement: "DIRECT",
                            })
                          }
                          className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-gray-800 block">
                            📌 Hiển thị ở Menu điều hướng (Trực tiếp)
                          </span>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            Tên job hiển thị trực tiếp như một nút bấm trên thanh Header
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Chọn Menu cha khi chọn PARENT */}
                    {(editingJob.menuPlacement || "PARENT") === "PARENT" && (
                      <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                          Chọn Menu cha gắn vào:
                        </label>
                        <select
                          value={editingJob.parentMenu || editingJob.category || "Học nghề có lương"}
                          onChange={(e) =>
                            setEditingJob({
                              ...editingJob,
                              parentMenu: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-xs font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              📁 {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 2: ĐỘ TUỔI */}
              <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                      <span>🎂 2. Yêu Cầu Độ Tuổi (Thẻ Bật/Tắt & Điền Thủ Công)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Bấm vào thẻ để chọn/bỏ chọn độ tuổi, hoặc tự điền độ tuổi thủ công bên dưới.
                    </p>
                  </div>
                  {editingJob.ageRequirement && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
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
                          const currentBadges = editingJob.badges ? [...editingJob.badges] : [];
                          const filteredBadges = currentBadges.filter((b) => !PRESET_AGE_TAGS.includes(b));
                          if (nextAge) filteredBadges.unshift(nextAge);
                          setEditingJob({
                            ...editingJob,
                            ageRequirement: nextAge,
                            badges: filteredBadges,
                            badge: filteredBadges.join(", "),
                          });
                        }}
                        className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 shadow-sm ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/30"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
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

                {/* Input thủ công nếu không có thẻ phù hợp */}
                <div className="pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <div className="text-xs font-bold text-gray-700 shrink-0 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Hoặc tự điền độ tuổi thủ công:</span>
                  </div>
                  <input
                    type="text"
                    value={editingJob.ageRequirement || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingJob({
                        ...editingJob,
                        ageRequirement: val,
                      });
                    }}
                    placeholder="Nhập độ tuổi tùy chỉnh (VD: 25 – 35 tuổi, Đủ 20 tuổi trở lên)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* SECTION 3: KINH NGHIỆM */}
              <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                      <span>⭐ 3. Yêu Cầu Kinh Nghiệm (Thẻ Bật/Tắt & Điền Thủ Công)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Bấm vào thẻ để chọn/bỏ chọn yêu cầu kinh nghiệm, hoặc tự điền kinh nghiệm thủ công.
                    </p>
                  </div>
                  {editingJob.experienceDisplay && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
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
                          const currentBadges = editingJob.badges ? [...editingJob.badges] : [];
                          const filteredBadges = currentBadges.filter((b) => !PRESET_EXPERIENCE_TAGS.includes(b));
                          if (nextExp) filteredBadges.push(nextExp);
                          setEditingJob({
                            ...editingJob,
                            experienceDisplay: nextExp,
                            badges: filteredBadges,
                            badge: filteredBadges.join(", "),
                          });
                        }}
                        className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 shadow-sm ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/30"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
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
                <div className="pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <div className="text-xs font-bold text-gray-700 shrink-0 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Hoặc tự điền kinh nghiệm thủ công:</span>
                  </div>
                  <input
                    type="text"
                    value={editingJob.experienceDisplay || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingJob({
                        ...editingJob,
                        experienceDisplay: val,
                      });
                    }}
                    placeholder="Nhập yêu cầu kinh nghiệm khác nếu có (VD: Kinh nghiệm từ 2 năm trở lên)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* SECTION 4: NỘI DUNG CÔNG VIỆC */}
              <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
                  <span>📝 4. Nội Dung Công Việc</span>
                </h4>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Nội dung công việc <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400">Hỗ trợ xuống dòng tự nhiên, hiển thị đồng bộ như bài viết</span>
                  </div>
                  <textarea
                    rows={6}
                    value={editingJob.concisePost?.intro || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        concisePost: {
                          ...editingJob.concisePost,
                          headline: editingJob.concisePost?.headline || "",
                          intro: e.target.value,
                          points: editingJob.concisePost?.points || [],
                          zalo: editingJob.concisePost?.zalo || editingJob.contactZalo || "0981256712",
                        },
                      })
                    }
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-700 outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 5: MEDIA (VIDEO & HÌNH ẢNH) */}
              <div className="space-y-4 bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-800" />
                      <span>📸 5. Quản Lý Media: Video & Hình Ảnh Tự Do</span>
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-0.5">
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
                        value={quickMediaUrl}
                        onChange={(e) => setQuickMediaUrl(e.target.value)}
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

                {/* HÀNG MEDIA NẰM TRÊN 1 HÀNG CUỘN NGANG */}
                {Boolean(editingJob.videoUrl || (editingJob.images && editingJob.images.filter(Boolean).length > 0)) ? (
                  <div className="overflow-x-auto pb-3 pt-1 -mx-1 px-1 scrollbar-thin">
                    <div className="flex items-start gap-3 min-w-max">
                      {/* THẺ VIDEO */}
                      {editingJob.videoUrl && (
                        <div className="w-40 sm:w-44 aspect-[3/4] bg-white p-2 rounded-2xl border-2 border-red-300 shadow-sm flex flex-col justify-between shrink-0 relative group">
                          <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-1 z-10">
                            <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-[10px]">
                              <Video className="w-3 h-3 text-red-600" /> Video
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingJob({ ...editingJob, videoUrl: "", videoPoster: "" });
                                showToast("Đã xóa video!", "success");
                              }}
                              className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition shadow-sm"
                              title="Xóa video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 flex items-center justify-center">
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

                      {/* CÁC THẺ HÌNH ẢNH */}
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
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
                >
                  Hủy Bỏ
                </button>

                <div className="flex items-center gap-3">
                  {editingJob && (
                    <a
                      href="/viec-lam/xem-truoc"
                      target="job_preview_tab"
                      rel="noopener noreferrer"
                      onClick={() => {
                        savePreviewDraft(editingJob);
                        showToast("Đang mở trang xem trước bản nháp...", "success");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs hover:bg-gray-200 transition"
                      title="Xem trước trang chi tiết với dữ liệu đang chỉnh sửa"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-900" />
                      <span>Xem Trước</span>
                    </a>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-800 to-brand-900 hover:from-brand-900 hover:to-red-950 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Lưu Thay Đổi</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}