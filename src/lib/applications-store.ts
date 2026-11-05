import fs from "fs";
import path from "path";
import { ApplicationItem, ApplicationStatus } from "@/types/application";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "applications.json");

function readLocalApplications(): ApplicationItem[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(data) as ApplicationItem[];
    }
  } catch (err) {
    console.error("Error reading applications.json:", err);
  }
  return [];
}

function writeLocalApplications(applications: ApplicationItem[]) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(applications, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing applications.json:", err);
  }
}

export async function getApplicationsList(): Promise<ApplicationItem[]> {
  // 1. Thử lấy từ Supabase nếu đã cấu hình
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const supabaseApps: ApplicationItem[] = data.map((item) => ({
            id: item.id,
            fullName: item.full_name,
            age: item.age,
            phoneZalo: item.phone_zalo,
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

          // Đồng bộ nhẹ nhàng vào local để luôn có backup
          const localApps = readLocalApplications();
          const merged = [...supabaseApps];
          for (const local of localApps) {
            if (!merged.some((m) => m.id === local.id)) {
              merged.push(local);
            }
          }
          return merged.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }
    } catch (err) {
      console.warn("Supabase load applications failed, fallback to local:", err);
    }
  }

  // 2. Dự phòng file JSON cục bộ
  const localList = readLocalApplications();
  return localList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveApplication(app: Partial<ApplicationItem>): Promise<ApplicationItem> {
  const newApp: ApplicationItem = {
    id: app.id || `app-${Date.now()}`,
    fullName: app.fullName || "Ứng viên",
    age: app.age || "Chưa rõ",
    phoneZalo: app.phoneZalo || "",
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

  // Lưu Supabase nếu có
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("applications").upsert({
          id: newApp.id,
          full_name: newApp.fullName,
          age: newApp.age,
          phone_zalo: newApp.phoneZalo,
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
          status: newApp.status,
          telegram_notified: newApp.telegramNotified,
          created_at: newApp.createdAt,
          updated_at: newApp.updatedAt,
        });
      }
    } catch (err) {
      console.warn("Supabase upsert application failed:", err);
    }
  }

  // Luôn lưu local JSON
  const localList = readLocalApplications();
  const existingIdx = localList.findIndex((item) => item.id === newApp.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = newApp;
  } else {
    localList.unshift(newApp);
  }
  writeLocalApplications(localList);

  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<boolean> {
  const updatedAt = new Date().toISOString();

  // Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase
          .from("applications")
          .update({ status, updated_at: updatedAt })
          .eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase update application status failed:", err);
    }
  }

  // Local JSON
  const localList = readLocalApplications();
  const target = localList.find((item) => item.id === id);
  if (target) {
    target.status = status;
    target.updatedAt = updatedAt;
    writeLocalApplications(localList);
    return true;
  }

  return true;
}

export async function deleteApplication(id: string): Promise<boolean> {
  // Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("applications").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase delete application failed:", err);
    }
  }

  // Local JSON
  const localList = readLocalApplications();
  const filtered = localList.filter((item) => item.id !== id);
  writeLocalApplications(filtered);
  return true;
}
