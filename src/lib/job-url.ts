import { slugify } from "@/lib/utils";

/**
 * Chuẩn hóa tên nhóm chuyên mục cha thành slug URL
 * Ví dụ: "Full-time" -> "full-time"
 * "Part-time, Thời vụ" -> "part-time"
 * "Học nghề có lương" -> "hoc-nghe"
 * "Trưởng, Quản lý" -> "quan-ly"
 */
export function getCategorySlug(categoryOrParentMenu?: string | null): string {
  if (!categoryOrParentMenu) return "";
  const norm = categoryOrParentMenu.trim().toLowerCase();
  if (norm.includes("full-time") || norm.includes("fulltime")) return "full-time";
  if (norm.includes("part-time") || norm.includes("parttime") || norm.includes("thời vụ")) return "part-time";
  if (norm.includes("học nghề") || norm.includes("hoc-nghe")) return "hoc-nghe";
  if (norm.includes("quản lý") || norm.includes("trưởng") || norm.includes("quan-ly")) return "quan-ly";
  return slugify(categoryOrParentMenu);
}

/**
 * Trả về slug ngắn gọn của job (bỏ hậu tố category nếu có)
 * Ví dụ: "phu-bep-full-time" với category "full-time" -> "phu-bep"
 * Ví dụ: "phu-bep-hoc-nghe" với category "hoc-nghe" -> "phu-bep"
 * Ví dụ: "phuc-vu-full-time" -> "phuc-vu"
 * Ví dụ: "thu-ngan" -> "thu-ngan"
 */
export function getCleanJobSlug(slug: string, categorySlug?: string): string {
  if (!slug) return "";
  let clean = slug.trim().toLowerCase();
  if (categorySlug) {
    const cat = categorySlug.toLowerCase();
    if (clean.endsWith(`-${cat}`)) {
      clean = clean.slice(0, -(cat.length + 1));
    }
    if (clean.startsWith(`${cat}-`)) {
      clean = clean.slice(cat.length + 1);
    }
  }
  // Loại bỏ các hậu tố phân loại phổ biến nếu còn sót
  clean = clean
    .replace(/-full-time$/, "")
    .replace(/-part-time$/, "")
    .replace(/-hoc-nghe$/, "")
    .replace(/-thoi-vu$/, "");

  return clean || slug;
}

/**
 * Tạo URL chuẩn phân cấp cho công việc:
 * /viec-lam/[category]/[clean-slug]
 * Ví dụ:
 * - Phụ bếp Full-time -> /viec-lam/full-time/phu-bep
 * - Phục vụ Full-time -> /viec-lam/full-time/phuc-vu
 * - Phụ bếp Học nghề  -> /viec-lam/hoc-nghe/phu-bep
 * - Bếp trưởng        -> /viec-lam/quan-ly/bep-truong
 */
export function getJobUrl(
  job: {
    slug: string;
    category?: string;
    parentMenu?: string;
    menuPlacement?: string;
  },
  isAdmin = false
): string {
  const prefix = isAdmin ? "/admin/viec-lam" : "/viec-lam";
  const catSlug = getCategorySlug(job.parentMenu || job.category);
  const cleanSlug = getCleanJobSlug(job.slug, catSlug);

  if (catSlug && cleanSlug) {
    return `${prefix}/${catSlug}/${cleanSlug}`;
  }
  return `${prefix}/${job.slug}`;
}

/**
 * Kiểm tra xem một job có đang được chọn/xem trên URL hiện tại hay không
 */
export function isJobActiveOnPath(
  currentPathname: string | null | undefined,
  jobUrl: string,
  jobSlug: string,
  categorySlug?: string
): boolean {
  if (!currentPathname) return false;
  // Bỏ dấu gạch chéo cuối nếu có
  const path = currentPathname.replace(/\/$/, "").toLowerCase();
  const targetUrl = jobUrl.replace(/\/$/, "").toLowerCase();

  // 1. Khớp chính xác URL
  if (path === targetUrl) return true;

  // 2. Khớp theo phân đoạn cuối (clean slug hoặc full slug)
  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) return false;

  const cleanSlug = getCleanJobSlug(jobSlug, categorySlug);
  if (lastSegment === jobSlug.toLowerCase() || lastSegment === cleanSlug) {
    // Nếu có 2 phân đoạn, kiểm tra thêm phân đoạn chuyên mục
    if (segments.length >= 3 && categorySlug) {
      const pathCat = segments[segments.length - 2];
      return pathCat === categorySlug || pathCat.includes(categorySlug) || categorySlug.includes(pathCat);
    }
    return true;
  }

  return false;
}
