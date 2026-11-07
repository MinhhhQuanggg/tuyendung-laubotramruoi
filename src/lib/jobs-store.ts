import { JobItem } from "@/types/job";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCategorySlug, getCleanJobSlug } from "@/lib/job-url";

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

export async function getJobsList(): Promise<JobItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("date_posted", { ascending: false });

    if (error) {
      console.error("Error fetching jobs from Supabase:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapSupabaseJobRow);
  } catch (err) {
    console.error("Supabase exception in getJobsList:", err);
    return [];
  }
}

export async function getJobByIdOrSlug(idOrSlug: string): Promise<JobItem | null> {
  if (!isSupabaseConfigured() || !idOrSlug) {
    return null;
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    // Direct query by ID or Slug from Supabase
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .limit(1);

    if (!error && data && data.length > 0) {
      return mapSupabaseJobRow(data[0]);
    }

    // Graceful alias fallback for lai-xe / tai-xe
    if (idOrSlug === "lai-xe" || idOrSlug === "tai-xe") {
      const { data: aliasData } = await supabase
        .from("jobs")
        .select("*")
        .or("slug.eq.tai-xe,slug.eq.lai-xe,id.eq.JOB-MW27YK2N")
        .limit(1);

      if (aliasData && aliasData.length > 0) {
        return mapSupabaseJobRow(aliasData[0]);
      }
    }
  } catch (err) {
    console.error("Supabase exception in getJobByIdOrSlug:", err);
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
  if (!isSupabaseConfigured() || !categorySlugOrSlug) {
    return null;
  }

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
  if (!isSupabaseConfigured()) {
    return job;
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return job;

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
        console.warn(
          "Supabase jobs table missing menu columns, retrying with baseRow..."
        );
        const { error: baseError } = await supabase
          .from("jobs")
          .upsert(baseRow as any, { onConflict: "id" });
        if (baseError) {
          console.error("Error upserting base job to Supabase:", baseError.message);
        }
      } else {
        console.error("Error upserting job to Supabase:", fullError.message);
      }
    }
  } catch (err) {
    console.error("Exception upserting job to Supabase:", err);
  }

  return job;
}

export async function deleteJob(idOrSlug: string): Promise<boolean> {
  const job = await getJobByIdOrSlug(idOrSlug);
  const targetId = job ? job.id : idOrSlug;
  const targetSlug = job ? job.slug : idOrSlug;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        // 1. Gỡ khóa ngoại trong bảng applications trước
        try {
          if (targetId) {
            await supabase
              .from("applications")
              .update({ position_id: null })
              .eq("position_id", targetId);
          }
        } catch (fkErr) {
          console.warn("Unlink applications foreign key warning:", fkErr);
        }

        // 2. Xóa hẳn dòng job theo ID và Slug trong Supabase
        if (targetId) {
          const { error: delErrorById } = await supabase
            .from("jobs")
            .delete()
            .eq("id", targetId);
          if (delErrorById) {
            console.error("Supabase delete job by id error:", delErrorById.message);
          }
        }

        if (targetSlug && targetSlug !== targetId) {
          const { error: delErrorBySlug } = await supabase
            .from("jobs")
            .delete()
            .eq("slug", targetSlug);
          if (delErrorBySlug) {
            console.error("Supabase delete job by slug error:", delErrorBySlug.message);
          }
        }
      }
    } catch (err) {
      console.error("Exception deleting job from Supabase:", err);
    }
  }

  return true;
}
