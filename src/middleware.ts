import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu truy cập bất kỳ trang quản trị nào (ngoại trừ trang /admin/login)
  if (
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && pathname !== "/admin/login")
  ) {
    const token = request.cookies.get("admin_session")?.value;

    // Chưa có session đăng nhập -> Chuyển hướng tức thì sang trang đăng nhập /admin/login
    if (!token || token.trim() === "") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Nếu đã có session đăng nhập mà truy cập lại /admin/login -> Vào thẳng /admin
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;
    if (token && token.trim() !== "") {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  // Tự động chuyển hướng từ slug jobs cũ sang viec-lam chuẩn trong admin
  if (pathname.startsWith("/admin/jobs/")) {
    const target = pathname.replace("/admin/jobs/", "/admin/viec-lam/");
    return NextResponse.redirect(new URL(target, request.url));
  }
  if (pathname === "/admin/jobs" || pathname === "/admin/viec-lam") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
