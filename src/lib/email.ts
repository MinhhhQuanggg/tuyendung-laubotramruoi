import nodemailer from "nodemailer";
import { CandidateApplication } from "@/types/job";
import { siteConfig } from "@/config/site";

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

const DEFAULT_HR_EMAIL = "qminh0733@gmail.com";

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Khởi tạo transporter cho Nodemailer
 * Sử dụng dịch vụ Gmail SMTP chuẩn
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || DEFAULT_HR_EMAIL;
  const rawPass = process.env.SMTP_PASS;

  // Nếu chưa cấu hình mật khẩu ứng dụng (App Password)
  if (!rawPass || rawPass.trim() === "" || rawPass.includes("xxxx")) {
    return null;
  }

  // Chuẩn hóa mật khẩu ứng dụng Gmail (xóa khoảng trắng và dấu cách)
  const pass = rawPass.trim().replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true cho port 465, false cho các port khác (587)
    auth: {
      user,
      pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Xây dựng giao diện HTML email xác nhận tiếp nhận hồ sơ ứng tuyển
 * Phong cách nhận diện thương hiệu Lẩu Bò Trăm Rưỡi (Đỏ đô F&B #8B1E1E + Vàng kim)
 */
function buildConfirmationEmailHtml(candidate: CandidateApplication): string {
  const hrPhone = siteConfig.hrContact?.phone || "0981256712";
  const hrZaloUrl = siteConfig.hrContact?.zaloUrl || `https://zalo.me/${hrPhone}`;
  const hrEmail = process.env.SMTP_USER || DEFAULT_HR_EMAIL;
  const region = candidate.appliedRegion || candidate.address || "Gần nhà nhất (HR tự xếp)";
  const branch = candidate.preferredBranch || "Gần nhà nhất (HR tự xếp)";

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận hồ sơ ứng tuyển - Tiệm Lẩu Bò Trăm Rưỡi</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1F2937; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #E5E7EB;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B1E1E 0%, #6B1414 50%, #2A0505 100%); padding: 32px 24px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 8px 16px; border-radius: 20px; background-color: rgba(255,255,255,0.12); border: 1px solid rgba(254,240,138,0.4); margin-bottom: 12px;">
                      <span style="color: #FEF08A; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        🍲 TIỆM LẨU BÒ TRĂM RƯỠI — TUYỂN DỤNG CHÍNH THỨC
                      </span>
                    </div>
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 900; letter-spacing: -0.3px;">
                      XÁC NHẬN TIẾP NHẬN HỒ SƠ
                    </h1>
                    <p style="margin: 8px 0 0; color: #FECACA; font-size: 14px;">
                      Học việc, học nghề miễn phí • Vẫn có lương đủ • Bao ăn ca
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <p style="font-size: 16px; margin: 0 0 16px;">
                Xin chào <strong style="color: #8B1E1E; font-size: 17px;">${candidate.fullName}</strong>,
              </p>
              <p style="font-size: 15px; margin: 0 0 20px; color: #374151;">
                Phòng Tuyển dụng (HR) <strong>Hệ Thống Tiệm Lẩu Bò Trăm Rưỡi</strong> xin thông báo: chúng tôi đã tiếp nhận thành công hồ sơ đăng ký ứng tuyển của bạn cho vị trí:
              </p>

              <!-- Position Highlight Box -->
              <div style="background-color: #FEF2F2; border-left: 4px solid #8B1E1E; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #991B1B; text-transform: uppercase; letter-spacing: 0.5px;">Vị trí bạn ứng tuyển</div>
                <div style="font-size: 20px; font-weight: 900; color: #7F1D1D; margin-top: 4px;">${candidate.positionTitle}</div>
              </div>

              <!-- Information Summary Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; border-radius: 10px; margin-bottom: 24px; font-size: 14px;">
                <tr style="background-color: #F9FAFB;">
                  <td colspan="2" style="padding: 10px 16px; font-weight: 700; color: #1F2937; border-bottom: 1px solid #E5E7EB;">
                    📋 Tóm tắt thông tin đăng ký
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; width: 40%; border-bottom: 1px solid #F3F4F6;">👤 Họ và tên:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #111827; border-bottom: 1px solid #F3F4F6;">${candidate.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; border-bottom: 1px solid #F3F4F6;">🎂 Tuổi:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #111827; border-bottom: 1px solid #F3F4F6;">${candidate.age}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; border-bottom: 1px solid #F3F4F6;">📱 Số điện thoại / Zalo:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #8B1E1E; border-bottom: 1px solid #F3F4F6;">${candidate.phoneZalo}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; border-bottom: 1px solid #F3F4F6;">✉️ Email ứng viên:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #111827; border-bottom: 1px solid #F3F4F6;">${candidate.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; border-bottom: 1px solid #F3F4F6;">📍 Khu vực làm việc:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #111827; border-bottom: 1px solid #F3F4F6;">${region}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; border-bottom: 1px solid #F3F4F6;">🏢 Chi nhánh ưu tiên:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #111827; border-bottom: 1px solid #F3F4F6;">${branch}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6B7280; vertical-align: top;">📄 Hồ sơ đính kèm:</td>
                  <td style="padding: 10px 16px; font-weight: 600; color: #111827;">
                    ${
                      candidate.cvFileName
                        ? `<div style="color: #065F46; font-weight: 700;">📎 ${candidate.cvFileName} ${
                            candidate.cvFileSize ? `<span style="color: #059669; font-weight: normal; font-size: 13px;">(${formatFileSize(candidate.cvFileSize)})</span>` : ""
                          }</div>
                           <div style="color: #059669; font-size: 12px; font-weight: 500; margin-top: 3px;">
                             ✓ File CV đã được đính kèm ở góc dưới email để HR & ứng viên tiện xem trực tiếp hoặc tải về máy.
                           </div>`
                        : `<span style="color: #6B7280; font-weight: normal; font-style: italic;">Ứng tuyển nhanh (Chưa kèm file CV)</span>`
                    }
                  </td>
                </tr>
              </table>

              ${
                candidate.cvFileName
                  ? `
              <!-- CV Attachment Notice Box -->
              <div style="background-color: #ECFDF5; border: 1.5px solid #10B981; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 20px; margin-right: 8px;">📎</span>
                  <strong style="color: #065F46; font-size: 15px; text-transform: uppercase;">
                    HỒ SƠ CV ĐÃ ĐÍNH KÈM
                  </strong>
                </div>
                <p style="margin: 0 0 10px; font-size: 14px; color: #047857; line-height: 1.5;">
                  Tệp hồ sơ: <strong style="color: #064E3B;">${candidate.cvFileName}</strong>
                  ${candidate.cvFileSize ? `<span style="color: #059669; font-size: 13px;">(${formatFileSize(candidate.cvFileSize)})</span>` : ""}
                </p>

                ${
                  candidate.cvFileUrl
                    ? `
                <!-- Button Xem CV Trực Tiếp Online -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 14px 0 12px;">
                  <tr>
                    <td align="center">
                      <a href="${candidate.cvFileUrl}" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF; font-weight: 800; font-size: 15px; text-decoration: none; padding: 13px 26px; border-radius: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.35); text-align: center;">
                        📄 BẤM ĐỂ MỞ XEM CV TRỰC TIẾP TRÊN TRÌNH DUYỆT ↗
                      </a>
                    </td>
                  </tr>
                </table>

                ${
                  candidate.cvFileType?.startsWith("image/") ||
                  Boolean(candidate.cvFileName?.match(/\.(jpg|jpeg|png|webp)$/i))
                    ? `
                <div style="margin: 14px 0 10px; text-align: center;">
                  <p style="font-size: 12.5px; font-weight: 600; color: #065F46; margin: 0 0 6px;">📷 Xem trước ảnh CV:</p>
                  <a href="${candidate.cvFileUrl}" target="_blank" style="text-decoration: none;">
                    <img src="${candidate.cvFileUrl}" alt="CV ứng viên" style="max-width: 100%; max-height: 400px; border-radius: 8px; border: 1px solid #A7F3D0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" />
                  </a>
                </div>
                `
                    : ""
                }
                `
                    : ""
                }

                <div style="background-color: #D1FAE5; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #065F46; line-height: 1.5; margin-top: 10px;">
                  💡 <strong>Hướng dẫn xem CV:</strong>
                  <br/>• <strong>Cách 1:</strong> Bấm trực tiếp vào nút màu xanh ở trên để mở xem CV trên tab mới của trình duyệt điện thoại / máy tính.
                  <br/>• <strong>Cách 2:</strong> Cuộn xuống dưới cùng của email này để xem hoặc tải tệp đính kèm (Attachments).
                </div>
              </div>
              `
                  : ""
              }

              <!-- Next Steps: Phone Check Action Notice -->
              <div style="background-color: #FFFBEB; border: 1.5px solid #FCD34D; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 18px; margin-right: 8px;">⚡</span>
                  <strong style="color: #92400E; font-size: 15px; text-transform: uppercase;">
                    TIẾN TRÌNH TIẾP THEO: PHONE CHECK TRONG ÍT PHÚT
                  </strong>
                </div>
                <p style="margin: 0 0 10px; font-size: 14.5px; color: #78350F; line-height: 1.55;">
                  Bộ phận Tuyển dụng (<strong>Anh Nguyễn Trung Kiên - Kiên HR</strong>) sẽ chủ động liên hệ với bạn qua <strong>cuộc gọi hoặc tin nhắn Zalo</strong> từ số <strong>0981 256 712</strong> để tiến hành Phone Check ngắn và xếp lịch phỏng vấn trực tiếp tại chi nhánh gần bạn.
                </p>
                <div style="background-color: #FEF3C7; padding: 8px 12px; border-radius: 6px; font-size: 13.5px; color: #B45309; font-weight: 600;">
                  🔔 Bạn vui lòng chú ý chuông điện thoại từ số <strong>0981 256 712</strong> nhé!
                </div>
              </div>

              <!-- Two-Way Communication (Yêu cầu 10) -->
              <p style="font-size: 14.5px; color: #4B5563; margin: 0 0 20px; line-height: 1.6;">
                💡 <strong>Trao đổi hai chiều:</strong> Bạn hoàn toàn có thể <strong>reply trực tiếp email này</strong> (được chuyển thẳng đến hòm thư <a href="mailto:${hrEmail}" style="color: #8B1E1E; font-weight: 600;">${hrEmail}</a>) hoặc bấm nhắn tin qua Zalo dưới đây nếu có bất kỳ thắc mắc nào về ca làm, địa chỉ hay quyền lợi.
              </p>

              <!-- CTA Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="${hrZaloUrl}" target="_blank" style="display: inline-block; background-color: #0068FF; color: #FFFFFF; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 30px; box-shadow: 0 4px 12px rgba(0,104,255,0.35);">
                      💬 Nhắn tin Zalo với HR (0981 256 712)
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1F2937; color: #9CA3AF; padding: 24px; text-align: center; font-size: 12.5px; border-top: 1px solid #374151;">
              <p style="margin: 0 0 6px; color: #F3F4F6; font-weight: 700; font-size: 14px;">
                HỆ THỐNG TIỆM LẨU BÒ TRĂM RƯỠI — LẨU BÒ TRIỀU CHÂU
              </p>
              <p style="margin: 0 0 8px;">
                Hơn 13 chi nhánh trải rộng khắp TP. Hồ Chí Minh
              </p>
              <p style="margin: 0 0 8px;">
                📞 Hotline Tuyển dụng: <strong style="color: #FCD34D;">${hrPhone}</strong> (Mr. Kiên HR) • ✉️ Email: <strong style="color: #FCD34D;">${hrEmail}</strong>
              </p>
              <p style="margin: 0; color: #6B7280; font-size: 11.5px;">
                Website: <a href="${siteConfig.url}" style="color: #9CA3AF; text-decoration: underline;">${siteConfig.url}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Gửi email xác nhận tiếp nhận hồ sơ ứng tuyển tự động tới ứng viên
 * Đồng thời gắn qminh0733@gmail.com làm:
 * 1. Sender / From & Reply-To
 * 2. BCC để HR nhận ngay bản sao thông báo ứng viên mới qua hộp thư Gmail
 */
export async function sendApplicationConfirmationEmail(
  candidate: CandidateApplication
): Promise<EmailSendResult> {
  const candidateEmail = candidate.email?.trim();

  if (!candidateEmail) {
    return {
      success: false,
      error: "Candidate email is empty or missing",
    };
  }

  const senderEmail = process.env.SMTP_USER || DEFAULT_HR_EMAIL;
  const adminBccEmail = process.env.HR_NOTIFICATION_EMAIL || DEFAULT_HR_EMAIL;
  const fromName = process.env.SMTP_FROM || `"Tuyển Dụng Lẩu Bò Trăm Rưỡi" <${senderEmail}>`;

  // Nhận biết hồ sơ có CV đính kèm hay không
  const hasCv = Boolean(
    candidate.cvFileName && (candidate.cvBase64 || candidate.cvFileUrl)
  );

  const subject = `[Lẩu Bò Trăm Rưỡi] Xác nhận hồ sơ ứng tuyển vị trí ${candidate.positionTitle}${
    hasCv ? " 📎 [CÓ ĐÍNH KÈM CV]" : ""
  }`;
  const htmlContent = buildConfirmationEmailHtml(candidate);

  // Chuẩn bị file đính kèm nếu ứng viên có tải lên CV
  const attachments: Array<{
    filename: string;
    content?: Buffer;
    path?: string;
    contentType?: string;
  }> = [];

  if (candidate.cvFileName) {
    if (candidate.cvBase64) {
      try {
        const base64Data = candidate.cvBase64.includes(",")
          ? candidate.cvBase64.split(",")[1]
          : candidate.cvBase64;
        const buffer = Buffer.from(base64Data, "base64");

        const ext = candidate.cvFileName.split(".").pop()?.toLowerCase() || "";
        const mimeType =
          candidate.cvFileType ||
          (ext === "pdf"
            ? "application/pdf"
            : ext === "png"
            ? "image/png"
            : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : ext === "webp"
            ? "image/webp"
            : ext === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : ext === "doc"
            ? "application/msword"
            : "application/octet-stream");

        attachments.push({
          filename: candidate.cvFileName,
          content: buffer,
          contentType: mimeType,
        });
      } catch (attachErr) {
        console.error("❌ Lỗi chuyển đổi file CV base64 sang tệp đính kèm email:", attachErr);
      }
    } else if (candidate.cvFileUrl) {
      attachments.push({
        filename: candidate.cvFileName,
        path: candidate.cvFileUrl,
        contentType: candidate.cvFileType || "application/octet-stream",
      });
    }
  }

  const transporter = createTransporter();

  // Trường hợp chưa cấu hình SMTP_PASS trong file .env.local
  if (!transporter) {
    console.warn(
      `⚠️ [EMAIL NOTICE] Chưa cấu hình SMTP_PASS (Mật khẩu ứng dụng Gmail) trong file .env.local.\n` +
      `   Đã tạo thành công nội dung email gửi đến: ${candidateEmail} (BCC: ${adminBccEmail})\n` +
      `   Tệp đính kèm CV: ${attachments.length > 0 ? candidate.cvFileName : "Không có"}\n` +
      `   Người gửi: ${senderEmail}\n` +
      `   Tiêu đề: ${subject}\n` +
      `   Để gửi email thực tế qua Gmail, hãy tạo 'Mật khẩu ứng dụng' cho tài khoản ${senderEmail} và thêm SMTP_PASS vào .env.local.`
    );

    return {
      success: true,
      simulated: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  // Gửi email thực tế qua Nodemailer SMTP
  try {
    // Tránh BCC trùng nếu ứng viên test nhập chính địa chỉ email của admin
    const bccRecipient =
      adminBccEmail &&
      adminBccEmail.toLowerCase() !== candidateEmail.toLowerCase()
        ? adminBccEmail
        : undefined;

    const info = await transporter.sendMail({
      from: fromName,
      to: candidateEmail,
      bcc: bccRecipient, // Gắn qminh0733@gmail.com nhận bản sao thông báo kèm file CV
      replyTo: senderEmail, // Khi ứng viên reply email, thư sẽ về qminh0733@gmail.com
      subject,
      html: htmlContent,
      attachments,
    });

    console.log(
      `✅ [EMAIL SUCCESS] Đã gửi email xác nhận thành công tới ${candidateEmail}${
        bccRecipient ? ` (BCC: ${bccRecipient})` : ""
      }${attachments.length > 0 ? ` kèm file CV [${candidate.cvFileName}]` : ""}. MessageID: ${info.messageId}`
    );
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || "Lỗi gửi email";
    console.error(`❌ [EMAIL ERROR] Lỗi khi gửi email xác nhận tới ${candidateEmail}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
