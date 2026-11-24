import { Branch, BranchGroup, RegionType } from "@/types/branch";

/**
 * Single source of truth cho toàn bộ hệ thống chi nhánh Tiệm Lẩu Bò Trăm Rưỡi.
 * Sắp xếp lại thứ tự chi nhánh từ trái sang phải bắt đầu bằng CN 1:
 * Cột 1 (Quận Đông): CN 1 -> CN 4 (210 Nguyễn Duy Trinh là CN 1)
 * Cột 2 (Quận Trung Tâm 2): CN 5 -> CN 7
 * Cột 3 (Quận Bắc): CN 8 -> CN 11
 * Cột 4 (Quận Trung Tâm & Tây): CN 12 -> CN 15
 */
export const ALL_BRANCHES: Branch[] = [
  // 1. Cột 1: Quận Đông (CN 1 - CN 4)
  {
    id: "cn-01",
    cnNumber: 1,
    name: "210 Nguyễn Duy Trinh",
    address: "210 Nguyễn Duy Trinh, Quận 2",
    district: "Quận 2",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qdong",
    lat: 10.7876,
    lng: 106.7635,
    isActive: true,
  },
  {
    id: "cn-02",
    cnNumber: 2,
    name: "228 Hoàng Diệu 2",
    address: "228 Hoàng Diệu 2, Thủ Đức",
    district: "Thủ Đức",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qdong",
    lat: 10.8524,
    lng: 106.7667,
    isActive: true,
  },
  {
    id: "cn-03",
    cnNumber: 3,
    name: "323 Đỗ Xuân Hợp",
    address: "323 Đỗ Xuân Hợp, Quận 9",
    district: "Quận 9",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qdong",
    lat: 10.8252,
    lng: 106.7725,
    isActive: true,
  },
  {
    id: "cn-04",
    cnNumber: 4,
    name: "245 Võ Thị Sáu",
    address: "245 Võ Thị Sáu, Biên Hòa",
    district: "Biên Hòa",
    city: "Đồng Nai",
    phone: "0981256712",
    region: "bienhoa",
    lat: 10.9525,
    lng: 106.8282,
    isActive: true,
  },

  // 2. Cột 2: Quận Trung Tâm 2 - Tân Bình, Tân Phú, Bình Thạnh, Phú Nhuận (CN 5 - CN 7)
  {
    id: "cn-05",
    cnNumber: 5,
    name: "76 Ung Văn Khiêm",
    address: "76 Ung Văn Khiêm, Bình Thạnh",
    district: "Bình Thạnh",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtt2",
    lat: 10.8062,
    lng: 106.7161,
    isActive: true,
  },
  {
    id: "cn-06",
    cnNumber: 6,
    name: "117 Phan Đình Phùng",
    address: "117 Phan Đình Phùng, Phú Nhuận",
    district: "Phú Nhuận",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtt2",
    lat: 10.7963,
    lng: 106.6828,
    isActive: true,
  },
  {
    id: "cn-07",
    cnNumber: 7,
    name: "3 Nguyễn Sơn",
    address: "3 Nguyễn Sơn, Tân Phú",
    district: "Tân Phú",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtt2",
    lat: 10.7801,
    lng: 106.6315,
    isActive: true,
  },

  // 3. Cột 3: Quận Bắc - Quận 12, Gò Vấp, Hóc Môn (CN 8 - CN 11)
  {
    id: "cn-08",
    cnNumber: 8,
    name: "701 Phan Văn Trị",
    address: "701 Phan Văn Trị, Gò Vấp",
    district: "Gò Vấp",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qbac",
    lat: 10.8286,
    lng: 106.6895,
    isActive: true,
  },
  {
    id: "cn-09",
    cnNumber: 9,
    name: "685 Quang Trung",
    address: "685 Quang Trung, Gò Vấp",
    district: "Gò Vấp",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qbac",
    lat: 10.8385,
    lng: 106.6578,
    isActive: true,
  },
  {
    id: "cn-10",
    cnNumber: 10,
    name: "107 Lê Đức Thọ",
    address: "107 Lê Đức Thọ, Gò Vấp",
    district: "Gò Vấp",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qbac",
    lat: 10.8492,
    lng: 106.6781,
    isActive: true,
  },
  {
    id: "cn-11",
    cnNumber: 11,
    name: "342 Phan Huy Ích",
    address: "342 Phan Huy Ích, Gò Vấp",
    district: "Gò Vấp",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qbac",
    lat: 10.8354,
    lng: 106.6382,
    isActive: true,
  },

  // 4. Cột 4: Quận Trung Tâm (CN 12 - CN 14) & Quận Tây (CN 15)
  {
    id: "cn-12",
    cnNumber: 12,
    name: "2 Đinh Tiên Hoàng",
    address: "2 Đinh Tiên Hoàng, Quận 1",
    district: "Quận 1",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtt",
    lat: 10.7896,
    lng: 106.6997,
    isActive: true,
  },
  {
    id: "cn-13",
    cnNumber: 13,
    name: "516 Cách Mạng Tháng Tám",
    address: "516 Cách Mạng Tháng Tám, Quận 3",
    district: "Quận 3",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtt",
    lat: 10.7831,
    lng: 106.671,
    isActive: true,
  },
  {
    id: "cn-14",
    cnNumber: 14,
    name: "828 Sư Vạn Hạnh",
    address: "828 Sư Vạn Hạnh, Quận 10",
    district: "Quận 10",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtt",
    lat: 10.7761,
    lng: 106.6678,
    isActive: true,
  },
  {
    id: "cn-15",
    cnNumber: 15,
    name: "33 Nguyễn Thị Tú (Vĩnh Lộc)",
    address: "33 Nguyễn Thị Tú, Bình Tân",
    district: "Bình Tân",
    city: "Hồ Chí Minh",
    phone: "0981256712",
    region: "qtay",
    lat: 10.8175,
    lng: 106.5956,
    isActive: true,
  },
];

