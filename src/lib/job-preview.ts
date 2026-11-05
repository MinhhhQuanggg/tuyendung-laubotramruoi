import { JobItem, JobCategory } from "@/types/job";
import { slugify } from "@/lib/utils";

export const PREVIEW_STORAGE_KEY = "TUYENDUNG_JOB_PREVIEW_DRAFT";
export const PREVIEW_CHANNEL_NAME = "tuyendung_job_preview_channel";

export function buildPreviewJob(editingJob: Partial<JobItem>): JobItem {
  const finalSlug = slugify(editingJob.slug || editingJob.title || "xem-truoc");
  const derivedBadges = [editingJob.ageRequirement, editingJob.experienceDisplay].filter(Boolean) as string[];
  const cleanImages = (editingJob.images || []).filter((img) => Boolean(img && img.trim() !== ""));

  const intro = (editingJob.concisePost?.intro || "").trim();
  const zalo = editingJob.contactZalo || editingJob.concisePost?.zalo || "0981256712";
  const category: JobCategory = editingJob.category || "Học nghề có lương";

  return {
    id: editingJob.id || "preview-id",
    title: (editingJob.title || "Vị trí tuyển dụng (Bản nháp)").trim(),
    slug: finalSlug,
    category,
    salaryDisplay: (editingJob.salaryDisplay || "Thỏa thuận").trim(),
    locations: editingJob.locations && editingJob.locations.length > 0
      ? editingJob.locations
      : ["Quận Bình Thạnh", "Quận 12", "TP. Thủ Đức"],
    contactZalo: zalo,
    ageRequirement: editingJob.ageRequirement || "",
    experienceDisplay: editingJob.experienceDisplay || "",
    workHours: editingJob.workHours || "",
    workTypeDisplay: editingJob.workTypeDisplay || "Toàn thời gian",
    isActive: editingJob.isActive ?? true,
    isUrgent: editingJob.isUrgent ?? false,
    images: cleanImages,
    videoUrl: editingJob.videoUrl?.trim() || undefined,
    videoPoster: editingJob.videoPoster?.trim() || undefined,
    badges: derivedBadges.length > 0 ? derivedBadges : (editingJob.badges || []),
    badge: derivedBadges.join(", "),
    concisePost: {
      headline: editingJob.concisePost?.headline || "",
      intro: intro,
      points: editingJob.concisePost?.points || [],
      zalo: zalo,
    },
    responsibilities: editingJob.responsibilities || [],
    requirements: editingJob.requirements || [],
    benefits: editingJob.benefits || [],
  };
}

export function savePreviewDraft(job: Partial<JobItem>): JobItem {
  const previewJob = buildPreviewJob(job);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewJob));
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel(PREVIEW_CHANNEL_NAME);
        channel.postMessage(previewJob);
        channel.close();
      }
    } catch (e) {
      console.error("Failed saving preview draft:", e);
    }
  }
  return previewJob;
}
