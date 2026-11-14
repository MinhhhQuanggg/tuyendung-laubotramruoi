import { siteConfig } from "@/config/site";
import { JobItem } from "@/types/job";
import { ALL_BRANCHES } from "@/data/branches";

/**
 * Xây dựng đoạn mô tả công việc phong phú chuẩn HTML cho Google Jobs
 */
function buildJobDescriptionHtml(job: JobItem): string {
  const parts: string[] = [];

  if (job.concisePost?.headline) {
    parts.push(`<h3>${job.concisePost.headline}</h3>`);
  }

  if (job.concisePost?.intro) {
    parts.push(`<p>${job.concisePost.intro.replace(/\n/g, "<br/>")}</p>`);
  }

  if (job.concisePost?.points && job.concisePost.points.length > 0) {
    parts.push("<ul>");
    for (const pt of job.concisePost.points) {
      const label = pt.label ? `<strong>${pt.label}</strong> ` : "";
      parts.push(`<li>${pt.icon} ${label}${pt.content}</li>`);
    }
    parts.push("</ul>");
  }

  if (job.responsibilities && job.responsibilities.length > 0) {
    parts.push("<h4>Trách nhiệm công việc:</h4><ul>");
    for (const r of job.responsibilities) {
      parts.push(`<li>${r}</li>`);
    }
    parts.push("</ul>");
  }

  if (job.requirements && job.requirements.length > 0) {
    parts.push("<h4>Yêu cầu ứng viên:</h4><ul>");
    for (const rq of job.requirements) {
      parts.push(`<li>${rq}</li>`);
    }
    parts.push("</ul>");
  }

  if (job.benefits && job.benefits.length > 0) {
    parts.push("<h4>Quyền lợi & Đãi ngộ:</h4><ul>");
    for (const b of job.benefits) {
      parts.push(`<li>${b}</li>`);
    }
    parts.push("</ul>");
  }

  parts.push(`<p><strong>Mức lương / Thu nhập:</strong> ${job.salaryDisplay}</p>`);
  if (job.workHours || job.workTypeDisplay) {
    parts.push(`<p><strong>Ca làm việc:</strong> ${job.workHours || job.workTypeDisplay}</p>`);
  }
  if (job.locations && job.locations.length > 0) {
    parts.push(`<p><strong>Địa điểm làm việc:</strong> ${job.locations.join(", ")} (TP. Hồ Chí Minh)</p>`);
  }
  parts.push(`<p><strong>Hệ thống:</strong> Tiệm Lẩu Bò Trăm Rưỡi - Tuyển dụng trực tiếp, đào tạo có lương, không thu phí.</p>`);
  parts.push(`<p><strong>Hotline/Zalo tuyển dụng:</strong> ${job.contactZalo || siteConfig.hrContact.phone}</p>`);

  return parts.join("\n");
}

/**
 * Xây dựng danh sách địa điểm chi nhánh chuẩn theo Google Jobs
 */
