import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ngắt hoàn toàn giao diện admin, chuyển hướng trực tiếp về trang chủ
  redirect("/");
}
