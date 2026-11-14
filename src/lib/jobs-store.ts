import fs from "fs";
import path from "path";
import { JobItem } from "@/types/job";
import { MOCK_JOBS_DATA } from "@/data/mock-jobs";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCategorySlug, getCleanJobSlug } from "@/lib/job-url";

const OVERRIDE_FILE_PATH = path.join(process.cwd(), "src", "data", "jobs-override.json");
const DELETED_FILE_PATH = path.join(process.cwd(), "src", "data", "deleted-jobs.json");

function readOverrideFile(): Record<string, JobItem> {
  try {
    if (fs.existsSync(OVERRIDE_FILE_PATH)) {
      const data = fs.readFileSync(OVERRIDE_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading jobs-override.json:", err);
  }
  return {};
}

function writeOverrideFile(overrides: Record<string, JobItem>) {
  try {
    fs.writeFileSync(OVERRIDE_FILE_PATH, JSON.stringify(overrides, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing jobs-override.json:", err);
  }
}

function readDeletedJobs(): string[] {
  try {
    if (fs.existsSync(DELETED_FILE_PATH)) {
      const data = fs.readFileSync(DELETED_FILE_PATH, "utf8");
      return JSON.parse(data) as string[];
    }
  } catch (err) {
    console.error("Error reading deleted-jobs.json:", err);
  }
  return [];
}

function writeDeletedJobs(deletedIds: string[]) {
  try {
    fs.writeFileSync(
      DELETED_FILE_PATH,
      JSON.stringify(Array.from(new Set(deletedIds)), null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error writing deleted-jobs.json:", err);
  }
}

function mapSupabaseJobRow(j: any): JobItem {
  return {
    id: j.id,
    slug: j.slug,
    title: j.title,
    category: j.category as any,
    badge: j.badge || undefined,
    badges: (j.badges as string[]) || [],
    salaryDisplay: j.salary_display,
    minSalary: j.min_salary ?? undefined,
    maxSalary: j.max_salary ?? undefined,
    salaryUnit: (j.salary_unit as any) || "MONTH",
    locations: (j.locations as string[]) || [],
    ageRequirement: j.age_requirement || "",
    workType: j.work_type as any,
    workTypeDisplay: j.work_type_display,
    workHours: j.work_hours || undefined,
    experienceDisplay: j.experience_display || "",
    experienceRequirements: j.experience_requirements || "",
    descriptionHtml: j.description_html || undefined,
    concisePost: (j.concise_post as any) || undefined,
    responsibilities: (j.responsibilities as string[]) || [],
    requirements: (j.requirements as string[]) || [],
    benefits: (j.benefits as string[]) || [],
    datePosted: j.date_posted,
    validThrough: j.valid_through,
    isUrgent: j.is_urgent ?? false,
    isActive: j.is_active ?? true,
    showInMenu:
      j.show_in_menu !== null && j.show_in_menu !== undefined
        ? j.show_in_menu
        : true,
    menuPlacement: (j.menu_placement as any) || "PARENT",
    parentMenu: j.parent_menu || undefined,
    contactZalo: j.contact_zalo || "0981256712",
    images: (j.images as string[]) || [],
    videoUrl: j.video_url || undefined,
    videoPoster: j.video_poster || undefined,
  };
}

/**
 * Lấy danh sách toàn bộ công việc:
 * Mock Data chuẩn trong src/data/mock-jobs.ts là Single Source of Truth.
 */
export async function getJobsList(): Promise<JobItem[]> {
  return MOCK_JOBS_DATA;
}

export async function getJobByIdOrSlug(idOrSlug: string): Promise<JobItem | null> {
  if (!idOrSlug) return null;
  const jobs = await getJobsList();
  const lower = idOrSlug.toLowerCase().trim();

  // 1. Tìm chính xác theo ID hoặc Slug
  const found = jobs.find(
    (j) => j.id.toLowerCase() === lower || j.slug.toLowerCase() === lower
  );
  if (found) return found;

  // 2. Alias fallback cho một số slug tương đương
  if (lower === "lai-xe" || lower === "tai-xe") {
    return jobs.find((j) => j.slug === "tai-xe" || j.slug === "lai-xe") || null;
  }
  if (lower === "thu-ngan-full-time" || lower === "thu-ngan") {
    return jobs.find((j) => j.slug === "thu-ngan" || j.slug === "thu-ngan-full-time") || null;
  }
  if (lower === "part-time-thoi-vu" || lower === "phuc-vu-part-time") {
    return (
      jobs.find(
        (j) => j.slug === "phuc-vu-part-time" || j.slug === "part-time-thoi-vu"
      ) || null
    );
  }

  return null;
}

/**
 * Tìm công việc theo cấu trúc đường dẫn phân cấp:
 * Trường hợp 1: Có 2 phân đoạn /viec-lam/[categorySlug]/[jobSlug] (ví dụ: full-time / phu-bep)
 * Trường hợp 2: Có 1 phân đoạn /viec-lam/[slug] (ví dụ: phu-bep-full-time)
 */
export async function getJobByPath(
  categorySlugOrSlug: string,
  maybeJobSlug?: string
): Promise<JobItem | null> {
  if (!categorySlugOrSlug) return null;

  // Nếu chỉ có 1 phân đoạn
  if (!maybeJobSlug) {
    const directJob = await getJobByIdOrSlug(categorySlugOrSlug);
    if (directJob) return directJob;

    // Nếu phân đoạn là slug danh mục cha (ví dụ: "part-time" -> lấy bài đăng thuộc Part-time)
    const jobs = await getJobsList();
    const targetCat = categorySlugOrSlug.toLowerCase().trim();
    const catMatch = jobs.find((j) => {
      const catSlug = getCategorySlug(j.parentMenu || j.category);
      return catSlug === targetCat;
    });
    if (catMatch) return catMatch;

    return null;
  }

  const jobs = await getJobsList();
  if (!jobs || jobs.length === 0) return null;

  const targetCat = categorySlugOrSlug.toLowerCase().trim();
  const targetJobSlug = maybeJobSlug.toLowerCase().trim();

  // 1. Tìm khớp cả category và clean slug / full slug
  const matched = jobs.find((j) => {
    const catSlug = getCategorySlug(j.parentMenu || j.category);
    const cleanSlug = getCleanJobSlug(j.slug, catSlug);
    const isCatMatch =
      catSlug === targetCat ||
      targetCat.includes(catSlug) ||
      catSlug.includes(targetCat);
    const isJobMatch =
      cleanSlug === targetJobSlug ||
      j.slug.toLowerCase() === targetJobSlug ||
      j.slug.toLowerCase() === `${targetJobSlug}-${targetCat}` ||
      j.slug.toLowerCase() === `${targetCat}-${targetJobSlug}` ||
      j.id.toLowerCase() === targetJobSlug;
    return isCatMatch && isJobMatch;
  });

  if (matched) return matched;

  // 2. Fallback nếu không khớp category nhưng cleanSlug khớp duy nhất
  const fallbackMatch = jobs.find((j) => {
    const catSlug = getCategorySlug(j.parentMenu || j.category);
    const cleanSlug = getCleanJobSlug(j.slug, catSlug);
    return cleanSlug === targetJobSlug || j.slug.toLowerCase() === targetJobSlug;
  });

  if (fallbackMatch) return fallbackMatch;

  // 3. Fallback tìm theo ID hoặc slug thông thường
  return getJobByIdOrSlug(maybeJobSlug);
}

export async function upsertJob(job: JobItem): Promise<JobItem> {
  // Gỡ khỏi danh sách đã xóa nếu bài đăng được lưu lại
  const deletedList = readDeletedJobs();
  const filteredDeleted = deletedList.filter(
    (item) => item !== job.id && item !== job.slug
  );
  if (filteredDeleted.length !== deletedList.length) {
    writeDeletedJobs(filteredDeleted);
  }

  // 1. Lưu vào file override cục bộ (hoạt động độc lập không cần DB)
  const overrides = readOverrideFile();
  overrides[job.id] = job;
  writeOverrideFile(overrides);

  // 2. Nếu có Supabase, đồng bộ thêm lên cloud (nếu thất bại vẫn đảm bảo lưu cục bộ)
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const baseRow = {
          id: job.id,
          slug: job.slug,
          title: job.title,
          category: job.category,
          badge: job.badge || null,
          badges: (job.badges as any) || [],
          salary_display: job.salaryDisplay,
          min_salary: job.minSalary ?? null,
          max_salary: job.maxSalary ?? null,
          salary_unit: job.salaryUnit || "MONTH",
          locations: (job.locations as any) || [],
          age_requirement: job.ageRequirement,
          work_type: job.workType,
          work_type_display: job.workTypeDisplay,
          work_hours: job.workHours || null,
          experience_display: job.experienceDisplay,
          experience_requirements: job.experienceRequirements,
          description_html: job.descriptionHtml || null,
          concise_post: (job.concisePost as any) || null,
          responsibilities: (job.responsibilities as any) || [],
          requirements: (job.requirements as any) || [],
          benefits: (job.benefits as any) || [],
          date_posted: job.datePosted,
          valid_through: job.validThrough,
          is_urgent: job.isUrgent ?? false,
          is_active: job.isActive ?? true,
          contact_zalo: job.contactZalo || "0981256712",
          images: (job.images as any) || [],
          video_url: job.videoUrl || null,
          video_poster: job.videoPoster || null,
        };

        const fullRow = {
          ...baseRow,
          show_in_menu: job.showInMenu !== undefined ? job.showInMenu : true,
          menu_placement: job.menuPlacement || "PARENT",
          parent_menu: job.parentMenu || null,
        };

        const { error: fullError } = await supabase
          .from("jobs")
          .upsert(fullRow as any, { onConflict: "id" });

        if (fullError) {
          if (
            fullError.code === "42703" ||
            fullError.message?.includes("show_in_menu") ||
            fullError.message?.includes("menu_placement")
          ) {
            await supabase
              .from("jobs")
              .upsert(baseRow as any, { onConflict: "id" });
          } else {
            console.warn("Supabase upsert job warning:", fullError.message);
          }
        }
      }
    } catch (err) {
      console.warn("Exception upserting job to Supabase (saved locally):", err);
    }
  }

  return job;
}

export async function deleteJob(idOrSlug: string): Promise<boolean> {
  const job = await getJobByIdOrSlug(idOrSlug);
  const targetId = job ? job.id : idOrSlug;
  const targetSlug = job ? job.slug : idOrSlug;

  // 1. Thêm vào danh sách đã xóa (deleted-jobs.json)
  const deletedList = readDeletedJobs();
  if (targetId && !deletedList.includes(targetId)) deletedList.push(targetId);
  if (targetSlug && !deletedList.includes(targetSlug)) deletedList.push(targetSlug);
  writeDeletedJobs(deletedList);

  // 2. Xóa khỏi file overrides cục bộ
  const overrides = readOverrideFile();
  let overridesModified = false;
  if (targetId && overrides[targetId]) {
    delete overrides[targetId];
    overridesModified = true;
  }
  if (targetSlug && overrides[targetSlug]) {
    delete overrides[targetSlug];
    overridesModified = true;
  }
  if (overridesModified) {
    writeOverrideFile(overrides);
  }

  // 3. Xóa trong Supabase nếu có kết nối
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          if (targetId) {
            await supabase
              .from("applications")
              .update({ position_id: null })
              .eq("position_id", targetId);
          }
        } catch {}

        if (targetId) {
          await supabase.from("jobs").delete().eq("id", targetId);
        }
        if (targetSlug && targetSlug !== targetId) {
          await supabase.from("jobs").delete().eq("slug", targetSlug);
        }
      }
    } catch (err) {
      console.warn("Exception deleting job from Supabase (deleted locally):", err);
    }
  }

  return true;
}
