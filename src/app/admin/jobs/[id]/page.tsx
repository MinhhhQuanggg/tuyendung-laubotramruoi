"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyAdminJobRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  useEffect(() => {
    if (id) {
      router.replace(`/admin/viec-lam/${id}`);
    } else {
      router.replace("/admin");
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Đang chuyển hướng sang /admin/viec-lam/{id}...</p>
      </div>
    </div>
  );
}