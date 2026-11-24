export interface ZaloGroupInfo {
  id: string;
  regionKey: string;
  groupName: string;
  shortName: string;
  subtitle: string;
  zaloUrl: string;
  description: string;
  districts: string[];
}

/**
 * 6 Nhóm Zalo Tuyển Dụng tương ứng với 6 đường link trong join.txt
 * Phân bổ chuẩn xác theo 6 Cụm Khu Vực / Quận của Chuỗi Nhà Hàng Lẩu Bò Trăm Rưỡi
 */
export const ZALO_REGION_GROUPS: ZaloGroupInfo[] = [
  {
    id: "qdong",
    regionKey: "qdong",
    groupName: "Nhóm Tuyển Dụng: Cụm Quận Đông",
    shortName: "Cụm Quận Đông",
    subtitle: "TP. Thủ Đức • Quận 2 • Quận 9",
    zaloUrl: "https://zalo.me/g/phrr2ssfg0qmnrlx5t97",
    description: "Dành cho ứng viên tại TP. Thủ Đức, Quận 2 (Nguyễn Duy Trinh), Quận 9 (Đỗ Xuân Hợp)",
    districts: [
      "quận 2",
      "quận 9",
      "thủ đức",
      "tp. thủ đức",
      "nguyễn duy trinh",
      "hoàng diệu 2",
      "đỗ xuân hợp",
      "lê văn việt",
    ],
  },
  {
    id: "qtt",
    regionKey: "qtt",
    groupName: "Nhóm Tuyển Dụng: Cụm Quận Trung Tâm",
    shortName: "Cụm Quận Trung Tâm",
    subtitle: "Quận 1 • Quận 3 • Quận 4 • Quận 5 • Quận 10",
    zaloUrl: "https://zalo.me/g/wpe1e4e3a5d76je7rdrb",
    description: "Dành cho ứng viên tại Quận 1 (Đinh Tiên Hoàng), Quận 3 (CMT8), Quận 10 (Sư Vạn Hạnh), Quận 4, Quận 5",
    districts: [
      "quận 1",
      "quận 3",
      "quận 4",
      "quận 5",
      "quận 10",
      "đinh tiên hoàng",
      "cách mạng tháng 8",
      "cmt8",
      "sư vạn hạnh",
    ],
  },
  {
    id: "qtt2",
    regionKey: "qtt2",
    groupName: "Nhóm Tuyển Dụng: Cụm Quận Trung Tâm 2",
    shortName: "Cụm Quận Trung Tâm 2",
    subtitle: "Tân Bình • Tân Phú • Bình Thạnh • Phú Nhuận",
    zaloUrl: "https://zalo.me/g/6rwajxhwano0tnymhs1v",
    description: "Dành cho ứng viên tại Tân Bình, Tân Phú (Lũy Bán Bích), Bình Thạnh (Bạch Đằng), Phú Nhuận",
    districts: [
      "tân bình",
      "tân phú",
      "bình thạnh",
      "phú nhuận",
      "lũy bán bích",
      "thoại ngọc hầu",
      "bạch đằng",
      "phan xích long",
    ],
  },
  {
    id: "qbac",
    regionKey: "qbac",
    groupName: "Nhóm Tuyển Dụng: Cụm Quận Bắc",
    shortName: "Cụm Quận Bắc",
    subtitle: "Gò Vấp • Quận 12 • Hóc Môn",
    zaloUrl: "https://zalo.me/g/ryblpoeqwsr72ogqcpou",
    description: "Dành cho ứng viên tại Gò Vấp (Phan Văn Trị, Quang Trung, Lê Đức Thọ), Quận 12, Hóc Môn",
    districts: [
      "gò vấp",
      "quận 12",
      "hóc môn",
      "phan văn trị",
      "quang trung",
      "lê đức thọ",
      "nguyễn ảnh thủ",
      "tô ký",
    ],
  },
  {
    id: "qtay",
    regionKey: "qtay",
    groupName: "Nhóm Tuyển Dụng: Cụm Quận Tây",
    shortName: "Cụm Quận Tây",
    subtitle: "Quận 6 • Quận 8 • Bình Tân • Bình Chánh",
    zaloUrl: "https://zalo.me/g/g8ea26c1bzttrjanjlhf",
    description: "Dành cho ứng viên tại Quận 6, Quận 8, Bình Tân (Tên Lửa, Kinh Dương Vương, Mã Lò), Bình Chánh",
    districts: [
      "quận 6",
      "quận 8",
      "bình tân",
      "bình chánh",
      "quận 7",
      "tên lửa",
      "kinh dương vương",
      "mã lò",
      "hậu giang",
    ],
  },
  {
    id: "bienhoa",
    regionKey: "bienhoa",
    groupName: "Nhóm Tuyển Dụng: Cụm Biên Hòa - Đồng Nai",
    shortName: "Cụm Biên Hòa - Đồng Nai",
    subtitle: "TP. Biên Hòa • Đồng Nai",
    zaloUrl: "https://zalo.me/g/schdycjgarxoh7fxjacu",
    description: "Dành cho ứng viên tại TP. Biên Hòa, Tỉnh Đồng Nai (Võ Thị Sáu, Đồng Khởi)",
    districts: [
      "biên hòa",
      "đồng nai",
      "võ thị sáu",
      "đồng khởi",
      "phạm văn thuận",
    ],
  },
];

