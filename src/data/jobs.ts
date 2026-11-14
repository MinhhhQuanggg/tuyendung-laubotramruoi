import { JobItem } from "@/types/job";
import { MOCK_JOBS_DATA } from "./mock-jobs";

export { MOCK_JOBS_DATA };

export const JOBS_DATA: JobItem[] = MOCK_JOBS_DATA;

export function getJobBySlug(slug: string): JobItem | undefined {
  return JOBS_DATA.find((j) => j.slug === slug);
}

export function getRelatedJobs(currentSlug: string, limit: number = 3): JobItem[] {
  return JOBS_DATA.filter((j) => j.slug !== currentSlug && j.isActive).slice(0, limit);
}

export const APPLICATION_POSITIONS = [
  { id: "hoc-viec-bep", title: "Học việc bếp" },
  { id: "phu-bep-hoc-nghe", title: "Phụ bếp (Học nghề)" },
  { id: "hoc-viec-to-truong", title: "Học việc tổ trưởng" },
  { id: "giam-sat-bep", title: "Giám sát Bếp" },
  { id: "phuc-vu-part-time", title: "Part-time" },
  { id: "cham-soc-khach-hang", title: "Hỗ trợ trải nghiệm KH (CSKH)" },
  { id: "phuc-vu-full-time", title: "Phục vụ" },
  { id: "phu-bep-full-time", title: "Phụ bếp" },
  { id: "thu-ngan", title: "Thu ngân" },
  { id: "pha-che-full-time", title: "Pha chế" },
  { id: "quan-ly-vung", title: "Quản lý vùng" },
  { id: "quan-ly-tiem", title: "Quản lý tiệm" },
  { id: "pho-quan-ly-tiem", title: "Phó quản lý tiệm" },
  { id: "bep-truong", title: "Bếp trưởng" },
  { id: "to-truong", title: "Tổ trưởng" },
];
