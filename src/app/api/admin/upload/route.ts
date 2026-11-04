import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";

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

    const subFolder = isVideo ? path.join("videos", "uploads") : path.join("images", "uploads");
    const targetDir = path.join(process.cwd(), "public", subFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Clean file name
    const ext = path.extname(file.name) || (isVideo ? ".mp4" : ".jpg");
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(targetDir, filename);

    fs.writeFileSync(filePath, buffer);

    const url = isVideo ? `/videos/uploads/${filename}` : `/images/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
