import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ success: false, error: "Chưa đăng nhập quyền Admin" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "sign") {
    const rawFilename = searchParams.get("filename") || "file";
    const contentType = searchParams.get("contentType") || "application/octet-stream";
    const isVideo =
      contentType.startsWith("video/") ||
      [".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v"].includes(
        path.extname(rawFilename).toLowerCase()
      );

    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin && isSupabaseConfigured()) {
      const ext = path.extname(rawFilename) || (isVideo ? ".mp4" : ".jpg");
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const subFolder = isVideo ? "videos" : "images";
      const storagePath = `${subFolder}/${filename}`;

      const { data, error } = await supabaseAdmin.storage
        .from("media")
        .createSignedUploadUrl(storagePath, { upsert: true });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      const { data: pubData } = supabaseAdmin.storage.from("media").getPublicUrl(storagePath);

      return NextResponse.json({
        success: true,
        signedUrl: data.signedUrl,
        token: data.token,
        path: storagePath,
        publicUrl: pubData.publicUrl,
      });
    }

    return NextResponse.json({ success: false, error: "Supabase chưa được cấu hình" }, { status: 400 });
  }

  return NextResponse.json({ success: false, error: "Yêu cầu không hợp lệ" }, { status: 400 });
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ success: false, error: "Chưa đăng nhập quyền Admin" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Không tìm thấy file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo =
      file.type.startsWith("video/") ||
      [".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v"].includes(
        path.extname(file.name).toLowerCase()
      );

    const ext = path.extname(file.name) || (isVideo ? ".mp4" : ".jpg");
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const subFolder = isVideo ? "videos" : "images";
    const storagePath = `${subFolder}/${filename}`;
    const contentType = file.type || (isVideo ? "video/mp4" : "image/jpeg");

    // 1. Lưu trực tiếp lên Supabase Storage CDN
    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        const { error: uploadError } = await supabaseAdmin.storage
          .from("media")
          .upload(storagePath, buffer, {
            contentType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: pubData } = supabaseAdmin.storage.from("media").getPublicUrl(storagePath);
          return NextResponse.json({ success: true, url: pubData.publicUrl });
        } else {
          return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
        }
      }
    }

    // 2. Fallback lưu vào thư mục public cục bộ (cho môi trường dev offline)
    const targetDir = path.join(process.cwd(), "public", subFolder, "uploads");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);

    const url = `/${subFolder}/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
