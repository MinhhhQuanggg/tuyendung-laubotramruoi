import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ngắt toàn bộ trang quản trị /admin: Chuyển hướng ngay lập tức về trang chủ (/)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Ngắt toàn bộ các API quản trị nội bộ /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { success: false, error: "Hệ thống đang hoạt động ở chế độ dữ liệu tĩnh, Admin API đã tắt." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
