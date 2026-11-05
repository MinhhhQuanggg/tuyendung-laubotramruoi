import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTelegramLeadNotification } from "@/lib/telegram";
import { sendSlackApplicationNotification } from "@/lib/slack";
import { appendCandidateToGoogleSheet } from "@/lib/google-sheets";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { saveApplication } from "@/lib/applications-store";

const ApplySchema = z.object({
  fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  age: z.string().min(1, "Vui lòng nhập tuổi"),
  phoneZalo: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  appliedRegion: z.string().optional(),
  address: z.string().optional(),
  positionId: z.string().min(1, "Vui lòng chọn vị trí ứng tuyển"),
  positionTitle: z.string().min(1, "Vị trí không hợp lệ"),
  preferredBranch: z.string().optional(),
  cvFileName: z.string().optional(),
  cvBase64: z.string().optional(),
  cvFileSize: z.number().optional(),
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

    const candidatePayload = {
      ...validatedData,
      appliedRegion: region,
      address: region,
    };

    let dbApplicationId: string | undefined = undefined;
    let dbSaved = false;

    // 1. Lưu hồ sơ ứng viên vào Hệ thống Quản trị (Supabase + Local Store)
    try {
      const savedApp = await saveApplication({
        fullName: validatedData.fullName,
        age: validatedData.age,
        phoneZalo: validatedData.phoneZalo,
        appliedRegion: region,
        address: validatedData.address || region,
        positionId: validatedData.positionId,
        positionTitle: validatedData.positionTitle,
        preferredBranch: validatedData.preferredBranch,
        cvFileName: validatedData.cvFileName,
        cvBase64: validatedData.cvBase64,
        cvFileSize: validatedData.cvFileSize,
        cvFileType: validatedData.cvFileType,
        note: validatedData.note,
        status: "pending",
        telegramNotified: false,
      });
      if (savedApp) {
        dbApplicationId = savedApp.id;
        dbSaved = true;
      }
    } catch (saveErr) {
      console.error("Save application error:", saveErr);
    }

    // 2. Chạy song song các kênh lưu trữ & thông báo tức thì (Non-blocking để tối ưu thời gian phản hồi)
    const [sheetResult, slackResult, telegramResult] = await Promise.allSettled([
      // A. Ghi vào Google Sheet Quản lý Ứng viên (Storage / Lưu trữ)
      appendCandidateToGoogleSheet(candidatePayload),

      // B. Bắn thông báo tức thì qua Incoming Slack Webhook cho HR gọi phỏng vấn (Realtime)
      sendSlackApplicationNotification(candidatePayload),

      // C. Bắn thông báo qua Telegram Bot cho HR (Dự phòng realtime)
      sendTelegramLeadNotification(candidatePayload),
    ]);

    const isSheetSaved =
      sheetResult.status === "fulfilled" && sheetResult.value.success;
    const isSlackNotified =
      slackResult.status === "fulfilled" && slackResult.value.success;
    const isTelegramNotified =
      telegramResult.status === "fulfilled" && telegramResult.value.success;

    // Ghi log chi tiết trạng thái từng kênh
    console.log("📊 Kết quả xử lý đơn ứng tuyển:", {
      candidate: `${validatedData.fullName} (${validatedData.phoneZalo})`,
      position: validatedData.positionTitle,
      supabaseDb: dbSaved ? "✅ Thành công" : "⚠️ Chưa cấu hình hoặc lỗi",
      googleSheet: isSheetSaved
        ? `✅ Đã lưu (${(sheetResult as PromiseFulfilledResult<any>).value.method})`
        : `⚠️ ${sheetResult.status === "fulfilled" ? (sheetResult as PromiseFulfilledResult<any>).value.error : (sheetResult as PromiseRejectedResult).reason}`,
      slack: isSlackNotified
        ? "✅ Đã gửi Slack"
        : `⚠️ ${slackResult.status === "fulfilled" ? (slackResult as PromiseFulfilledResult<any>).value.error : (slackResult as PromiseRejectedResult).reason}`,
      telegram: isTelegramNotified
        ? "✅ Đã gửi Telegram"
        : `⚠️ ${telegramResult.status === "fulfilled" ? (telegramResult as PromiseFulfilledResult<any>).value.error : (telegramResult as PromiseRejectedResult).reason}`,
    });

    // 3. Đánh dấu đã bắn telegram thành công trong Supabase nếu có
    if (dbSaved && dbApplicationId && isTelegramNotified) {
      try {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          await supabase
            .from("applications")
            .update({ telegram_notified: true })
            .eq("id", dbApplicationId);
        }
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Nộp hồ sơ thành công! Bộ phận Tuyển Dụng Lẩu Bò Trăm Rưỡi sẽ liên hệ bạn sớm nhất.",
      applicationId: dbApplicationId,
      details: {
        dbSaved,
        sheetSaved: isSheetSaved,
        slackNotified: isSlackNotified,
        telegramNotified: isTelegramNotified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
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
