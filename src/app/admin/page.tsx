"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Video,
  ImageIcon,
  Upload,
  X,
  Eye,
  EyeOff,
  Building,
  RefreshCw,
  Sparkles,
  FileText,
  MapPin,
  Check,
  Users,
} from "lucide-react";
import { JobItem, JobCategory } from "@/types/job";
import { extractFirstFrameFromFile } from "@/lib/video-thumbnail";
import { uploadMediaFile } from "@/lib/upload-client";
import { slugify } from "@/lib/utils";
import { savePreviewDraft } from "@/lib/job-preview";
import LifeVideosTab from "@/components/admin/LifeVideosTab";
import BranchesTab from "@/components/admin/BranchesTab";
import QuickApplyConfigTab from "@/components/admin/QuickApplyConfigTab";
import ApplicationsTab from "@/components/admin/ApplicationsTab";

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

const PRESET_GALLERY = [
  "/images/jobs/all_img_1.jpg",
  "/images/jobs/all_img_2.jpg",
  "/images/jobs/all_img_3.jpg",
  "/images/jobs/all_img_4.jpg",
  "/images/jobs/all_img_6.jpg",
  "/images/jobs/all_img_7.jpg",
  "/images/jobs/1.jpg",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const adminEmail = "tuyendung.admin@gmail.com";

  // Jobs state
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "URGENT">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobItem> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [quickMediaUrl, setQuickMediaUrl] = useState("");

  // Active Tab
  const [activeTab, setActiveTab] = useState<"jobs" | "applications" | "life_videos" | "branches" | "quick_apply">("jobs");

  // Check auth
  useEffect(() => {
    let isMounted = true;
    const fallbackTimer = setTimeout(() => {
      if (isMounted && isAuthenticated === null) {
        window.location.replace("/admin/login");
      }
    }, 2500);

    fetch("/api/admin/me")
      .then((res) => {
        if (!isMounted) return;
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          window.location.replace("/admin/login");
        }
      })
      .catch(() => {
        if (isMounted) {
          window.location.replace("/admin/login");
        }
      })
      .finally(() => {
        clearTimeout(fallbackTimer);
      });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Load jobs
  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch(`/api/admin/jobs?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.replace("/admin/login");
  };

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

  // Open Create Form
  const handleOpenCreate = () => {
    const newId = `JOB-${Date.now().toString(36).toUpperCase()}`;
    setEditingJob({
      id: newId,
      slug: "",
      title: "",
      category: "Học nghề có lương",
      salaryDisplay: "7,5 - 10 triệu/tháng",
      minSalary: 7500000,
      maxSalary: 10000000,
      salaryUnit: "MONTH",
      ageRequirement: "18 – 30 tuổi",
      badges: ["18–30 tuổi", "Đào tạo từ số 0"],
      workType: "FULL_TIME",
      workTypeDisplay: "Toàn thời gian (Ca 14h00 – 24h00)",
      workHours: "14h00 – 24h00 mỗi ngày",
      experienceDisplay: "Không yêu cầu (Đào tạo từ số 0)",
      locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3"],
      contactZalo: "0981256712",
      isUrgent: true,
      isActive: true,
      showInMenu: true,
      menuPlacement: "PARENT",
      parentMenu: "Học nghề có lương",
      images: [],
      videoUrl: "",
      videoPoster: "",
      concisePost: {
        headline: "",
        intro: "",
        points: [],
        zalo: "0981256712",
      },
      responsibilities: [
        "Sơ chế rau nấm, thịt bò tươi và chuẩn bị quầy nguyên liệu.",
        "Xếp đĩa và hỗ trợ ra món theo quy chuẩn định lượng của chuỗi.",
        "Giữ gìn vệ sinh sạch sẽ khu vực gian bếp theo tiêu chuẩn an toàn thực phẩm.",
      ],
      requirements: [
        "Độ tuổi từ 18 – 30 tuổi, chăm chỉ, thật thà, có tinh thần cầu tiến.",
        "Không yêu cầu tay nghề trước đó, sẽ được đào tạo bài bản từ số 0.",
      ],
      benefits: [
        "Lương 7,5 - 10 triệu/tháng, đánh giá tăng lương nhanh sau tuần đầu.",
        "Bao ăn ca, cấp đồng phục miễn phí, môi trường trẻ trung thân thiện.",
      ],
    });
    setIsModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (job: JobItem) => {
    const images = job.images && Array.isArray(job.images) ? [...job.images] : [];

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
    setIsModalOpen(true);
  };

  // Save Job
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.title) return;

    setIsSubmitting(true);
    try {
      const isUpdating = jobs.some((j) => j.id === editingJob.id);
      const url = isUpdating ? `/api/admin/jobs/${editingJob.id}` : "/api/admin/jobs";
      const method = isUpdating ? "PUT" : "POST";

      const finalSlug = slugify(editingJob.slug || editingJob.title || "");
      const derivedBadges = [editingJob.ageRequirement, editingJob.experienceDisplay].filter(Boolean) as string[];
      const cleanImages = (editingJob.images || []).filter((img) => Boolean(img && img.trim() !== ""));
      const jobPayload = {
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
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          isUpdating
            ? `Đã cập nhật bài đăng "${editingJob.title}" thành công!`
            : `Đã tạo mới bài đăng "${editingJob.title}" thành công!`,
          "success"
        );
        setIsModalOpen(false);
        fetchJobs();
        notifyJobsUpdated();
      } else {
        showToast(data.error || "Không thể lưu dữ liệu", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi lưu dữ liệu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa vị trí việc làm "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa "${title}" thành công!`, "success");
        fetchJobs();
        notifyJobsUpdated();
      } else {
        showToast(data.error || "Không thể xóa bài đăng", "error");
      }
    } catch {
      showToast("Lỗi khi xóa bài đăng", "error");
    }
  };

  // Toggle Active
  const handleToggleActive = async (job: JobItem) => {
    const updated = { ...job, isActive: !job.isActive };
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `Đã ${updated.isActive ? "bật" : "tắt"} hiển thị việc làm "${job.title}"`,
          "success"
        );
        fetchJobs();
        notifyJobsUpdated();
      }
    } catch {
      showToast("Lỗi cập nhật trạng thái", "error");
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

  // Upload multiple images handler (user có thể thêm bao nhiêu tùy thích)
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

  // Thay thế ảnh tại vị trí index
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

  // Thêm nhanh qua URL
  const handleAddQuickUrl = () => {
    if (!quickMediaUrl.trim()) return;
    const url = quickMediaUrl.trim();
    const isVideo =
      url.endsWith(".mp4") ||
      url.endsWith(".mov") ||
      url.endsWith(".webm") ||
      url.includes("/videos/");

    if (isVideo) {
      setEditingJob((prev) => (prev ? { ...prev, videoUrl: url } : prev));
      showToast("Đã thêm link video!", "success");
    } else {
      setEditingJob((prev) => {
        if (!prev) return prev;
        const current = (prev.images || []).filter(Boolean);
        return { ...prev, images: [...current, url] };
      });
      showToast("Đã thêm hình ảnh qua link!", "success");
    }
    setQuickMediaUrl("");
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.locations && job.locations.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory =
      selectedCategory === "ALL" || job.category === selectedCategory;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && job.isActive) ||
      (statusFilter === "INACTIVE" && !job.isActive) ||
      (statusFilter === "URGENT" && job.isUrgent);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Đang xác thực quyền Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
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

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-brand-200 bg-brand-50 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-950 text-base sm:text-lg tracking-tight">
                  LẨU BÒ TRĂM RƯỠI
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Hệ thống quản trị việc làm & ứng viên</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <span>Xem Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 text-xs text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold">{adminEmail}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === "jobs"
                ? "bg-brand-800 text-white shadow-md shadow-brand-900/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Vị Trí Tuyển Dụng</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "jobs" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {jobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === "applications"
                ? "bg-brand-800 text-white shadow-md shadow-brand-900/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Hồ Sơ Ứng Tuyển</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeTab === "applications"
                  ? "bg-amber-400 text-brand-950 font-extrabold"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              Hồ sơ & CV
            </span>
          </button>

          <button
            onClick={() => setActiveTab("life_videos")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === "life_videos"
                ? "bg-brand-800 text-white shadow-md shadow-brand-900/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Đời Sống Trăm Rưỡi</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeTab === "life_videos"
                  ? "bg-amber-400 text-brand-950 font-extrabold"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              Mới
            </span>
          </button>

          <button
            onClick={() => setActiveTab("branches")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === "branches"
                ? "bg-brand-800 text-white shadow-md shadow-brand-900/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Địa Chỉ Chi Nhánh</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeTab === "branches"
                  ? "bg-amber-400 text-brand-950 font-extrabold"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Hệ thống
            </span>
          </button>

          <button
            onClick={() => setActiveTab("quick_apply")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === "quick_apply"
                ? "bg-brand-800 text-white shadow-md shadow-brand-900/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Form Ứng Tuyển Nhanh</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeTab === "quick_apply"
                  ? "bg-amber-400 text-brand-950 font-extrabold"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Cấu hình
            </span>
          </button>
        </div>

        {activeTab === "applications" && <ApplicationsTab />}
        {activeTab === "life_videos" && <LifeVideosTab />}
        {activeTab === "branches" && <BranchesTab />}
        {activeTab === "quick_apply" && <QuickApplyConfigTab />}

        {activeTab === "jobs" && (

          <>
            {/* Banner Quick Action For "Học Việc Bếp" */}
            {jobs.find((j) => j.id === "HV-BEP-01" || j.slug === "hoc-viec-bep") && (

          <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-amber-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-2xl">
                🔥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white">
                    Bài đăng mục tiêu: Học Việc Bếp (HV-BEP-01)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950">
                    VIP POST
                  </span>
                </div>
                <p className="text-xs text-amber-100 mt-0.5">
                  Đã cấu hình sẵn: Lương 7,5 - 10 triệu/tháng, Độ tuổi 18 – 30 tuổi, 4 hình ảnh & 1 video chuẩn vision.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  const job = jobs.find((j) => j.id === "HV-BEP-01" || j.slug === "hoc-viec-bep");
                  if (job) handleOpenEdit(job);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh Sửa "Học Việc Bếp" Ngay</span>
              </button>
              <Link
                href="/admin/viec-lam/hoc-viec-bep"
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Chi Tiết</span>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid - Các nút lọc trạng thái công việc */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Tất Cả */}
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition duration-200 cursor-pointer active:scale-95 ${
              statusFilter === "ALL"
                ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/40 shadow-md scale-[1.01]"
                : "bg-white border-gray-200/80 shadow-sm hover:border-blue-300 hover:shadow-md"
            }`}
            title="Bấm để hiển thị tất cả vị trí việc làm"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition ${
                statusFilter === "ALL" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-600"
              }`}
            >
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{jobs.length}</div>
              <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <span>Tổng Vị Trí Việc Làm</span>
                {statusFilter === "ALL" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                )}
              </div>
            </div>
          </button>

          {/* Card 2: Đang Bật */}
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === "ACTIVE" ? "ALL" : "ACTIVE")}
            className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition duration-200 cursor-pointer active:scale-95 ${
              statusFilter === "ACTIVE"
                ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/40 shadow-md scale-[1.01]"
                : "bg-white border-gray-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md"
            }`}
            title="Bấm để lọc chỉ các vị trí đang bật tuyển dụng"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition ${
                statusFilter === "ACTIVE" ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-700">
                {jobs.filter((j) => j.isActive).length}
              </div>
              <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <span>Đang Bật Tuyển Dụng</span>
                {statusFilter === "ACTIVE" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Đang lọc
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Card 3: Đã Ẩn */}
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === "INACTIVE" ? "ALL" : "INACTIVE")}
            className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition duration-200 cursor-pointer active:scale-95 ${
              statusFilter === "INACTIVE"
                ? "bg-gray-100/80 border-gray-400 ring-2 ring-gray-400/50 shadow-md scale-[1.01]"
                : "bg-white border-gray-200/80 shadow-sm hover:border-gray-300 hover:shadow-md"
            }`}
            title="Bấm để lọc chỉ các vị trí đã tạm ẩn"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition ${
                statusFilter === "INACTIVE" ? "bg-gray-700 text-white shadow-sm" : "bg-gray-100 text-gray-600"
              }`}
            >
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-700">
                {jobs.filter((j) => !j.isActive).length}
              </div>
              <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <span>Đã Ẩn Tuyển Dụng</span>
                {statusFilter === "INACTIVE" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-800">
                    Đang lọc
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Card 4: Tuyển Gấp */}
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === "URGENT" ? "ALL" : "URGENT")}
            className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition duration-200 cursor-pointer active:scale-95 ${
              statusFilter === "URGENT"
                ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/40 shadow-md scale-[1.01]"
                : "bg-white border-gray-200/80 shadow-sm hover:border-amber-300 hover:shadow-md"
            }`}
            title="Bấm để lọc chỉ các vị trí tuyển gấp"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition ${
                statusFilter === "URGENT" ? "bg-amber-500 text-amber-950 shadow-sm" : "bg-amber-50 text-amber-600"
              }`}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">
                {jobs.filter((j) => j.isUrgent).length}
              </div>
              <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <span>Vị Trí Tuyển Gấp 🔥</span>
                {statusFilter === "URGENT" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Đang lọc
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Action Bar & Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm vị trí (ví dụ: Học việc bếp, Phục vụ, Thu ngân, Gò Vấp...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-brand-700 outline-none transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={fetchJobs}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                title="Tải lại danh sách"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenCreate}
                className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Tuyển Vị Trí Mới</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === "ALL"
                  ? "bg-brand-800 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả ({jobs.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-brand-800 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat} ({jobs.filter((j) => j.category === cat).length})
              </button>
            ))}

            {statusFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition flex items-center gap-1 shrink-0 ml-auto"
                title="Bấm để xóa bộ lọc trạng thái và hiển thị lại tất cả"
              >
                <X className="w-3.5 h-3.5" />
                <span>
                  Đang lọc: {statusFilter === "ACTIVE" ? "Đang Bật" : statusFilter === "INACTIVE" ? "Đã Ẩn" : "Tuyển Gấp"} (Xóa lọc)
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {isLoadingJobs ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-brand-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-gray-500">Đang tải danh sách bài đăng...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 text-sm">Không tìm thấy bài đăng nào phù hợp với tìm kiếm.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Vị Trí Tuyển Dụng</th>
                    <th className="py-3.5 px-4">Danh Mục & Ca Làm</th>
                    <th className="py-3.5 px-4">Mức Lương</th>
                    <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                    <th className="py-3.5 px-6 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredJobs.map((job) => {
                    const isTargetJob = job.id === "HV-BEP-01" || job.slug === "hoc-viec-bep";
                    return (
                      <tr
                        key={job.id}
                        className={`hover:bg-amber-50/30 transition ${
                          isTargetJob ? "bg-amber-50/50 font-medium" : ""
                        }`}
                      >
                        {/* Title & Slug & Link to Detail */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-start gap-2.5">
                            {isTargetJob && (
                              <span className="text-lg select-none" title="Vị trí trọng điểm">
                                🔥
                              </span>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/viec-lam/${job.slug}`}
                                  className={`font-bold text-sm transition flex items-center gap-1.5 group ${
                                    job.isActive
                                      ? "text-emerald-600 hover:text-emerald-700"
                                      : "text-gray-400 hover:text-gray-500"
                                  }`}
                                  title="Bấm để xem trang chi tiết vị trí trong quản trị"
                                >
                                  <span className="group-hover:underline">{job.title}</span>
                                </Link>
                                {job.isUrgent && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200 shrink-0">
                                    Tuyển gấp
                                  </span>
                                )}
                                {job.showInMenu !== false ? (
                                  job.isActive ? (
                                    job.menuPlacement === "DIRECT" ? (
                                      <span
                                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0"
                                        title="Hiển thị trực tiếp ở menu điều hướng Header"
                                      >
                                        Menu riêng
                                      </span>
                                    ) : (
                                      <span
                                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0"
                                        title={`Gắn vào menu cha: ${job.parentMenu || job.category || "Học nghề có lương"}`}
                                      >
                                        Menu: {job.parentMenu || job.category || "Cha"}
                                      </span>
                                    )
                                  ) : (
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200 shrink-0"
                                      title="Thuộc menu nhưng đang tạm ẩn theo bài đăng"
                                    >
                                      Menu (ẩn)
                                    </span>
                                  )
                                ) : (
                                  <span
                                    className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-gray-100 text-gray-400 border border-gray-200 shrink-0"
                                    title="Không hiển thị trên menu Header"
                                  >
                                    Không menu
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                                <span>ID: <strong className="text-gray-600 font-semibold">{job.id}</strong></span>
                                <span>•</span>
                                <span>/admin/viec-lam/{job.slug}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Shift */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
                              {job.category}
                            </span>
                            <div className="text-[11px] text-gray-500 font-medium truncate max-w-[180px]">
                              {job.workHours || job.workTypeDisplay || "Toàn thời gian"}
                            </div>
                          </div>
                        </td>

                        {/* Salary */}
                        <td className="py-3.5 px-4 font-bold text-brand-900 whitespace-nowrap text-sm">
                          💰 {job.salaryDisplay}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleActive(job)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
                              job.isActive
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                            title="Bấm để bật / tắt hiển thị vị trí"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${job.isActive ? "bg-emerald-600 animate-pulse" : "bg-gray-400"}`} />
                            <span>{job.isActive ? "Đang bật" : "Đã ẩn"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* Chi tiết vị trí */}
                            <Link
                              href={`/admin/viec-lam/${job.slug}`}
                              className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-brand-50 hover:text-brand-900 text-gray-700 text-xs font-bold transition flex items-center gap-1"
                              title="Xem trang chi tiết vị trí trong quản trị"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Chi tiết</span>
                            </Link>

                            {/* Chỉnh sửa nhanh */}
                            <button
                              onClick={() => handleOpenEdit(job)}
                              className="p-1.5 rounded-xl text-amber-700 hover:bg-amber-100 transition"
                              title="Chỉnh sửa nhanh bài đăng"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Xem trang ngoài */}
                            <Link
                              href={`/viec-lam/${job.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-xl text-gray-500 hover:text-brand-900 hover:bg-gray-100 transition"
                              title="Xem trang ngoài website (giao diện khách)"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Xóa */}
                            <button
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              className="p-1.5 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                              title="Xóa bài đăng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
      )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL EDIT / CREATE JOB */}
      {/* ========================================================================= */}
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-brand-900 to-[#701313] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    {jobs.some((j) => j.id === editingJob.id)
                      ? `Chỉnh Sửa Vị Trí: ${editingJob.title}`
                      : "Tạo Bài Tuyển Dụng Mới"}
                  </h3>
                  <p className="text-xs text-amber-200">
                    ID: {editingJob.id} • Slug: {editingJob.slug || "(Tự động tạo)"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveJob} className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* SECTION 1: TIÊU ĐỀ & MỨC LƯƠNG & TRẠNG THÁI */}
              <div className="space-y-4 bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <span>📌 1. Tiêu Đề Công Việc & Mức Lương</span>
                </h4>

                {/* Hàng 1: Tiêu đề công việc & Slug URL (2 cột) */}
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
                        const isCreateMode = !jobs.some((j) => j.id === editingJob.id);
                        const autoSlug = slugify(title);
                        // Khi tạo mới vị trí: tự động tạo slug tiếng Việt không dấu (Ví dụ: 'lái xe' -> 'lai-xe')
                        const shouldAutoSlug = isCreateMode || !editingJob.slug || editingJob.slug === slugify(editingJob.title || "");
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
                      placeholder="Ví dụ: 7,5 - 10 triệu/tháng hoặc 22.000 - 35.000 đ/h"
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
                          name="adminJobMenuPlacement"
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
                          name="adminJobMenuPlacement"
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

              {/* SECTION 2: THẺ YÊU CẦU ĐỘ TUỔI (TAGS CHECKBOX + INPUT THỦ CÔNG) */}
              <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                      <span>🎂 2. Yêu Cầu Độ Tuổi (Thẻ Bật/Tắt & Điền Thủ Công)</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Bấm vào thẻ để chọn/bỏ chọn độ tuổi, hoặc tự điền độ tuổi thủ công bên dưới nếu không có thẻ phù hợp.
                    </p>
                  </div>
                  {editingJob.ageRequirement && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đang chọn: <strong>{editingJob.ageRequirement}</strong></span>
                    </span>
                  )}
                </div>

                {/* Danh sách thẻ độ tuổi dạng Pill Buttons với icon Checkbox / + / X */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {PRESET_AGE_TAGS.map((tag) => {
                    const isSelected = editingJob.ageRequirement === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const nextAge = isSelected ? "" : tag;
                          // Also sync badges
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
                    placeholder="Nhập độ tuổi tùy chỉnh nếu không có thẻ tag phù hợp ở trên (VD: 19 – 27 tuổi, Đủ 20 tuổi trở lên)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* SECTION 3: THẺ YÊU CẦU KINH NGHIỆM (TAGS CHECKBOX + INPUT THỦ CÔNG) */}
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

                {/* Danh sách thẻ kinh nghiệm dạng Pill Buttons với icon Checkbox / + / X */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {PRESET_EXPERIENCE_TAGS.map((tag) => {
                    const isSelected = editingJob.experienceDisplay === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const nextExp = isSelected ? "" : tag;
                          // Also sync badges
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
                    placeholder="Nhập yêu cầu kinh nghiệm khác nếu có (VD: Ưu tiên có kinh nghiệm làm đồ nướng, phục vụ bàn...)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* SECTION 4: NỘI DUNG CÔNG VIỆC */}
              <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
                  <span>📝 4. Nội Dung Công Việc</span>
                </h4>

                {/* Long Text Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Nội dung công việc <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400">Hiển thị nổi bật ở trang tuyển dụng</span>
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
                          zalo: editingJob.concisePost?.zalo || "0981256712",
                        },
                      })
                    }
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-700 outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 5: QUẢN LÝ MEDIA TỰ DO (VIDEO & ẢNH KHÔNG GIỚI HẠN) */}
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


              {/* Modal Footer Controls */}
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
                    <span>Lưu Bài Tuyển Dụng</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
