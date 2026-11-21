import fs from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export interface JobPresetsConfig {
  ageTags: string[];
  experienceTags: string[];
  workHoursTags: string[];
}

export const DEFAULT_JOB_PRESETS: JobPresetsConfig = {
  ageTags: [
    "18 – 30 tuổi",
    "18 – 25 tuổi",
    "20 – 30 tuổi",
    "22 – 35 tuổi",
    "Đủ 18 tuổi trở lên",
    "Không giới hạn độ tuổi",
  ],
  experienceTags: [
    "Chưa có kinh nghiệm (Đào tạo từ số 0)",
    "Không yêu cầu kinh nghiệm",
    "Ưu tiên kinh nghiệm F&B",
    "Kinh nghiệm 6 tháng – 1 năm",
    "Kinh nghiệm 1 – 2 năm",
    "Kinh nghiệm từ 2 năm trở lên",
    "Có tay nghề làm bếp / thớt",
    "Có kinh nghiệm phục vụ / order",
  ],
  workHoursTags: [
    "14h00 – 00h00 mỗi ngày",
    "Ca xoay linh hoạt",
    "Ca xoay hoặc ca cố định",
    "Ca làm việc 8h/ngày",
    "Ca sáng (6h00 – 14h00)",
    "Ca chiều (14h00 – 22h00)",
    "Ca tối (16h00 – 00h00)",
    "Đăng ký linh hoạt theo lịch học",
    "Xoay ca theo lịch quản lý",
    "Giờ hành chính & theo lịch quản lý",
  ],
};

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "job-presets.json");
const CONFIG_FILE_PATH = path.join(process.cwd(), "src", "config", "job-presets.json");

export async function getJobPresets(): Promise<JobPresetsConfig> {
  // 1. Thử lấy từ Supabase nếu đã tạo bảng job_presets
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin() as any;
      if (supabase) {
        const { data, error } = await supabase
          .from("job_presets")
          .select("*")
          .eq("id", "default")
          .maybeSingle();

        if (!error && data) {
          return {
            ageTags: Array.isArray(data.age_tags) ? data.age_tags : DEFAULT_JOB_PRESETS.ageTags,
            experienceTags: Array.isArray(data.experience_tags) ? data.experience_tags : DEFAULT_JOB_PRESETS.experienceTags,
            workHoursTags: Array.isArray(data.work_hours_tags) ? data.work_hours_tags : DEFAULT_JOB_PRESETS.workHoursTags,
          };
        }
      }
    } catch {
      // Fall through to JSON file
    }
  }

  // 2. Lấy từ file JSON cục bộ
  try {
    const targetPath = fs.existsSync(DATA_FILE_PATH) ? DATA_FILE_PATH : CONFIG_FILE_PATH;
    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, "utf8");
      const parsed = JSON.parse(content);
      return {
        ageTags: Array.isArray(parsed.ageTags) ? parsed.ageTags : DEFAULT_JOB_PRESETS.ageTags,
        experienceTags: Array.isArray(parsed.experienceTags) ? parsed.experienceTags : DEFAULT_JOB_PRESETS.experienceTags,
        workHoursTags: Array.isArray(parsed.workHoursTags) ? parsed.workHoursTags : DEFAULT_JOB_PRESETS.workHoursTags,
      };
    }
  } catch (err) {
    console.error("Error reading job-presets.json:", err);
  }

  return DEFAULT_JOB_PRESETS;
}

export async function saveJobPresets(updated: Partial<JobPresetsConfig>): Promise<JobPresetsConfig> {
  const current = await getJobPresets();
  const nextConfig: JobPresetsConfig = {
    ageTags: updated.ageTags ? updated.ageTags.filter((t) => t && t.trim() !== "") : current.ageTags,
    experienceTags: updated.experienceTags ? updated.experienceTags.filter((t) => t && t.trim() !== "") : current.experienceTags,
    workHoursTags: updated.workHoursTags ? updated.workHoursTags.filter((t) => t && t.trim() !== "") : current.workHoursTags,
  };

  // 1. Lưu ra tệp JSON
  try {
    const jsonStr = JSON.stringify(nextConfig, null, 2);
    try {
      fs.writeFileSync(DATA_FILE_PATH, jsonStr, "utf8");
    } catch {}
    try {
      fs.writeFileSync(CONFIG_FILE_PATH, jsonStr, "utf8");
    } catch {}
  } catch (err) {
    console.error("Error writing job-presets.json:", err);
  }

  // 2. Lưu vào Supabase nếu có bảng job_presets
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin() as any;
      if (supabase) {
        await supabase.from("job_presets").upsert({
          id: "default",
          age_tags: nextConfig.ageTags,
          experience_tags: nextConfig.experienceTags,
          work_hours_tags: nextConfig.workHoursTags,
          updated_at: new Date().toISOString(),
        });
      }
    } catch {
      // Supabase table might not exist yet, safe to ignore
    }
  }

  return nextConfig;
}
