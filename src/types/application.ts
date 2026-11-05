export type ApplicationStatus =
  | "pending"       // Chờ liên hệ
  | "contacted"     // Đã gọi điện / liên hệ
  | "interviewed"   // Đã phỏng vấn
  | "hired"         // Đã nhận việc
  | "rejected";     // Không phù hợp

export interface ApplicationItem {
  id: string;
  fullName: string;
  age: string;
  phoneZalo: string;
  appliedRegion?: string;
  address?: string;
  positionId?: string;
  positionTitle: string;
  preferredBranch?: string;
  cvFileName?: string;
  cvBase64?: string;
  cvFileUrl?: string;
  cvFileSize?: number;
  cvFileType?: string;
  note?: string;
  status: ApplicationStatus;
  telegramNotified?: boolean;
  createdAt: string;
  updatedAt?: string;
}
