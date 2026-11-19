"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { JobItem } from "@/types/job";
import { getCategorySlug, getJobUrl, isJobActiveOnPath } from "@/lib/job-url";

// Thứ tự hiển thị menu con chuẩn (Ưu tiên Giám sát Bếp Chi Nhánh lên đầu)
const ORDERED_SLUGS = [
  "giam-sat-bep",
  "hoc-viec-bep",
  "phu-bep-hoc-nghe",
  "hoc-viec-to-truong",
  "phuc-vu-part-time",
  "cham-soc-khach-hang",
  "phuc-vu-full-time",
  "phu-bep-full-time",
  "thu-ngan",
  "pha-che-full-time",
  "quan-ly-vung",
  "quan-ly-tiem",
  "pho-quan-ly-tiem",
  "bep-truong",
  "to-truong",
];

interface HeaderSubItem {
  title: string;
  href: string;
  slug: string;
  categorySlug?: string;
  id?: string;
}

interface HeaderMenuItem {
  title: string;
  line1: string;
  line2?: string;
  isSingleLine?: boolean;
  hasDropdown: boolean;
  href: string;
  subItems?: HeaderSubItem[];
  slug?: string;
  categorySlug?: string;
}

export default function Header() {
  const pathname = usePathname();
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Hiệu ứng ẩn/hiện menu khi cuộn trang:
  // - Cuộn xuống dưới (lướt màn hình lên): ẩn menu để mở rộng diện tích đọc nội dung
  // - Cuộn ngược lên (lướt màn hình xuống): hiện lại menu ngay lập tức
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      // Luôn hiện khi ở gần đầu trang (bao gồm cả hiện tượng bounce trên iOS)
      if (currentScrollY <= 40) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Tránh trigger khi bounce ở đáy trang trên iOS
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      if (currentScrollY >= maxScrollY - 20) {
        return;
      }

      // Khoảng dịch chuyển tối thiểu (delta) để tránh rung lắc giật lag khi người dùng chạm nhẹ
      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) < 8) {
        return;
      }

      if (diff > 0) {
        // Cuộn xuống (vuốt màn hình lên) -> Ẩn menu & đóng dropdown đang mở
        setIsVisible(false);
        setActiveMobileDropdown(null);
      } else {
        // Cuộn lên (lướt màn hình xuống) -> Hiện menu
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Tải danh sách công việc hiển thị trên Menu
  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {});
  }, []);

  // Điều kiện hiển thị trên menu:
  // 1. Phải đang BẬT tuyển dụng (isActive === true) -> "công việc nào ẩn thì menu của job đó cũng sẽ ẩn theo"
  // 2. Tùy chọn hiển thị menu phải được bật (showInMenu !== false) -> "ô option để thêm vào hiển thị trên menu"
  const isJobVisibleOnMenu = (job: JobItem) => {
    return Boolean(job.isActive) && job.showInMenu !== false;
  };

  // 1. Các job gắn vào Menu cha có sẵn (Dropdown)
  const getSubItemsForCategory = (parentMenuName: string): HeaderSubItem[] => {
    return [...jobs]
      .filter((j) => {
        if (!isJobVisibleOnMenu(j) || (j.menuPlacement || "PARENT") !== "PARENT") {
          return false;
        }
        const assigned = j.parentMenu || j.category;
        if (assigned === parentMenuName) return true;
        if (
          parentMenuName === "Part-time" &&
          (assigned === "Part-time, Thời vụ" || assigned?.toLowerCase().includes("part-time"))
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        const indexA = ORDERED_SLUGS.indexOf(a.slug);
        const indexB = ORDERED_SLUGS.indexOf(b.slug);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      })
      .map((j) => {
        const catSlug = getCategorySlug(j.parentMenu || j.category);
        return {
          title: j.title,
          href: getJobUrl(j),
          slug: j.slug,
          categorySlug: catSlug,
          id: j.id,
        };
      });
  };

  const hocNgheSubItems = getSubItemsForCategory("Học nghề có lương");
  const partTimeSubItems = getSubItemsForCategory("Part-time");
  const fullTimeSubItems = getSubItemsForCategory("Full-time");
  const quanLySubItems = getSubItemsForCategory("Trưởng, Quản lý");

  // 2. Các job hiển thị TRỰC TIẾP ở menu điều hướng (menuPlacement === "DIRECT")
  const directJobs: HeaderMenuItem[] = [...jobs]
    .filter((j) => isJobVisibleOnMenu(j) && j.menuPlacement === "DIRECT")
    .map((j) => {
      const catSlug = getCategorySlug(j.parentMenu || j.category);
      return {
        title: j.title,
        line1: j.title,
        line2: "",
        isSingleLine: true,
        hasDropdown: false,
        href: getJobUrl(j),
        slug: j.slug,
        categorySlug: catSlug,
      };
    });

  // Hàm trợ giúp khởi tạo menu cha:
  // Nếu nhóm chuyên mục này chưa có menu con (hoặc chỉ có bài đăng có tên trùng với menu cha)
  // thì tắt dropdown (hasDropdown = false) để chỉ hiển thị nút bấm menu cha và dẫn link trực tiếp tới bài đăng.
  const createParentMenuItem = (
    title: string,
    rawSubItems: HeaderSubItem[]
  ): HeaderMenuItem => {
    const catSlug = getCategorySlug(title);

    // Lọc menu con thực sự: loại trừ các sub-item có tiêu đề trùng khớp với menu cha
    const cleanParentTitle = title.trim().toLowerCase().replace(/[,.-]/g, "").replace(/\s+/g, "");
    const distinctSubItems = rawSubItems.filter((sub) => {
      const cleanSubTitle = sub.title.trim().toLowerCase().replace(/[,.-]/g, "").replace(/\s+/g, "");
      return cleanSubTitle !== cleanParentTitle;
    });

    // Menu cha chỉ hiển thị dropdown khi thực sự CÓ menu con
    const hasDropdown = distinctSubItems.length > 0;

    // Đường dẫn khi bấm vào menu cha:
    // - Nếu có bài đăng thuộc nhóm này (ví dụ job Part-time), dẫn trực tiếp vào link của job đó
    // - Nếu chưa có bài đăng nào, cuộn xuống danh mục việc làm trên trang chủ
    const href = rawSubItems.length > 0 ? rawSubItems[0].href : "/#danh-sach-viec-lam";
    const slug = rawSubItems.length > 0 ? rawSubItems[0].slug : undefined;

    return {
      title,
      line1: title,
      line2: "",
      isSingleLine: true,
      hasDropdown,
      href,
      categorySlug: catSlug,
      slug,
      subItems: hasDropdown ? distinctSubItems : [],
    };
  };

  const parentMenuItems: HeaderMenuItem[] = [
    createParentMenuItem("Học nghề có lương", hocNgheSubItems),
    createParentMenuItem("Part-time", partTimeSubItems),
    createParentMenuItem("Full-time", fullTimeSubItems),
    createParentMenuItem("Trưởng, Quản lý", quanLySubItems),
  ];

  const chiNhanhMenuItem: HeaderMenuItem = {
    title: "Hệ thống Chi nhánh",
    line1: "Hệ thống Chi nhánh",
    line2: "",
    isSingleLine: true,
    hasDropdown: false,
    href: "#he-thong-chi-nhanh",
  };

  const menuItems: HeaderMenuItem[] = [
    ...parentMenuItems,
    ...directJobs,
    chiNhanhMenuItem,
  ];

  const half = Math.ceil(menuItems.length / 2);
  const menuRow1 = menuItems.slice(0, half);
  const menuRow2 = menuItems.slice(half);

  const activeDropdownItem = menuItems.find(
    (item) => item.title === activeMobileDropdown
  );

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Hàm render item menu cho mobile & tablet (iPad)
  const renderNavTabItem = (item: HeaderMenuItem, key: React.Key, isTablet = false) => {
    const isParentActive = item.subItems?.some((sub) =>
      isJobActiveOnPath(pathname, sub.href, sub.slug, sub.categorySlug)
    );
    const isDirectActive =
      !item.hasDropdown &&
      (isJobActiveOnPath(pathname, item.href, item.slug || "", item.categorySlug) ||
        Boolean(
          item.categorySlug &&
            pathname &&
            (pathname.includes(`/viec-lam/${item.categorySlug}`) ||
              pathname.includes(`/admin/viec-lam/${item.categorySlug}`))
        ));

    const textClass = isTablet
      ? "text-[13px] md:text-[15px]"
      : "text-[12px] min-[390px]:text-[13px] sm:text-[14px]";

    return (
      <div key={key} className="relative shrink-0">
        {item.hasDropdown ? (
          <button
            type="button"
            onClick={() =>
              setActiveMobileDropdown(
                activeMobileDropdown === item.title ? null : item.title
              )
            }
            className={`py-1.5 px-1.5 sm:px-2 flex items-center justify-center gap-1 ${textClass} whitespace-nowrap transition-colors ${
              activeMobileDropdown === item.title || isParentActive
                ? "text-amber-300 font-bold underline decoration-amber-400 decoration-2 underline-offset-4"
                : "text-white/90 hover:text-white font-medium active:text-amber-300"
            }`}
          >
            <span>{item.title}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                activeMobileDropdown === item.title
                  ? "rotate-180 text-amber-300"
                  : "text-amber-300/80"
              }`}
            />
          </button>
        ) : (
          <Link
            href={item.href || "#"}
            onClick={(e) => {
              handleSmoothScroll(e, item.href || "#");
              setActiveMobileDropdown(null);
            }}
            className={`py-1.5 px-1.5 sm:px-2 flex items-center justify-center ${textClass} whitespace-nowrap transition-colors ${
              isDirectActive
                ? "text-amber-300 font-bold underline decoration-amber-400 decoration-2 underline-offset-4"
                : "font-medium text-white/90 hover:text-white active:text-amber-300"
            }`}
          >
            {item.title}
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Header Container: Gradient Option A (Đỏ son + Vàng đồng) */}
      <header
        className={`sticky top-0 z-50 bg-gradient-to-r from-[#3A0910] via-[#6B1414] to-[#3A0910] border-b border-[#C9963F]/25 shadow-lg transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo thương hiệu */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" title="Trang chủ Tuyển Dụng Lẩu Bò Trăm Rưỡi">
              <div className="relative w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] shrink-0 drop-shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                <Image
                  src="/logo.webp"
                  alt="Logo Lẩu Bò Trăm Rưỡi"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[12px] sm:text-[15px] font-bold text-amber-300 tracking-wider uppercase leading-none">
                  TUYỂN DỤNG
                </span>
                <span className="font-extrabold text-[18px] sm:text-[24px] tracking-tight leading-none text-white group-hover:text-amber-300 transition-colors mt-1 whitespace-nowrap">
                  LẨU BÒ TRĂM RƯỠI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Center */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {menuItems.map((item, idx) => {
                const isParentActive = item.subItems?.some((sub) =>
                  isJobActiveOnPath(pathname, sub.href, sub.slug, sub.categorySlug)
                );
                const isDirectActive =
                  !item.hasDropdown &&
                  (isJobActiveOnPath(pathname, item.href, item.slug || "", item.categorySlug) ||
                    Boolean(
                      item.categorySlug &&
                        pathname &&
                        (pathname.includes(`/viec-lam/${item.categorySlug}`) ||
                          pathname.includes(`/admin/viec-lam/${item.categorySlug}`))
                    ));

                return (
                  <div key={idx} className="relative group">
                    {item.hasDropdown ? (
                      <button
                        className={`px-3 xl:px-4 py-2 rounded-xl text-[16px] xl:text-[18px] font-semibold transition-all text-center flex items-center gap-1.5 whitespace-nowrap ${
                          isParentActive
                            ? "bg-red-950/50 text-amber-300 font-bold border border-amber-300/40 shadow-inner"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="whitespace-nowrap">{item.title}</span>
                        <ChevronDown className="w-4 h-4 text-amber-300 transition-transform group-hover:rotate-180 shrink-0" />
                      </button>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        onClick={(e) => handleSmoothScroll(e, item.href || "#")}
                        className={`px-3 xl:px-4 py-2 rounded-xl text-[16px] xl:text-[18px] font-semibold transition-all flex items-center justify-center text-center whitespace-nowrap ${
                          isDirectActive
                            ? "bg-red-950/50 text-amber-300 font-bold border border-amber-300/40 shadow-inner"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="whitespace-nowrap">{item.title}</span>
                      </Link>
                    )}

                    {/* Dropdown Menu Desktop */}
                    {item.hasDropdown && item.subItems && item.subItems.length > 0 && (
                      <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                        <div className="w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-hidden text-gray-800">
                          {item.subItems.map((sub, sIdx) => {
                            const isSelected = isJobActiveOnPath(
                              pathname,
                              sub.href,
                              sub.slug,
                              sub.categorySlug
                            );
                            return (
                              <Link
                                key={sIdx}
                                href={sub.href}
                                className={`px-4 py-3 text-[16px] sm:text-[17px] transition-all flex items-center justify-between border-l-4 ${
                                  isSelected
                                    ? "bg-red-50/90 text-red-700 font-bold border-brand-800 shadow-xs"
                                    : "font-semibold text-gray-700 hover:bg-brand-50/60 hover:text-brand-900 border-transparent"
                                }`}
                              >
                                <span className={isSelected ? "text-red-700 font-bold" : ""}>
                                  {sub.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile & iPad/Tablet Navigation: Trên iPad cả 5 menu nằm cùng 1 hàng duy nhất */}
        <div className="lg:hidden border-t border-white/10 px-2 py-2 sm:py-2.5 min-[390px]:py-3 relative z-20">
          {/* GIAO DIỆN IPAD & TABLET (sm: 640px trở lên đến dưới 1024px): Cả 5 menu nằm cùng 1 hàng duy nhất */}
          <div className="hidden sm:flex items-center justify-center gap-3 md:gap-6 lg:gap-8">
            {menuItems.map((item, idx) => renderNavTabItem(item, `ipad-${idx}`, true))}
          </div>

          {/* GIAO DIỆN ĐIỆN THOẠI (< 640px): 2 dòng tinh gọn (3 mục dòng trên, 2 mục dòng dưới) */}
          <div className="flex sm:hidden flex-col gap-2 min-[390px]:gap-2.5">
            {/* Dòng 1: 3 mục đầu */}
            <div className="flex items-center justify-around">
              {menuRow1.map((item, idx) => renderNavTabItem(item, `m-row1-${idx}`))}
            </div>

            {/* Dòng 2: 2 mục còn lại */}
            <div className="flex items-center justify-center gap-6">
              {menuRow2.map((item, idx) => renderNavTabItem(item, `m-row2-${idx}`))}
            </div>
          </div>

          {/* Floating Dropdown Sub-menu khi người dùng bấm vào các mục có menu con */}
          {activeDropdownItem && activeDropdownItem.subItems && activeDropdownItem.subItems.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setActiveMobileDropdown(null)}
              />
              <div className="absolute left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-80 sm:max-w-md top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-amber-300/40 p-2 overflow-hidden text-gray-800">
                <div className="px-3 py-1.5 mb-1 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-amber-800 uppercase tracking-wider">
                    {activeDropdownItem.title}
                  </span>
                  <button
                    onClick={() => setActiveMobileDropdown(null)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-0.5 max-h-[60vh] overflow-y-auto">
                  {activeDropdownItem.subItems.map((sub, sIdx) => {
                    const isSelected = isJobActiveOnPath(
                      pathname,
                      sub.href,
                      sub.slug,
                      sub.categorySlug
                    );
                    return (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        onClick={() => setActiveMobileDropdown(null)}
                        className={`px-3.5 py-2.5 rounded-xl text-[15px] transition-colors flex items-center justify-between border-l-4 ${
                          isSelected
                            ? "bg-red-50 text-red-700 font-bold border-brand-800"
                            : "font-semibold text-gray-800 hover:bg-brand-50 hover:text-brand-800 active:bg-amber-100/60 border-transparent"
                        }`}
                      >
                        <span className={isSelected ? "text-red-700 font-bold" : ""}>
                          • {sub.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