function buildJobLocations(job: JobItem) {
  const jobDistricts = (job.locations || []).map((l) => l.toLowerCase().trim());

  // Tìm các chi nhánh tại TP.HCM khớp với khu vực tuyển của job
  const matchedBranches = ALL_BRANCHES.filter((b) => {
    if (b.city !== "Hồ Chí Minh") return false;
    if (jobDistricts.length === 0) return true;
    return jobDistricts.some(
      (d) =>
        b.district.toLowerCase().includes(d) ||
        b.address.toLowerCase().includes(d) ||
        d.includes(b.district.toLowerCase())
    );
  });

  const targetBranches = matchedBranches.length > 0
    ? matchedBranches
    : ALL_BRANCHES.filter((b) => b.city === "Hồ Chí Minh");

  const places = targetBranches.map((branch) => ({
    "@type": "Place",
    name: `Tiệm Lẩu Bò Trăm Rưỡi - ${branch.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.district,
      addressRegion: "Hồ Chí Minh",
      addressCountry: "VN",
    },
  }));

  // Nếu chỉ có 1 địa điểm thì trả về object, nếu nhiều thì trả về array theo quy chuẩn Google
  return places.length === 1 ? places[0] : places;
}

export function generateJobPostingSchema(job: JobItem) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: buildJobDescriptionHtml(job),
    identifier: {
      "@type": "PropertyValue",
      name: "Tiệm Lẩu Bò Trăm Rưỡi",
      value: job.id,
    },
    datePosted: job.datePosted || "2026-11-05",
    validThrough: job.validThrough || "2027-12-31T23:59:59+07:00",
    employmentType: job.workType || "FULL_TIME",
    experienceRequirements: job.experienceRequirements || job.experienceDisplay || "Không yêu cầu kinh nghiệm, được đào tạo từ đầu",
    hiringOrganization: {
      "@type": "Organization",
      name: "Tiệm Lẩu Bò Trăm Rưỡi",
      sameAs: "https://laubotramruoi.vn",
      logo: `${siteConfig.url}/logo.png`,
    },
    jobLocation: buildJobLocations(job),
    directApply: true,
  };

  if (job.minSalary && job.maxSalary && job.salaryUnit) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "VND",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.minSalary,
        maxValue: job.maxSalary,
        unitText: job.salaryUnit,
      },
    };
  } else if (job.minSalary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "VND",
      value: {
        "@type": "QuantitativeValue",
        value: job.minSalary,
        unitText: job.salaryUnit || "MONTH",
      },
    };
  }

  return schema;
}

/**
 * Tạo Schema FAQPage cho bài đăng việc làm phục vụ AI Engine & Google Rich Results
 */
export function generateJobFaqSchema(job: JobItem) {
  const locationsStr = (job.locations || []).join(", ") || "Gò Vấp, Thủ Đức, Quận 10, Quận 3, Tân Phú, Bình Tân";

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Mức lương của vị trí ${job.title} tại Lẩu Bò Trăm Rưỡi là bao nhiêu?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Mức thu nhập của vị trí ${job.title} dao động từ ${job.salaryDisplay}, kèm các chế độ bao ăn ca, thưởng chuyên cần và thưởng doanh số theo quy định của hệ thống.`,
        },
      },
      {
        "@type": "Question",
        name: `Ca làm việc của vị trí ${job.title} như thế nào?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Thời gian làm việc: ${job.workHours || job.workTypeDisplay || "Ca linh hoạt theo thỏa thuận hoặc ca full-time chuyên biệt của hệ thống"}.`,
        },
      },
      {
        "@type": "Question",
        name: `Ứng tuyển ${job.title} có yêu cầu kinh nghiệm hay bằng cấp không?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${job.experienceDisplay || job.experienceRequirements || "Không yêu cầu kinh nghiệm"}. Tiệm Lẩu Bò Trăm Rưỡi sẵn sàng đào tạo nghề thực chiến 1-1 từ A-Z và vẫn hưởng đủ lương trong quá trình học việc.`,
        },
      },
      {
        "@type": "Question",
        name: `Làm việc ở đâu? Lẩu Bò Trăm Rưỡi có những chi nhánh nào tại TP.HCM?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Vị trí này tuyển dụng tại các khu vực: ${locationsStr} (TP. Hồ Chí Minh). Hệ thống có hơn 10 chi nhánh rộng khắp Thủ Đức, Gò Vấp, Quận 10, Quận 3, Phú Nhuận, Bình Thạnh... thuận tiện cho ứng viên chọn tiệm gần nhà.`,
        },
      },
      {
        "@type": "Question",
        name: `Cách nộp hồ sơ ứng tuyển ${job.title} nhanh nhất?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Bạn có thể bấm nút "Nộp hồ sơ ngay" trực tiếp trên website hoặc liên hệ Hotline/Zalo tuyển dụng ${job.contactZalo || siteConfig.hrContact.phone} để được xếp lịch phỏng vấn và đi làm ngay.`,
        },
      },
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Tiệm Lẩu Bò Trăm Rưỡi",
    alternateName: siteConfig.subBrand,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    servesCuisine: "Lẩu Bò Triều Châu, Món Việt",
    priceRange: "$$",
    sameAs: [
      "https://laubotramruoi.vn",
      siteConfig.socials.facebookFanpage,
      siteConfig.socials.tiktok,
    ],
  };
}

