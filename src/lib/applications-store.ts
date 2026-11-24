import fs from "fs";
import path from "path";
import { ApplicationItem, ApplicationStatus } from "@/types/application";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const LOCAL_APPLICATIONS_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "applications.json"
);

function readLocalApplications(): ApplicationItem[] {
  try {
    if (fs.existsSync(LOCAL_APPLICATIONS_PATH)) {
      const data = fs.readFileSync(LOCAL_APPLICATIONS_PATH, "utf8");
      return JSON.parse(data) as ApplicationItem[];
    }
  } catch (err) {
    console.error("Error reading local applications.json:", err);
  }
  return [];
}

function writeLocalApplications(list: ApplicationItem[]) {
  try {
    fs.writeFileSync(
      LOCAL_APPLICATIONS_PATH,
      JSON.stringify(list, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error writing local applications.json:", err);
  }
}

export async function getApplicationsList(): Promise<ApplicationItem[]> {
  // 1. Nếu có Supabase, thử lấy từ Cloud DB
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            fullName: item.full_name,
            age: item.age,
            phoneZalo: item.phone_zalo,
            email: item.email || undefined,
            appliedRegion: item.applied_region || undefined,
            address: item.address || undefined,
            positionId: item.position_id || undefined,
            positionTitle: item.position_title,
            preferredBranch: item.preferred_branch || undefined,
            cvFileName: item.cv_file_name || undefined,
            cvBase64: item.cv_base64 || undefined,
            cvFileUrl: item.cv_file_url || undefined,
            cvFileSize: item.cv_file_size || undefined,
            cvFileType: item.cv_file_type || undefined,
            note: item.note || undefined,
            status: (item.status as ApplicationStatus) || "pending",
            telegramNotified: item.telegram_notified ?? false,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
        }
      }
    } catch (err) {
      console.error("Supabase load in getApplicationsList failed:", err);
    }
  }

  // 2. Chế độ Dữ liệu Tĩnh: Đọc từ file JSON cục bộ
  return readLocalApplications();
}

export async function getApplicationById(id: string): Promise<ApplicationItem | null> {
  const list = await getApplicationsList();
  return list.find((item) => item.id === id) || null;
}

export async function saveApplication(
  app: Partial<ApplicationItem>
): Promise<ApplicationItem> {
  const newApp: ApplicationItem = {
    id: app.id || `app-${Date.now().toString(36)}`,
    fullName: app.fullName || "Ứng viên",
    age: app.age || "Chưa rõ",
    phoneZalo: app.phoneZalo || "",
    email: app.email,
    appliedRegion: app.appliedRegion,
    address: app.address,
    positionId: app.positionId,
    positionTitle: app.positionTitle || "Vị trí chung",
    preferredBranch: app.preferredBranch,
    cvFileName: app.cvFileName,
    cvBase64: app.cvBase64,
    cvFileUrl: app.cvFileUrl,
    cvFileSize: app.cvFileSize,
    cvFileType: app.cvFileType,
    note: app.note,
    status: app.status || "pending",
    telegramNotified: app.telegramNotified ?? false,
    createdAt: app.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Lưu vào file cục bộ (Dữ liệu tĩnh)
  const currentList = readLocalApplications();
  const existingIdx = currentList.findIndex((item) => item.id === newApp.id);
  if (existingIdx !== -1) {
    currentList[existingIdx] = newApp;
  } else {
    currentList.unshift(newApp);
  }
  writeLocalApplications(currentList);

  // Nếu có cấu hình Supabase thì đồng bộ thêm lên cloud
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const dbStatus = newApp.status === "interviewed" ? "contacted" : newApp.status;
        await supabase.from("applications").upsert({
          id: newApp.id,
          full_name: newApp.fullName,
          age: newApp.age,
          phone_zalo: newApp.phoneZalo,
          email: newApp.email || null,
          applied_region: newApp.appliedRegion,
          address: newApp.address,
          position_id: newApp.positionId,
          position_title: newApp.positionTitle,
          preferred_branch: newApp.preferredBranch,
          cv_file_name: newApp.cvFileName,
          cv_base64: newApp.cvBase64,
          cv_file_url: newApp.cvFileUrl,
          cv_file_size: newApp.cvFileSize,
          cv_file_type: newApp.cvFileType,
          note: newApp.note,
          status: dbStatus,
          telegram_notified: newApp.telegramNotified,
          created_at: newApp.createdAt,
          updated_at: newApp.updatedAt,
        });
      }
    } catch (err) {
      console.error("Supabase upsert application failed:", err);
    }
  }

  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<boolean> {
  const updatedAt = new Date().toISOString();

  // Cập nhật file cục bộ
  const currentList = readLocalApplications();
  const target = currentList.find((item) => item.id === id);
  if (target) {
    target.status = status;
    target.updatedAt = updatedAt;
    writeLocalApplications(currentList);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const dbStatus = status === "interviewed" ? "contacted" : status;
        await supabase
          .from("applications")
          .update({ status: dbStatus, updated_at: updatedAt })
          .eq("id", id);
      }
    } catch (err) {
      console.error("Supabase update application status failed:", err);
    }
  }

  return Boolean(target);
}

export async function deleteApplication(id: string): Promise<boolean> {
  const currentList = readLocalApplications();
  const filtered = currentList.filter((item) => item.id !== id);
  if (filtered.length !== currentList.length) {
    writeLocalApplications(filtered);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("applications").delete().eq("id", id);
      }
    } catch (err) {
      console.error("Supabase delete application exception:", err);
    }
  }

  return true;
}
