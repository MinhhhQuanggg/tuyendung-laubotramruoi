/**
 * Tiện ích upload file ảnh và video đa nền tảng (hỗ trợ Vercel Serverless + Supabase Storage)
 * - Tự động sử dụng Direct Signed Upload cho video và file dung lượng lớn để vượt giới hạn 4.5MB của Vercel
 * - Tự động fallback sang API POST multipart nếu không dùng được signed URL
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadMediaFile(file: File): Promise<UploadResult> {
  if (!file) {
    return { success: false, error: "Vui lòng chọn file" };
  }

  // 1. Thử upload trực tiếp qua Supabase Signed Upload URL (nhanh, hỗ trợ file lớn đến 50MB, không bị giới hạn 4.5MB của Vercel)
  try {
    const signRes = await fetch(
      `/api/admin/upload?action=sign&filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(
        file.type || "application/octet-stream"
      )}`
    );

    if (signRes.ok) {
      const signData = await signRes.json();
      if (signData.success && signData.signedUrl && signData.publicUrl) {
        const uploadRes = await fetch(signData.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        if (uploadRes.ok) {
          return { success: true, url: signData.publicUrl };
        }
      }
    }
  } catch (signErr) {
    console.warn("Direct signed upload failed, attempting fallback:", signErr);
  }

  // 2. Dự phòng: Gửi qua FormData tới /api/admin/upload (áp dụng khi file nhỏ hoặc dev local)
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success && data.url) {
      return { success: true, url: data.url };
    }
    return { success: false, error: data.error || "Tải lên không thành công" };
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi kết nối khi tải lên" };
  }
}
