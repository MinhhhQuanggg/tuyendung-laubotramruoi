import Image from "next/image";
import { JobItem } from "@/types/job";

interface StickyJobSidebarProps {
  job?: JobItem;
}

export default function StickyJobSidebar({ job }: StickyJobSidebarProps) {
  return (
    <div className="hidden lg:flex w-full items-center justify-center">
      <Image
        src="/images/logo/logo-brand.webp"
        alt="Tiệm Lẩu Bò Trăm Rưỡi"
        width={897}
        height={877}
        priority
        className="w-full h-auto object-contain"
      />
    </div>
  );
}
