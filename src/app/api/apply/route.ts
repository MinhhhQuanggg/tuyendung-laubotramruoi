import { NextResponse } from "next/server";
import { z } from "zod";
// Google Sheets API & Slack Webhook đang được ẩn (tắt)
import { appendCandidateToGoogleSheet } from "@/lib/google-sheets";
import { sendSlackApplicationNotification } from "@/lib/slack";
import { sendApplicationConfirmationEmail } from "@/lib/email";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { saveApplication } from "@/lib/applications-store";

// =========================================================================
// CẤU HÌNH KÊNH THÔNG BÁO BÊN NGOÀI
// =========================================================================
// Telegram Bot API: Đã gỡ bỏ hoàn toàn
// Google Sheets API & Slack Webhook: Đang ẩn (tắt), chuyển thành true nếu muốn mở lại
const ENABLE_GOOGLE_SHEETS = false;
const ENABLE_SLACK = false;

const ALLOWED_CV_EXTENSIONS = ["pdf", "doc", "docx", "png", "jpg", "jpeg", "webp"];

const ApplySchema = z.object({
  fullName: z.string().optional(),
  age: z.string().optional(),
  phoneZalo: z
    .string()
    .refine(
      (val) => !/[^\d]/.test(val.trim()),
      { message: "Số điện thoại chỉ được chứa chữ số" }
    )
    .refine(
      (val) => {
        const clean = val.trim();
        return clean.length <= 10;
      },
      { message: "Dư số điện thoại" }
    )
    .refine(
      (val) => {
        const clean = val.trim();
        return /^0[0-9]{9}$/.test(clean);
      },
      { message: "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có đúng 10 số)" }
    ),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Địa chỉ email không hợp lệ (ví dụ: tenban@gmail.com)"
    ),
  appliedRegion: z.string().optional(),
  address: z.string().optional(),
  positionId: z.string().min(1, "Vui lòng chọn vị trí ứng tuyển"),
  positionTitle: z.string().min(1, "Vị trí không hợp lệ"),
  salaryDisplay: z.string().optional(),
  preferredBranch: z.string().optional(),
  cvFileName: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const ext = val.split(".").pop()?.toLowerCase() || "";
        return ALLOWED_CV_EXTENSIONS.includes(ext);
      },
      { message: "File CV sai định dạng. Chỉ chấp nhận file PDF, Word (.doc, .docx) hoặc file Ảnh (.jpg, .jpeg, .png)" }
    ),
  cvBase64: z.string().optional(),
  cvFileUrl: z.string().optional(),
  cvFileSize: z
    .number()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === null) return true;
        return val > 0 && val <= 10 * 1024 * 1024;
      },
      { message: "Dung lượng file CV không hợp lệ (tối đa 10MB)" }
    ),
  cvFileType: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ApplySchema.parse(body);

    const region =
      validatedData.appliedRegion ||
      validatedData.address ||
      "Gần nhà nhất (HR tự xếp)";

    let uploadedCvUrl = validatedData.cvFileUrl;

    // Tự động upload CV lên Supabase Storage CDN để có liên kết trực tiếp mở xem ngay trên trình duyệt
    if (
      !uploadedCvUrl &&
      validatedData.cvBase64 &&
      validatedData.cvFileName &&
      isSupabaseConfigured()
    ) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        if (supabaseAdmin) {
          const base64Data = validatedData.cvBase64.includes(",")
            ? validatedData.cvBase64.split(",")[1]
            : validatedData.cvBase64;
          const buffer = Buffer.from(base64Data, "base64");
          const ext =
            validatedData.cvFileName.split(".").pop()?.toLowerCase() || "pdf";
          const storagePath = `cv/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}.${ext}`;
          const contentType =
            validatedData.cvFileType ||
            (ext === "pdf" ? "application/pdf" : "image/jpeg");

          const { error: uploadError } = await supabaseAdmin.storage
            .from("media")
            .upload(storagePath, buffer, { contentType, upsert: true });

          if (!uploadError) {
            const { data: pubData } = supabaseAdmin.storage
              .from("media")
              .getPublicUrl(storagePath);
            uploadedCvUrl = pubData.publicUrl;
          }
        }
      } catch (uploadErr) {
        console.error("Lỗi khi tải CV lên Supabase Storage CDN:", uploadErr);
      }
    }

    const candidatePayload = {
      ...validatedData,
      fullName: validatedData.fullName?.trim() || "Ứng viên",
      age: validatedData.age?.trim() || "",
      email: validatedData.email?.trim() || "",
      appliedRegion: region,
      address: region,
      salaryDisplay: validatedData.salaryDisplay,
      cvFileUrl: uploadedCvUrl,
    };

    let dbApplicationId: string | undefined = undefined;
    let dbSaved = false;

    // 1. Lưu hồ sơ ứng viên vào Hệ thống Quản trị (Supabase + Local Store)
    try {
      const savedApp = await saveApplication({
        fullName: candidatePayload.fullName,
        age: candidatePayload.age,
        phoneZalo: validatedData.phoneZalo,
        email: candidatePayload.email,
        appliedRegion: region,
        address: validatedData.address || region,
        positionId: validatedData.positionId,
        positionTitle: validatedData.positionTitle,
        preferredBranch: validatedData.preferredBranch,
        cvFileName: validatedData.cvFileName,
        cvBase64: validatedData.cvBase64,
        cvFileUrl: uploadedCvUrl,
        cvFileSize: validatedData.cvFileSize,
        cvFileType: validatedData.cvFileType,
        note: validatedData.note,
        status: "pending",
      });
      if (savedApp) {
        dbApplicationId = savedApp.id;
        dbSaved = true;
      }
    } catch (saveErr) {
      console.error("Save application error:", saveErr);
    }

    // 2. Chạy ngầm gửi Email thông báo & xác nhận (Background Task)
    // KHÔNG dùng await để trả kết quả thành công ngay lập tức cho ứng viên (< 200ms)
    (async () => {
      try {
        const backgroundTasks: Promise<any>[] = [
          // Kênh thông báo chính thức: Gửi Email xác nhận tự động tới ứng viên (kèm file CV & BCC tới HR)
          sendApplicationConfirmationEmail(candidatePayload),
        ];

        // Google Sheets API (Đang ẩn / tắt theo cấu hình)
        if (ENABLE_GOOGLE_SHEETS) {
          backgroundTasks.push(appendCandidateToGoogleSheet(candidatePayload));
        }

        // Slack Webhook (Đang ẩn / tắt theo cấu hình)
        if (ENABLE_SLACK) {
          backgroundTasks.push(sendSlackApplicationNotification(candidatePayload));
        }

        const [emailResult] = await Promise.allSettled(backgroundTasks);

        const isEmailSent =
          emailResult &&
          emailResult.status === "fulfilled" &&
          emailResult.value?.success;

        // Ghi log chi tiết trạng thái xử lý
        console.log("📊 Kết quả xử lý đơn ứng tuyển (Background):", {
          candidate: `${validatedData.fullName} (${validatedData.phoneZalo} - ${validatedData.email})`,
          position: validatedData.positionTitle,
          supabaseDb: dbSaved ? "✅ Thành công" : "⚠️ Chưa cấu hình hoặc lỗi",
          emailConfirmation: isEmailSent
            ? `✅ Đã gửi Email (${(emailResult as PromiseFulfilledResult<any>).value.simulated ? "Mô phỏng" : "Thực tế"})`
            : `⚠️ ${emailResult?.status === "fulfilled" ? (emailResult as PromiseFulfilledResult<any>).value?.error : (emailResult as PromiseRejectedResult)?.reason}`,
          googleSheets: ENABLE_GOOGLE_SHEETS ? "Đã bật" : "🔒 Đang ẩn (Tắt)",
          slackWebhook: ENABLE_SLACK ? "Đã bật" : "🔒 Đang ẩn (Tắt)",
          telegramBot: "🚫 Đã gỡ bỏ",
        });
      } catch (bgError) {
        console.error("❌ Lỗi khi thực hiện thông báo nền:", bgError);
      }
    })();

    // 3. Phản hồi thành công siêu tốc cho ứng viên (không bị delay)
    return NextResponse.json({
      success: true,
      message:
        "Nộp hồ sơ thành công! Bộ phận Tuyển Dụng Lẩu Bò Trăm Rưỡi sẽ liên hệ bạn sớm nhất.",
      applicationId: dbApplicationId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || "Dữ liệu không hợp lệ",
          details: error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    console.error("Apply API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Đã có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}
