export type JobCategory =
  | "Học nghề có lương"
  | "Part-time"
  | "Part-time, Thời vụ"
  | "Full-time"
  | "Trưởng, Quản lý";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "TEMPORARY" | "CONTRACTOR";

export interface ConcisePoint {
  icon: string;
  label?: string;
  content: string;
}

export interface ConciseJobPost {
  intro: string;
  zalo: string;
  headline?: string;
  points?: ConcisePoint[];
}

export interface JobItem {
  // === THUỘC TÍNH HIỂN THỊ TRỰC TIẾP TRÊN WEB ===
  id: string;
  slug: string;
  title: string;
  category: JobCategory;
  badges?: string[];
  salaryDisplay: string;
  locations: string[]; // Danh sách khu vực / chi nhánh
  ageRequirement: string;
  experienceDisplay: string;
  workHours?: string; // Ca làm việc
  isActive: boolean;
  showInMenu?: boolean; // Tùy chọn hiển thị công việc trên Menu điều hướng Header
  menuPlacement?: "PARENT" | "DIRECT"; // "PARENT": Gắn vào menu cha có sẵn, "DIRECT": Hiển thị trực tiếp ở menu điều hướng
  parentMenu?: string; // Tên menu cha được gắn vào (mặc định theo category của job)
  contactZalo?: string;
  images?: string[]; // 4 hình ảnh
  videoUrl?: string; // Video thực tế
  videoPoster?: string;
  concisePost?: ConciseJobPost; // Nội dung bài đăng công việc (Long Text)

  // === THUỘC TÍNH PHỤ TRỢ / LEGACY (Không hiển thị trực tiếp) ===
  badge?: string;
  workType?: EmploymentType;
  workTypeDisplay?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryUnit?: "MONTH" | "HOUR";
  experienceRequirements?: string;
  descriptionHtml?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  datePosted?: string;
  validThrough?: string;
  isUrgent?: boolean;
}

export interface CandidateApplication {
  fullName?: string;
  age?: string;
  phoneZalo: string;
  email?: string;
  appliedRegion?: string;
  address?: string;
  positionId: string;
  positionTitle: string;
  salaryDisplay?: string;
  preferredBranch?: string;
  cvFileName?: string;
  cvBase64?: string;
  cvFileUrl?: string;
  cvFileSize?: number;
  cvFileType?: string;
  note?: string;
}
