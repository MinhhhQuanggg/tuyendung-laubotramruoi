import Image from "next/image";
import { JobItem } from "@/types/job";

interface StickyJobSidebarProps {
  job?: JobItem;
}

export default function StickyJobSidebar({ job }: StickyJobSidebarProps) {
  return (
    <div className="hidden lg:flex w-full items-center justify-center p-3 bg-white rounded-3xl border border-gray-100 shadow-xs">
      <Image
        src="/images/logo/logo-brand.webp"
        alt="Tiệm Lẩu Bò Trăm Rưỡi"
        width={897}
        height={877}
        priority
        className="w-full h-auto object-contain rounded-2xl"
      />
    </div>
  );
}