export interface RegionMeta {
  key: RegionType;
  code: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  districts: string[];
}

/**
 * 6 Cụm Quận chuẩn theo định hướng quản trị F&B của Tiệm Lẩu Bò Trăm Rưỡi:
 * Hàng trên (3 cụm): Quận Đông | Quận Trung Tâm | Quận Trung Tâm 2
 * Hàng dưới (3 cụm): Quận Bắc | Quận Tây | Biên Hòa - Đồng Nai
 */
export const REGION_METADATA: RegionMeta[] = [
  {
    key: "qdong",
    code: "Quận Đông",
    name: "Quận Đông",
    title: "Quận Đông",
    subtitle: "Q2 • Q9 • TP. Thủ Đức",
    description: "Hệ thống tiệm tại Quận 2, Quận 9, TP. Thủ Đức (Ưu tiên Nguyễn Duy Trinh)",
    districts: ["Quận 2", "Quận 9", "Thủ Đức", "TP. Thủ Đức"],
  },
  {
    key: "qtt",
    code: "Quận Trung Tâm",
    name: "Quận Trung Tâm",
    title: "Quận Trung Tâm",
    subtitle: "Q1 • Q3 • Q4 • Q5 • Q10",
    description: "Các chi nhánh trung tâm sôi động tại Quận 1, Quận 3, Quận 10",
    districts: ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 10"],
  },
  {
    key: "qtt2",
    code: "Quận Trung Tâm 2",
    name: "Quận Trung Tâm 2",
    title: "Quận Trung Tâm 2",
    subtitle: "Tân Bình • Tân Phú • Bình Thạnh • Phú Nhuận",
    description: "Chuỗi các tiệm tại Tân Bình, Tân Phú, Bình Thạnh, Phú Nhuận",
    districts: ["Tân Bình", "Tân Phú", "Bình Thạnh", "Phú Nhuận"],
  },
  {
    key: "qbac",
    code: "Quận Bắc",
    name: "Quận Bắc",
    title: "Quận Bắc",
    subtitle: "Q12 • Gò Vấp • Hóc Môn",
    description: "Hệ thống tiệm tại Gò Vấp, Quận 12 và Hóc Môn",
    districts: ["Quận 12", "Gò Vấp", "Hóc Môn"],
  },
  {
    key: "qtay",
    code: "Quận Tây",
    name: "Quận Tây",
    title: "Quận Tây",
    subtitle: "Q6 • Q8 • Bình Tân • Bình Chánh",
    description: "Hệ thống tiệm tại Bình Tân, Bình Chánh, Quận 6, Quận 8",
    districts: ["Quận 6", "Quận 8", "Bình Tân", "Bình Chánh"],
  },
  {
    key: "bienhoa",
    code: "Biên Hòa - Đồng Nai",
    name: "Biên Hòa - Đồng Nai",
    title: "Biên Hòa - Đồng Nai",
    subtitle: "Biên Hòa • Đồng Nai",
    description: "Chi nhánh tại TP. Biên Hòa, tỉnh Đồng Nai",
    districts: ["Biên Hòa", "Đồng Nai"],
  },
];

