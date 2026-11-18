import Image from "next/image";
import { JobItem } from "@/types/job";

interface StickyJobSidebarProps {
  job?: JobItem;
}

export default function StickyJobSidebar({ job }: StickyJobSidebarProps) {
  return (
    <div className="hidden lg:flex w-full items-center justify-center">
      <Image
        src="/logo.webp"
        alt="Tiệm Lẩu Bò Trăm Rưỡi"
        width={409}
        height={400}
        priority
        className="w-full h-auto object-contain"
      />
    </div>
  );
}
