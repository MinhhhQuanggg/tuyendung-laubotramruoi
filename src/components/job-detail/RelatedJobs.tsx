import Link from "next/link";
import { JobItem } from "@/types/job";
import { ArrowRight, MapPin } from "lucide-react";
import { getJobUrl } from "@/lib/job-url";
import { formatCardSalary } from "@/components/home/JobCard";

interface RelatedJobsProps {
  relatedJobs: JobItem[];
}

export default function RelatedJobs({ relatedJobs }: RelatedJobsProps) {
  if (relatedJobs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
        Vị trí tuyển dụng liên quan
      </h3>

      <div className="space-y-4">
        {relatedJobs.map((job) => (
          <div
            key={job.id}
            className="group p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
          >
            <h4 className="font-bold text-[16px] sm:text-[18px] text-gray-900 group-hover:text-brand-800 transition line-clamp-2">
              <Link href={getJobUrl(job)}>{job.title}</Link>
            </h4>

            <div className="mt-2.5 flex items-center justify-between text-[14px] sm:text-[15px] gap-2">
              <span className="inline-block text-[12px] sm:text-[13px] font-bold text-brand-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                {formatCardSalary(job.salaryDisplay) || job.salaryDisplay}
              </span>
              <span className="text-gray-500 flex items-center gap-1 text-xs sm:text-sm shrink-0">
                <MapPin className="w-3.5 h-3.5" />
                {job.locations[0]}
              </span>
            </div>

            <div className="mt-2.5 text-right">
              <Link
                href={getJobUrl(job)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