/**
 * Phân loại chính xác chi nhánh vào 6 cụm quận (hỗ trợ cả dữ liệu cũ lẫn mới)
 */
export function getBranchRegionKey(b: Branch): RegionType {
  const d = (b.district || "").toLowerCase();
  const r = (b.region || "").toLowerCase();

  // Biên Hòa / Đồng Nai
  if (
    r === "bienhoa" ||
    r === "dongnai" ||
    d.includes("biên hòa") ||
    d.includes("đồng nai") ||
    b.city === "Đồng Nai"
  ) {
    return "bienhoa";
  }

  // Quận Đông: Q2, Q9, Thủ Đức
  if (
    r === "qdong" ||
    r === "thu-duc-khu-dong" ||
    d.includes("thủ đức") ||
    d.includes("quận 2") ||
    d.includes("quận 9")
  ) {
    return "qdong";
  }

  // QTT: Q1, Q3, Q4, Q5, Q10
  if (
    r === "qtt" ||
    d.includes("quận 1") ||
    d.includes("quận 3") ||
    d.includes("quận 4") ||
    d.includes("quận 5") ||
    d.includes("quận 10")
  ) {
    return "qtt";
  }

  // QTT2: Tân Bình, Tân Phú, Bình Thạnh, Phú Nhuận
  if (
    r === "qtt2" ||
    d.includes("tân bình") ||
    d.includes("tân phú") ||
    d.includes("bình thạnh") ||
    d.includes("phú nhuận")
  ) {
    return "qtt2";
  }

  // QBắc: Gò Vấp, Quận 12, Hóc Môn
  if (
    r === "qbac" ||
    d.includes("gò vấp") ||
    d.includes("quận 12") ||
    d.includes("hóc môn") ||
    (r === "go-vap-phu-nhuan" && !d.includes("phú nhuận") && !d.includes("bình thạnh"))
  ) {
    return "qbac";
  }

  // QTây: Q6, Q8, Bình Tân, Bình Chánh
  if (
    r === "qtay" ||
    d.includes("quận 6") ||
    d.includes("quận 8") ||
    d.includes("bình tân") ||
    d.includes("bình chánh")
  ) {
    return "qtay";
  }

  // Fallback khu vực Nam/Tây nếu có: Q7, Nhà Bè
  if (
    r === "qnam" ||
    d.includes("quận 7") ||
    d.includes("nhà bè")
  ) {
    return "qtay";
  }

  return "qtt2";
}

/**
 * Danh sách cụm chi nhánh với thứ tự ưu tiên (3 trên, 3 dưới):
 * Hàng 1 (3 trên): Quận Đông | Quận Trung Tâm | Quận Trung Tâm 2
 * Hàng 2 (3 dưới): Quận Bắc | Quận Tây | Biên Hòa - Đồng Nai
 */
export const BRANCH_GROUPS: BranchGroup[] = REGION_METADATA.map((meta) => {
  const branches = ALL_BRANCHES.filter((b) => getBranchRegionKey(b) === meta.key);

  // Sắp xếp chi nhánh trong nhóm theo số thứ tự CN
  branches.sort((a, b) => a.cnNumber - b.cnNumber);

  return {
    region: meta.key,
    title: meta.title,
    subtitle: meta.subtitle,
    description: meta.description,
    branches,
  };
});
