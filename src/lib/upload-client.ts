/**
 * Tiện ích upload file ảnh và video đa nền tảng (hỗ trợ Vercel Serverless + Supabase Storage)
 * - Tự động nén ảnh client-side (giảm 90-95% dung lượng giúp tải nhanh gấp 10-20 lần)
 * - Tự động sử dụng Direct Signed Upload cho video và file dung lượng lớn để vượt giới hạn 4.5MB của Vercel
 * - Tự động fallback sang API POST multipart nếu không dùng được signed URL
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadOptions {
  onProgress?: (progressText: string) => void;
}

/**
 * Nén và thu gọn kích thước ảnh ngay trên trình duyệt trước khi gửi lên máy chủ
 * Giúp giảm dung lượng ảnh từ 5-10MB (ảnh gốc camera điện thoại) xuống còn ~150-300KB
 * Tốc độ upload tăng gấp 10 - 20 lần mà hình ảnh hiển thị trên web vẫn sắc nét hoàn hảo.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<File> {
  // Chỉ nén nếu là file ảnh thông thường
  if (
    typeof window === "undefined" ||
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  // Nếu file vốn đã nhỏ (< 150KB), không cần nén thêm
  if (file.size < 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;

        // Giữ nguyên tỉ lệ khi co kích thước tối đa 1600px
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const newName = file.name.replace(/\.[^.]+$/, ".jpg");
              const compressedFile = new File([blob], newName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

export async function uploadMediaFile(
  file: File,
  options?: UploadOptions
): Promise<UploadResult> {
  if (!file) {
    return { success: false, error: "Vui lòng chọn file" };
  }

  let uploadFile = file;

  // 1. Tự động nén ảnh client-side trước khi truyền qua mạng
  if (file.type.startsWith("image/")) {
    options?.onProgress?.("Đang tối ưu dung lượng ảnh...");
    try {
      uploadFile = await compressImage(file);
    } catch (e) {
      console.warn("Không thể nén ảnh, tiếp tục với file gốc:", e);
      uploadFile = file;
    }
  }

  // 2. Thử upload trực tiếp qua Supabase Signed Upload URL (nhanh, hỗ trợ file lớn đến 50MB, không bị giới hạn 4.5MB của Vercel)
  options?.onProgress?.("Đang tải dữ liệu lên CDN...");
  try {
    const signRes = await fetch(
      `/api/admin/upload?action=sign&filename=${encodeURIComponent(uploadFile.name)}&contentType=${encodeURIComponent(
        uploadFile.type || "application/octet-stream"
      )}`
    );

    if (signRes.ok) {
      const signData = await signRes.json();
      if (signData.success && signData.signedUrl && signData.publicUrl) {
        const uploadRes = await fetch(signData.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": uploadFile.type || "application/octet-stream",
          },
          body: uploadFile,
        });

        if (uploadRes.ok) {
          return { success: true, url: signData.publicUrl };
        }
      }
    }
  } catch (signErr) {
    console.warn("Direct signed upload failed, attempting fallback:", signErr);
  }

  // 3. Dự phòng: Gửi qua FormData tới /api/admin/upload (áp dụng khi file nhỏ hoặc dev local)
  options?.onProgress?.("Đang tải qua máy chủ dự phòng...");
  try {
    const formData = new FormData();
    formData.append("file", uploadFile);
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
