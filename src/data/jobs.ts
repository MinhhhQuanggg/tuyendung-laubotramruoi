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
  { id: "giam-sat-bep", title: "Giám sát Bếp Chi Nhánh" },
  { id: "giam-doc-bep", title: "Giám đốc bếp" },
  { id: "quan-ly-vung", title: "Quản lý vùng" },
  { id: "quan-ly", title: "Quản lý" },
  { id: "to-truong", title: "Tổ trưởng" },
  { id: "hoc-viec-bep", title: "Học việc bếp" },
  { id: "hoc-viec-pho-quan-ly", title: "Học việc phó quản lý" },
  { id: "phuc-vu-ban", title: "Phục vụ bàn" },
  { id: "phu-bep", title: "Phụ bếp" },
  { id: "cham-soc-khach-hang", title: "Lễ tân, chăm sóc khách hàng" },
  { id: "thoi-vu-3-buoi", title: "Thời vụ 3 buổi" },
  { id: "thu-ngan", title: "Thu ngân" },
  { id: "pha-che-full-time", title: "Pha chế" },
  { id: "tap-vu-rua-chen", title: "Tạp vụ, rửa chén" },
];
