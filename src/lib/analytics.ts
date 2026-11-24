export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Hàm bắn event chung vào Google Analytics
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", action, params);
  }
};

// 1. Theo dõi khi ứng viên xem chi tiết công việc (view_item)
export const trackJobView = (jobTitle: string, jobId?: string) => {
  trackEvent("view_item", {
    content_type: "job",
    item_id: jobId || jobTitle,
    item_name: jobTitle,
  });
};

// 2. Theo dõi khi ứng viên click vào 1 công việc từ danh sách / thẻ (select_item)
export const trackJobClick = (jobTitle: string, jobId?: string) => {
  trackEvent("select_item", {
    item_list_name: "job_list",
    item_id: jobId || jobTitle,
    item_name: jobTitle,
  });
};

// 3. Theo dõi khi bấm nút mở form ứng tuyển (click_apply_button)
export const trackApplyButtonClick = (location: string, jobTitle?: string) => {
  trackEvent("click_apply_button", {
    button_location: location, // 'header' | 'floating_fab' | 'job_card' | 'job_detail'
    job_title: jobTitle || "Chưa chọn",
  });
};

// 4. Theo dõi khi ứng viên click tham gia nhóm Zalo (join_zalo_group)
export const trackZaloJoin = (groupName: string, region?: string) => {
  trackEvent("join_zalo_group", {
    group_name: groupName,
    region: region || "Chung",
  });
};

// 5. Theo dõi nộp hồ sơ thành công (generate_lead)
export const trackApplySuccess = (jobTitle: string, region: string) => {
  trackEvent("generate_lead", {
    position: jobTitle,
    region: region,
  });
};
