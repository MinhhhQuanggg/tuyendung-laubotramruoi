import Image from "next/image";
import { JobItem } from "@/types/job";

interface StickyJobSidebarProps {
  job?: JobItem;
}

export default function StickyJobSidebar({ job }: StickyJobSidebarProps) {
  return (
    <div className="hidden lg:flex w-full items-center justify-center">
      <div className="w-full max-w-[240px] xl:max-w-[260px] p-3.5 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center justify-center">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <Image
            src="/images/logo/logo-brand.webp"
            alt="Tiệm Lẩu Bò Trăm Rưỡi"
            width={897}
            height={877}
            priority
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