export const ZALO_GROUPS = ZALO_REGION_GROUPS;

/**
 * Tự động tìm nhóm Zalo phù hợp nhất theo Chi nhánh, Khu vực hoặc Quận của ứng viên
 */
export function getZaloGroupByRegion(
  regionOrBranchText?: string | null
): ZaloGroupInfo {
  const text = (regionOrBranchText || "").trim().toLowerCase();

  if (!text) {
    return ZALO_REGION_GROUPS[0]; // Mặc định Cụm Quận Đông (Nguyễn Duy Trinh, Thủ Đức)
  }

  // 1. Khớp theo mã định danh key
  const matchByKey = ZALO_REGION_GROUPS.find(
    (g) => g.regionKey === text || g.id === text
  );
  if (matchByKey) return matchByKey;

  // 2. Khớp theo cụm Biên Hòa / Đồng Nai
  if (text.includes("biên hòa") || text.includes("đồng nai")) {
    return ZALO_REGION_GROUPS[5];
  }

  // 3. Khớp theo từng từ khóa quận/địa bàn của từng nhóm
  for (const group of ZALO_REGION_GROUPS) {
    if (group.districts.some((district) => text.includes(district))) {
      return group;
    }
  }

  // 4. Nếu là số CN (ví dụ: CN 1, CN 2...)
  const cnMatch = text.match(/\bcn\s*(\d+)\b/i);
  if (cnMatch) {
    const num = parseInt(cnMatch[1], 10);
    if ([1, 2, 3, 4].includes(num)) return ZALO_REGION_GROUPS[0]; // Cụm Đông (CN 1-4)
    if ([5, 6, 7].includes(num)) return ZALO_REGION_GROUPS[1]; // Cụm TT (CN 5-7)
    if ([8, 9, 10, 11].includes(num)) return ZALO_REGION_GROUPS[3]; // Cụm Bắc (CN 8-11)
    if ([12, 13, 14].includes(num)) return ZALO_REGION_GROUPS[4]; // Cụm Tây / TT2
    if (num === 15) return ZALO_REGION_GROUPS[5]; // Biên Hòa
  }

  // Mặc định: Trả về Cụm Quận Đông
  return ZALO_REGION_GROUPS[0];
}

/**
 * Hỗ trợ tra cứu theo vị trí công việc hoặc danh sách địa bàn của job
 */
export function getZaloGroupByJob(
  jobIdentifier?: string | null,
  jobTitle?: string | null,
  locations?: string[]
): ZaloGroupInfo {
  // Nếu công việc có mảng địa điểm locations
  if (locations && locations.length > 0) {
    for (const loc of locations) {
      const found = getZaloGroupByRegion(loc);
      if (found) return found;
    }
  }

  // Nếu jobIdentifier hoặc jobTitle có chứa tên quận/khu vực
  const combined = `${jobIdentifier || ""} ${jobTitle || ""}`;
  return getZaloGroupByRegion(combined);
}
