import { JobItem } from "@/types/job";

/**
 * MOCK DATA CHUẨN CỦA HỆ THỐNG TUYỂN DỤNG LẨU BÒ TRĂM RƯỠI
 * Danh sách các vị trí việc làm đang tuyển dụng chính thức:
 * 1. Giám sát Bếp Chi Nhánh
 * 2. Giám đốc bếp
 * 3. Quản lý
 * 4. Quản lý vùng
 * 5. Tổ trưởng
 * 6. Học việc bếp
 * 7. Học việc phó quản lý
 * 8. Phụ bếp
 * 9. Thu ngân
 * 10. Pha chế
 * 11. Tạp vụ, rửa chén
 * 12. Phục vụ bàn
 * 13. Lễ tân, chăm sóc khách hàng
 * 14. Thời vụ 3 buổi
 */
export const MOCK_JOBS_DATA: JobItem[] = [
  // ===========================================================================
  // NHÓM 1: TRƯỞNG, QUẢN LÝ & CHUYÊN MÔN BẾP
  // ===========================================================================
  {
    id: "JOB-GS-BEP",
    slug: "giam-sat-bep",
    title: "Giám sát Bếp Chi Nhánh",
    category: "Trưởng, Quản lý",
    parentMenu: "Trưởng, Quản lý",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "25–35 tuổi, 11–14 triệu/tháng + Thưởng",
    badges: [
      "25–35 tuổi",
      "11 – 14 triệu + Thưởng",
      "Kinh nghiệm từ 3 năm",
      "Quản trị chuỗi bếp",
    ],
    salaryDisplay: "11 - 14 triệu/tháng + Thưởng",
    minSalary: 11000000,
    maxSalary: 14000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú"],
    ageRequirement: "25 – 35 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (14h00 – 01h00)",
    workHours: "14h00 – 01h00",
    experienceDisplay: "Kinh nghiệm từ 3 năm trở lên trong công việc bếp",
    experienceRequirements: "Có kinh nghiệm ít nhất 3 năm trong công việc bếp, có kinh nghiệm đào tạo, dẫn dắt các nhân sự bếp mới",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/giamsatbep1.webp",
      "/images/posters/giamsatbep2.webp",
    ],
    concisePost: {
      headline: "🔥 [CƠ HỘI VÀNG CHO BẠN ĐẦU BẾP ĐAM MÊ THĂNG TIẾN TRONG NGÀNH] 🔥",
      intro: `🔥 [CƠ HỘI VÀNG CHO BẠN ĐẦU BẾP ĐAM MÊ THĂNG TIẾN TRONG NGÀNH] 🔥
🍲 Tiệm Lẩu Bò Trăm Rưỡi đang tìm kiếm và đào tạo những "thủ lĩnh" tương lai cho vị trí: GIÁM SÁT BẾP CHI NHÁNH!
💰 Thu nhập hấp dẫn: 11.000.000đ - 14.000.000đ + Thưởng xứng đáng! 
🚀 ⏰ Thời gian làm việc: 14:00 – 01:00.
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Yêu cầu ứng viên:
🎂 Độ tuổi: Từ 25 - 35 tuổi.
🔪 Có kinh nghiệm ít nhất 3 năm trong công việc bếp.
👥 Có kinh nghiệm đào tạo, dẫn dắt các nhân sự bếp mới.
🎯 Có tinh thần trách nhiệm cao, kỷ luật thép và ham học hỏi.
❤️ Đam mê cháy bỏng và muốn gắn bó, phát triển lâu dài với nghề bếp.

👉 Bạn sẽ được học và làm chủ những gì tại Lẩu Bò Trăm Rưỡi?
📊 Quản trị bếp chuỗi chuyên nghiệp: Kiểm soát COGs (giá vốn), chất lượng & định lượng món ăn, tối ưu tốc độ ra món, kỹ năng đào tạo và tiêu chuẩn Vệ sinh An toàn Thực phẩm (HACCP).
🤖 AI & Data: Trải nghiệm ứng dụng trí tuệ nhân tạo và dữ liệu thực chiến trong quản lý vận hành bếp hiện đại.
🤝 Huấn luyện đội ngũ & Năng lực lãnh đạo: Thấu hiểu tâm lý con người – Hợp tác cùng thắng – Phát huy tối đa tài năng – Làm việc hiệu quả.

👉 Lộ trình thăng tiến rõ ràng, rộng mở: ⭐ Giám Sát Bếp ➡️ Trưởng Bếp Chi Nhánh ➡️ Quản Lý Bếp Vùng ➡️ Trưởng Bộ Phận Bếp Chuỗi.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Quản trị bếp chuỗi chuyên nghiệp: Kiểm soát COGs (giá vốn), chất lượng & định lượng món ăn, tối ưu tốc độ ra món, kỹ năng đào tạo và tiêu chuẩn Vệ sinh An toàn Thực phẩm (HACCP)",
      "Trải nghiệm ứng dụng trí tuệ nhân tạo (AI) và dữ liệu thực chiến trong quản lý vận hành bếp hiện đại",
      "Huấn luyện đội ngũ & Năng lực lãnh đạo: Thấu hiểu tâm lý con người – Hợp tác cùng thắng – Phát huy tối đa tài năng – Làm việc hiệu quả",
    ],
    requirements: [
      "Độ tuổi: Từ 25 - 35 tuổi",
      "Có kinh nghiệm ít nhất 3 năm trong công việc bếp",
      "Có kinh nghiệm đào tạo, dẫn dắt các nhân sự bếp mới",
      "Có tinh thần trách nhiệm cao, kỷ luật thép và ham học hỏi",
      "Đam mê cháy bỏng và muốn gắn bó, phát triển lâu dài với nghề bếp",
    ],
    benefits: [
      "Thu nhập hấp dẫn: 11.000.000đ - 14.000.000đ + Thưởng xứng đáng!",
      "Thời gian làm việc: 14:00 – 01:00",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Được đào tạo bài bản: Quản trị bếp chuỗi chuyên nghiệp, ứng dụng AI & Data thực chiến và phát triển năng lực lãnh đạo",
      "Lộ trình thăng tiến rõ ràng, rộng mở: ⭐ Giám Sát Bếp ➡️ Trưởng Bếp Chi Nhánh ➡️ Quản Lý Bếp Vùng ➡️ Trưởng Bộ Phận Bếp Chuỗi",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "GD-BEP-01",
    slug: "giam-doc-bep",
    title: "Giám đốc bếp",
    category: "Trưởng, Quản lý",
    parentMenu: "Trưởng, Quản lý",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "35–45 tuổi, 25–40 triệu/tháng + Thưởng",
    badges: [
      "35–45 tuổi",
      "25 – 40 triệu + Thưởng",
      "Quản lý từ 10 chi nhánh",
      "Chuyên sâu về Bò",
    ],
    salaryDisplay: "25 - 40 triệu/tháng + Thưởng",
    minSalary: 25000000,
    maxSalary: 40000000,
    salaryUnit: "MONTH",
    locations: ["TP. Hồ Chí Minh", "Toàn hệ thống chuỗi"],
    ageRequirement: "35 – 45 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (14h00 – 24h00)",
    workHours: "14h00 – 24h00",
    experienceDisplay: "Đã quản lý bếp từ 10 chi nhánh & chuyên sâu về bò",
    experienceRequirements: "Kinh nghiệm thực chiến: Đã từng giữ vai trò Bếp Trưởng Điều Hành / Giám Đốc Bếp cho các chuỗi nhà hàng F&B quy mô từ 10 chi nhánh trở lên. Hiểu sâu sắc về thịt bò: Có chuyên môn sâu về phân loại, bảo quản, pha lóc và chế biến thịt bò tươi/nóng.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/giamdocbep1.webp",
    ],
    concisePost: {
      headline: "🔥 [HỆ THỐNG TIỆM LẨU BÒ TRĂM RƯỠI TÌM KIẾM THỦ LĨNH BẾP XUẤT SẮC] 🔥",
      intro: `🔥 [HỆ THỐNG TIỆM LẨU BÒ TRĂM RƯỠI TÌM KIẾM THỦ LĨNH BẾP XUẤT SẮC] 🔥
🌟 VỊ TRÍ TUYỂN DỤNG: GIÁM ĐỐC BẾP (ĐIỀU HÀNH BẾP CHUỖI F&B)
Hệ thống Tiệm Lẩu Bò Trăm Rưỡi đang trên đà phát triển thần tốc với mục tiêu mở rộng mạnh mẽ. Chúng tôi tìm kiếm một Giám Đốc Bếp có Tâm – có Tầm – có Tài để đồng hành xây dựng chuẩn mực ẩm thực đỉnh cao cho toàn hệ thống!

💰 THU NHẬP: 25–40 TRIỆU/THÁNG + THƯỞNG THEO KẾT QUẢ PHÁT TRIỂN HỆ THỐNG
⏰ Thời gian làm việc: 14h00 – 24h00
🎂 Độ tuổi: 35 – 45 tuổi
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

💎 YÊU CẦU ỨNG VIÊN:
🎂 Độ tuổi: 35 – 45 tuổi.
🎯 Kinh nghiệm thực chiến: Đã từng giữ vai trò Bếp Trưởng Điều Hành / Giám Đốc Bếp cho các chuỗi nhà hàng F&B quy mô từ 10 chi nhánh trở lên.
🥩 Hiểu sâu sắc về thịt bò: Có chuyên môn sâu về phân loại, bảo quản, pha lóc và chế biến thịt bò tươi/nóng.
📊 Quản trị số liệu & Chi phí: Nắm vững phương pháp tính định lượng, kiểm soát và tối ưu COGS, hạn chế hao hụt nguyên liệu ở mức tối thiểu.
⚙️ Tư duy quy trình: Có năng lực tự đóng gói quy trình vận hành bếp chuẩn (SOP), dễ hiểu, dễ chuyển giao, dễ nhân bản cho toàn chuỗi.
👥 Năng lực lãnh đạo: Kỹ năng đào tạo, truyền cảm hứng và dẫn dắt đội ngũ nhân sự bếp từ 50–100 người; kỷ luật thép nhưng quản trị bằng sự thấu hiểu.

🎯 BẠN SẼ NẮM GIỮ TRÁCH NHIỆM GÌ?
1️⃣ Quản trị chất lượng món ăn: Đảm bảo hương vị, chất lượng và thẩm mỹ món ăn 100% đồng nhất trên toàn hệ thống 15+ chi nhánh.
2️⃣ Kiểm soát chi phí (COGS): Phối hợp phòng Thu mua và Vận hành để tối ưu giá vốn, kiểm soát hao hụt và tồn kho nguyên liệu hiệu quả.
3️⃣ Chuẩn hóa & Đào tạo: Xây dựng tiêu chuẩn vận hành bếp, trực tiếp huấn luyện đội ngũ Bếp Trưởng Chi Nhánh và Giám Sát Bếp.
4️⃣ Nghiên cứu & Phát triển (R&D): Sáng tạo món ăn mới, nâng cấp menu theo mùa để gia tăng trải nghiệm cho khách hàng.
5️⃣ An toàn thực phẩm: Kiểm soát 100% tiêu chuẩn VSATTP và PCCC tại tất cả các bếp chi nhánh.

🎁 QUYỀN LỢI & ĐÃI NGỘ XỨNG TẦM:
💵 Thu nhập 25.000.000 – 40.000.000 VNĐ/tháng (Lương cứng + Thưởng hiệu quả chuỗi).
🍚 Không bao ăn, Không bao ở
💵 Tiền Tip tự giữ
💸 Cho phép ứng lương
📈 Cơ hội tham gia chính sách cổ phần thưởng / ESOP khi hệ thống đạt các mốc tăng trưởng.
🏢 Môi trường làm việc năng động, tôn trọng năng lực chuyên môn, trao quyền thực chiến tối đa.
🚀 Đồng hành cùng Ban Lãnh Đạo định hình chiến lược phát triển ẩm thực của chuỗi lẩu bò hàng đầu.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Quản trị chất lượng món ăn: Đảm bảo hương vị, chất lượng và thẩm mỹ món ăn 100% đồng nhất trên toàn hệ thống 15+ chi nhánh",
      "Kiểm soát chi phí (COGS): Phối hợp phòng Thu mua và Vận hành để tối ưu giá vốn, kiểm soát hao hụt và tồn kho nguyên liệu hiệu quả",
      "Chuẩn hóa & Đào tạo: Xây dựng tiêu chuẩn vận hành bếp, trực tiếp huấn luyện đội ngũ Bếp Trưởng Chi Nhánh và Giám Sát Bếp",
      "Nghiên cứu & Phát triển (R&D): Sáng tạo món ăn mới, nâng cấp menu theo mùa để gia tăng trải nghiệm cho khách hàng",
      "An toàn thực phẩm: Kiểm soát 100% tiêu chuẩn VSATTP và PCCC tại tất cả các bếp chi nhánh",
    ],
    requirements: [
      "Độ tuổi: 35 – 45 tuổi",
      "Kinh nghiệm thực chiến: Đã từng giữ vai trò Bếp Trưởng Điều Hành / Giám Đốc Bếp cho các chuỗi nhà hàng F&B quy mô từ 10 chi nhánh trở lên",
      "Hiểu sâu sắc về thịt bò: Có chuyên môn sâu về phân loại, bảo quản, pha lóc và chế biến thịt bò tươi/nóng",
      "Quản trị số liệu & Chi phí: Nắm vững phương pháp tính định lượng, kiểm soát và tối ưu COGS, hạn chế hao hụt",
      "Tư duy quy trình: Có năng lực tự đóng gói quy trình vận hành bếp chuẩn (SOP), dễ chuyển giao, nhân bản",
      "Năng lực lãnh đạo: Kỹ năng đào tạo, truyền cảm hứng và dẫn dắt đội ngũ nhân sự bếp từ 50–100 người",
    ],
    benefits: [
      "Thu nhập xứng tầm: 25.000.000 – 40.000.000 VNĐ/tháng (Lương cứng + Thưởng hiệu quả chuỗi)",
      "Thời gian làm việc: 14h00 – 24h00",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Cơ hội tham gia chính sách cổ phần thưởng / ESOP khi hệ thống đạt các mốc tăng trưởng",
      "Môi trường làm việc năng động, tôn trọng năng lực chuyên môn, trao quyền thực chiến tối đa",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "QL-01",
    slug: "quan-ly",
    title: "Quản lý",
    category: "Trưởng, Quản lý",
    parentMenu: "Trưởng, Quản lý",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "24–38 tuổi, 10–18 triệu/tháng + Thưởng 3P",
    badges: [
      "24–38 tuổi",
      "10 – 18 triệu + Thưởng 3P",
      "Kinh nghiệm Quản lý F&B",
      "Lãnh đạo đội ngũ",
    ],
    salaryDisplay: "10 - 18 triệu/tháng + Thưởng 3P",
    minSalary: 10000000,
    maxSalary: 18000000,
    salaryUnit: "MONTH",
    locations: ["Quận 3", "Gò Vấp", "Thủ Đức", "Quận 10", "Tân Phú", "Bình Tân"],
    ageRequirement: "24 – 38 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (Thương lượng)",
    workHours: "Thương lượng",
    experienceDisplay: "Kinh nghiệm F&B / Trợ lý / Quản lý ca",
    experienceRequirements: "Có kinh nghiệm ít nhất 1 năm ở vị trí Quản lý, Trợ lý Quản lý hoặc Quản lý ca trong ngành F&B / Nhà hàng.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/quanly1.webp",
    ],
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG QUẢN LÝ CỬA HÀNG] 🔥",
      intro: `🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG QUẢN LÝ CỬA HÀNG] 🔥
Hệ thống Tiệm Lẩu Bò Trăm Rưỡi tiếp tục mở rộng quy mô và chào đón các nhân tố Quản Lý xuất sắc về dẫn dắt đội ngũ tại các chi nhánh!

💰 Thu nhập hấp dẫn: 10.000.000 – 18.000.000 VNĐ/tháng + Thưởng chuẩn 3P (Theo doanh thu & KPI vận hành).
⏰ Thời gian làm việc: Thương lượng
🎂 Độ tuổi: 24 – 38 tuổi.
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Trách nhiệm chính:
- Điều hành toàn bộ hoạt động thường nhật tại cửa hàng (Sảnh - Thu ngân - Bếp).
- Quản trị chi phí, doanh thu, kiểm soát thất thoát và tối ưu hóa lợi nhuận cửa hàng.
- Huấn luyện, đào tạo, tạo động lực và giữ lửa cho đội ngũ nhân viên chi nhánh.
- Xử lý các tình huống phát sinh và mang lại trải nghiệm ẩm thực trọn vẹn nhất cho thực khách.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Điều hành toàn bộ hoạt động thường nhật tại cửa hàng (Sảnh - Thu ngân - Bếp)",
      "Quản trị chi phí, doanh thu, kiểm soát thất thoát và tối ưu hóa lợi nhuận cửa hàng",
      "Huấn luyện, đào tạo, tạo động lực và giữ lửa cho đội ngũ nhân viên chi nhánh",
      "Xử lý các tình huống phát sinh và mang lại trải nghiệm ẩm thực trọn vẹn nhất cho thực khách",
    ],
    requirements: [
      "Độ tuổi: 24 – 38 tuổi",
      "Có kinh nghiệm ít nhất 1 năm ở vị trí Quản lý, Trợ lý Quản lý hoặc Quản lý ca trong ngành F&B",
      "Kỹ năng giao tiếp, giải quyết tình huống khéo léo và tinh thần trách nhiệm cao",
    ],
    benefits: [
      "Thu nhập: 10.000.000 – 18.000.000 VNĐ/tháng + Thưởng chuẩn 3P",
      "Thời gian làm việc: Thương lượng",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Được trao quyền điều hành và cơ hội thăng tiến lên Quản Lý Vùng",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "QL-VUNG-01",
    slug: "quan-ly-vung",
    title: "Quản lý vùng",
    category: "Trưởng, Quản lý",
    parentMenu: "Trưởng, Quản lý",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "28–40 tuổi, 15–35 triệu/tháng + Thưởng",
    badges: [
      "28–40 tuổi",
      "15 – 35 triệu + Thưởng",
      "Quản lý cụm 3–5 cửa hàng",
      "Chiến lược F&B",
    ],
    salaryDisplay: "15 - 35 triệu/tháng + Thưởng",
    minSalary: 15000000,
    maxSalary: 35000000,
    salaryUnit: "MONTH",
    locations: ["Toàn hệ thống TP.HCM", "Cụm chi nhánh chỉ định"],
    ageRequirement: "28 – 40 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (16h00 – 01h00)",
    workHours: "16h00 – 01h00 (Nghỉ 2 buổi/tháng)",
    experienceDisplay: "Đã từng quản lý cụm 3–5 cửa hàng F&B",
    experienceRequirements: "Có kinh nghiệm thực chiến quản lý cụm từ 3–5 cửa hàng F&B trở lên, nắm chắc quản trị P&L chuỗi.",
    isActive: true,
    contactZalo: "0981256712",
    images: [],
    concisePost: {
      headline: "🔥 [TUYỂN DỤNG QUẢN LÝ VÙNG CHUỖI F&B LẨU BÒ TRĂM RƯỠI] 🔥",
      intro: `🔥 [TUYỂN DỤNG QUẢN LÝ VÙNG CHUỖI F&B LẨU BÒ TRĂM RƯỠI] 🔥
Hệ thống Tiệm Lẩu Bò Trăm Rưỡi mở rộng cụm chi nhánh cần tìm kiếm những thủ lĩnh dày dạn kinh nghiệm thực chiến!

💰 Thu nhập: 15 – 35 củ / tháng + Thưởng khích lệ 🌟
⏰ Thời gian: 16h00 – 01h00 (Nghỉ 2 buổi/tháng linh hoạt)
🎂 Độ tuổi: 28 – 40 tuổi
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Bạn nắm giữ:
- Quản lý vận hành toàn diện cụm 3–5 nhà hàng trong khu vực phân công.
- Đảm bảo các chỉ số P&L, doanh số, chi phí nhân sự và chất lượng phục vụ đồng nhất.
- Đào tạo, phát triển các Quản Lý Cửa Hàng và Tổ Trưởng kế cận.
- Đại diện hệ thống xử lý các vấn đề đối ngoại và cơ quan chức năng khi cần thiết.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Quản lý vận hành toàn diện cụm 3–5 nhà hàng trong khu vực phân công",
      "Đảm bảo các chỉ số P&L, doanh số, chi phí nhân sự và chất lượng phục vụ đồng nhất",
      "Đào tạo, phát triển các Quản Lý Cửa Hàng và Tổ Trưởng kế cận",
      "Đại diện hệ thống xử lý các vấn đề đối ngoại và cơ quan chức năng khi cần thiết",
    ],
    requirements: [
      "Độ tuổi: 28 – 40 tuổi",
      "Có kinh nghiệm quản lý cụm 3–5 nhà hàng F&B từ 2 năm trở lên",
      "Tư duy số liệu, chiến lược kinh doanh và khả năng dẫn dắt đội ngũ mạnh mẽ",
    ],
    benefits: [
      "Thu nhập: 15.000.000 – 35.000.000 VNĐ/tháng + Thưởng kết quả kinh doanh",
      "Thời gian: 16h00 – 01h00 (Nghỉ 2 buổi/tháng)",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Cơ hội gắn bó lâu dài cùng lộ trình cổ phần hóa / ESOP hấp dẫn",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "TT-01",
    slug: "to-truong",
    title: "Tổ trưởng",
    category: "Trưởng, Quản lý",
    parentMenu: "Trưởng, Quản lý",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "20–30 tuổi, 7–8 triệu/tháng + Thưởng",
    badges: [
      "20–30 tuổi",
      "7 – 8 triệu + Thưởng",
      "Học việc từ số 0",
      "Lộ trình lên Quản lý",
    ],
    salaryDisplay: "7 - 8 triệu/tháng + Thưởng khích lệ",
    minSalary: 7000000,
    maxSalary: 8000000,
    salaryUnit: "MONTH",
    locations: ["Quận 3", "Gò Vấp", "Thủ Đức", "Quận 10", "Tân Phú", "Bình Tân"],
    ageRequirement: "20 – 30 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (16h00 – 01h00)",
    workHours: "16h00 – 01h00 (Nghỉ 2 buổi/tháng)",
    experienceDisplay: "Học việc từ số 0 hoặc đã có kinh nghiệm F&B",
    experienceRequirements: "Không yêu cầu bằng cấp cao, ưu tiên bạn có tố chất bao quát, nhanh nhẹn, tinh thần làm chủ công việc.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/totruong1.webp",
      "/images/posters/totruong2.webp",
      "/images/posters/totruong3.webp",
      "/images/posters/totruong4.webp",
    ],
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG TỔ TRƯỞNG CA] 🔥",
      intro: `🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG TỔ TRƯỞNG CA] 🔥
Bạn muốn bước chân vào con đường quản lý chuyên nghiệp trong ngành F&B? Hãy bắt đầu ngay với vị trí Tổ Trưởng tại Lẩu Bò Trăm Rưỡi!

💰 Thu nhập: 7 – 8 củ/tháng + Thưởng khích lệ 🌟
⏰ Thời gian: 16h00 – 01h00 (Nghỉ 2 buổi/tháng)
🎂 Độ tuổi: 20 – 30 tuổi
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Bạn sẽ làm:
- Hỗ trợ Quản Lý điều phối hoạt động ca trực (phân ca, sắp xếp bàn ghế, điều động nhân sự).
- Giám sát chất lượng phục vụ, kiểm tra vệ sinh an toàn và công tác chuẩn bị trước giờ mở bán.
- Hướng dẫn và kèm cặp các bạn nhân viên mới trong ca làm việc.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Hỗ trợ Quản Lý điều phối hoạt động ca trực (phân ca, sắp xếp bàn ghế, điều động nhân sự)",
      "Giám sát chất lượng phục vụ, kiểm tra vệ sinh an toàn và công tác chuẩn bị trước giờ mở bán",
      "Hướng dẫn và kèm cặp các bạn nhân viên mới trong ca làm việc",
    ],
    requirements: [
      "Độ tuổi: 20 – 30 tuổi",
      "Nhanh nhẹn, có trách nhiệm, khả năng bao quát tốt",
      "Được đào tạo từ số 0 nếu chưa có kinh nghiệm",
    ],
    benefits: [
      "Thu nhập: 7.000.000 – 8.000.000 VNĐ/tháng + Thưởng khích lệ",
      "Thời gian: 16h00 – 01h00 (Nghỉ 2 buổi/tháng)",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Được kèm cặp trực tiếp để lên Quản Lý Ca / Phó Quản Lý sau 3–6 tháng",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },

  // ===========================================================================
  // NHÓM 2: HỌC NGHỀ CÓ LƯƠNG
  // ===========================================================================
  {
    id: "HV-BEP-01",
    slug: "hoc-viec-bep",
    title: "Học việc bếp",
    category: "Học nghề có lương",
    parentMenu: "Học nghề có lương",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "18–30 tuổi, 7,5–11 triệu/tháng",
    badges: [
      "18–30 tuổi",
      "7,5 – 11 triệu/tháng",
      "Đào tạo từ số 0",
      "Học nghề miễn phí",
    ],
    salaryDisplay: "7,5 - 11 triệu/tháng",
    minSalary: 7500000,
    maxSalary: 11000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú"],
    ageRequirement: "18 – 30 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (14h00 – 24h00)",
    workHours: "14h00 – 24h00 mỗi ngày",
    experienceDisplay: "Không yêu cầu (Đào tạo thực chiến từ A-Z)",
    experienceRequirements: "Không yêu cầu bằng cấp hay kinh nghiệm, chỉ cần siêng năng, chịu khó và đam mê học nghề bếp.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/hocnghebep.webp",
      "/images/jobs/hoc-viec-bep-1.webp",
      "/images/jobs/hoc-viec-bep-2.webp",
      "/images/jobs/hoc-viec-bep-3.webp",
    ],
    videoUrl: "/videos/jobs/bep-training.mp4",
    concisePost: {
      headline: "🔥 [HỌC NGHỀ BẾP MIỄN PHÍ - VẪN CÓ LƯƠNG ĐỦ TẠI LẨU BÒ TRĂM RƯỠI] 🔥",
      intro: `🔥 [HỌC NGHỀ BẾP MIỄN PHÍ - VẪN CÓ LƯƠNG ĐỦ TẠI LẨU BÒ TRĂM RƯỠI] 🔥
Bạn muốn có một cái nghề vững chắc, thu nhập ổn định và cơ hội thăng tiến rõ ràng nhưng chưa biết bắt đầu từ đâu? Tiệm Lẩu Bò Trăm Rưỡi mở rộng đào tạo học viên bếp!

💰 Thu nhập khởi điểm: 7.500.000 – 11.000.000 VNĐ/tháng ngay trong thời gian học nghề!
✨ Đánh giá tăng lương sau 1 tuần đầu nhiệt tình, cố gắng.
⏰ Ca làm việc cố định: 14h00 – 24h00 mỗi ngày.
🎂 Độ tuổi: 18 – 30 tuổi.
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Bạn sẽ được đào tạo:
- Kỹ năng dùng dao, thớt chuẩn mực, pha lóc và xử lý thịt bò tươi đúng cách.
- Nấu nước lẩu gia truyền đậm đà, chuẩn vị Triều Châu độc quyền.
- Quy trình kiểm soát chất lượng, định lượng món và tiêu chuẩn VSATTP.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Học và thực hành trực tiếp các công việc bếp dưới sự hướng dẫn của Bếp Trưởng",
      "Chuẩn bị nguyên liệu, sơ chế rau củ, thịt bò và các loại gia vị lẩu",
      "Đảm bảo vệ sinh khu vực bếp luôn gọn gàng, ngăn nắp và đạt chuẩn an toàn vệ sinh thực phẩm",
    ],
    requirements: [
      "Độ tuổi: 18 – 30 tuổi",
      "Không yêu cầu kinh nghiệm, được đào tạo từ số 0",
      "Chăm chỉ, chịu khó, có tinh thần cầu tiến và yêu thích nghề bếp",
    ],
    benefits: [
      "Thu nhập: 7.500.000 – 11.000.000 VNĐ/tháng",
      "Thời gian: 14h00 – 24h00",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Học nghề thực chiến miễn phí 100%, có cơ hội lên Phụ Bếp chính và Bếp Trưởng Chi Nhánh",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "HV-PQL-01",
    slug: "hoc-viec-pho-quan-ly",
    title: "Học việc phó quản lý",
    category: "Học nghề có lương",
    parentMenu: "Học nghề có lương",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "20–35 tuổi, 10–14 triệu/tháng + Thưởng",
    badges: [
      "20–35 tuổi",
      "10 – 14 triệu + Thưởng",
      "Đào tạo Quản trị F&B",
      "Lộ trình thăng tiến",
    ],
    salaryDisplay: "10 - 14 triệu/tháng + Thưởng",
    minSalary: 10000000,
    maxSalary: 14000000,
    salaryUnit: "MONTH",
    locations: ["Quận 3", "Gò Vấp", "Thủ Đức", "Quận 10", "Tân Phú", "Bình Tân"],
    ageRequirement: "20 – 35 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (16h00 – 01h00)",
    workHours: "16h00 – 01h00",
    experienceDisplay: "Đã có kinh nghiệm Tổ trưởng, Giám sát hoặc Quản lý ca F&B",
    experienceRequirements: "Có nền tảng làm việc trong ngành F&B, mong muốn được đào tạo bài bản để trở thành Phó Quản Lý / Quản Lý thực thụ.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/HVphoquanly1.webp",
      "/images/posters/HVphoquanly2.webp",
      "/images/posters/HVphoquanly3.webp",
    ],
    concisePost: {
      headline: "🔥 [CHƯƠNG TRÌNH ĐÀO TẠO PHÓ QUẢN LÝ TIỆM LẨU BÒ TRĂM RƯỠI] 🔥",
      intro: `🔥 [CHƯƠNG TRÌNH ĐÀO TẠO PHÓ QUẢN LÝ TIỆM LẨU BÒ TRĂM RƯỠI] 🔥
Cơ hội nâng tầm sự nghiệp quản lý F&B với mức lương hấp dẫn ngay trong thời gian học việc!

💰 Thu nhập: 10 – 14 củ/tháng + Thưởng xứng đáng theo năng lực.
⏰ Thời gian: 16h00 – 01h00
🎂 Độ tuổi: 20 – 35 tuổi
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Lộ trình đào tạo:
- Quản trị vận hành ca: Điều phối nhân sự, xử lý tình huống phát sinh, nâng cao trải nghiệm khách hàng.
- Quản trị số liệu: Báo cáo doanh thu, kiểm soát thất thoát, quản lý kho hàng và hàng tồn.
- Năng lực lãnh đạo: Huấn luyện, truyền cảm hứng và xây dựng văn hóa đội ngũ vững mạnh.`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Tham gia học tập và hỗ trợ Quản Lý vận hành ca làm việc hàng ngày",
      "Theo dõi, kiểm tra tiêu chuẩn chất lượng dịch vụ và quy trình an toàn tại cửa hàng",
      "Thực hiện các báo cáo số liệu vận hành và phối hợp tổ chức đào tạo nhân sự mới",
    ],
    requirements: [
      "Độ tuổi: 20 – 35 tuổi",
      "Có kinh nghiệm F&B (từng làm Tổ Trưởng, Giám Sát Ca hoặc tương đương)",
      "Tư duy tích cực, ham học hỏi và có chí hướng phát triển sự nghiệp lâu dài",
    ],
    benefits: [
      "Thu nhập: 10.000.000 – 14.000.000 VNĐ/tháng + Thưởng",
      "Thời gian: 16h00 – 01h00",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Lộ trình bổ nhiệm chính thức lên Phó Quản Lý Tiệm chỉ sau 1–3 tháng",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },

  // ===========================================================================
  // NHÓM 3: 6 VỊ TRÍ ĐỒNG BỘ THÔNG TIN (PHỤC VỤ, PHỤ BẾP, TIẾP THỰC, CSKH, THU NGÂN, PHA CHẾ)
  // ===========================================================================
  {
    id: "PB-01",
    slug: "phu-bep",
    title: "Phụ bếp",
    category: "Full-time",
    parentMenu: "Full-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "16–25 tuổi, 8–10 triệu/tháng | 27k–35k/1 giờ",
    badges: [
      "16 – 25 tuổi",
      "8 – 10 triệu/tháng",
      "27k – 35k/1 giờ",
      "Đào tạo từ số 0",
    ],
    salaryDisplay: "8 - 10 triệu/tháng | 27k - 35k/1 giờ",
    minSalary: 8000000,
    maxSalary: 10000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú", "Bình Tân"],
    ageRequirement: "16 – 25 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Full-time / Part-time / Thời vụ",
    workHours: "15h00 – 00h00\nhoặc 16h00 – 01h00",
    experienceDisplay: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    experienceRequirements: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/culture/bep-operation.webp",
    ],
    videoUrl: "/videos/jobs/phubep.mp4",
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG PHỤ BẾP] 🔥",
      intro: `🔥 TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG PHỤ BẾP 🔥
👉 THÔNG TIN TUYỂN DỤNG CHÍNH THỨC:
- 16 tuổi - 25 tuổi
- ko yêu cầu kinh nghiệm (đào tạo từ số 0)
- full time/part time/thời vụ
- 15h00 – 00h00 hoặc 16h00 – 01h00
- full time : 8 - 10 triệu/tháng
- part time/thời vụ: 27k - 35k/1 giờ
👉 Chế độ đãi ngộ:
- Không bao ăn, Không bao ở
- Tiền Tip tự giữ
- Cho phép ứng lương`,
      points: [
        {
          icon: "💰",
          label: "Mức thu nhập:",
          content: "Full-time: 8 - 10 triệu/tháng\nPart-time / Thời vụ: 27k - 35k/1 giờ",
        },
        {
          icon: "⏰",
          label: "Thời gian làm việc:",
          content: "15h00 – 00h00 hoặc 16h00 – 01h00 (Hỗ trợ Full-time / Part-time / Thời vụ linh hoạt)",
        },
        {
          icon: "🎂",
          label: "Độ tuổi & Kinh nghiệm:",
          content: "16 tuổi – 25 tuổi\nKhông yêu cầu kinh nghiệm (đào tạo từ số 0)",
        },
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
        {
          icon: "📍",
          label: "Chi nhánh làm việc:",
          content: "Toàn bộ hệ thống 15 chi nhánh Lẩu Bò Trăm Rưỡi tại TP.HCM",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Sơ chế nguyên liệu thịt bò, rau củ theo định lượng và công thức chuẩn",
      "Chuẩn bị nồi lẩu, các đĩa đồ nhúng theo đúng order của khách",
      "Hỗ trợ Bếp Trưởng giữ gìn vệ sinh, gọn gàng khu vực bếp",
    ],
    requirements: [
      "Độ tuổi: 16 tuổi - 25 tuổi",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
      "Hình thức: Full-time / Part-time / Thời vụ",
      "Thời gian làm việc: 15h00 – 00h00 hoặc 16h00 – 01h00",
    ],
    benefits: [
      "Thu nhập: Full-time: 8 - 10 triệu/tháng | Part-time / Thời vụ: 27k - 35k/1 giờ",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "FT-TN-02",
    slug: "thu-ngan",
    title: "Thu ngân",
    category: "Full-time",
    parentMenu: "Full-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "16–25 tuổi, 8–10 triệu/tháng | 27k–35k/1 giờ",
    badges: [
      "16 – 25 tuổi",
      "8 – 10 triệu/tháng",
      "27k – 35k/1 giờ",
      "Đào tạo từ số 0",
    ],
    salaryDisplay: "8 - 10 triệu/tháng | 27k - 35k/1 giờ",
    minSalary: 8000000,
    maxSalary: 10000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú", "Bình Tân"],
    ageRequirement: "16 – 25 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Full-time / Part-time / Thời vụ",
    workHours: "15h00 – 00h00\nhoặc 16h00 – 01h00",
    experienceDisplay: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    experienceRequirements: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/cskh-team-1.webp",
      "/images/culture/phucvu-store-opening.webp",
      "/images/culture/phucvu-team.webp",
      "/images/culture/chu.webp",
    ],
    videoUrl: "/videos/jobs/phucvu.mp4",
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG THU NGÂN] 🔥",
      intro: `🔥 TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG THU NGÂN 🔥
👉 THÔNG TIN TUYỂN DỤNG CHÍNH THỨC:
- 16 tuổi - 25 tuổi
- ko yêu cầu kinh nghiệm (đào tạo từ số 0)
- full time/part time/thời vụ
- 15h00 – 00h00 hoặc 16h00 – 01h00
- full time : 8 - 10 triệu/tháng
- part time/thời vụ: 27k - 35k/1 giờ
👉 Chế độ đãi ngộ:
- Không bao ăn, Không bao ở
- Tiền Tip tự giữ
- Cho phép ứng lương`,
      points: [
        {
          icon: "💰",
          label: "Mức thu nhập:",
          content: "Full-time: 8 - 10 triệu/tháng\nPart-time / Thời vụ: 27k - 35k/1 giờ",
        },
        {
          icon: "⏰",
          label: "Thời gian làm việc:",
          content: "15h00 – 00h00 hoặc 16h00 – 01h00 (Hỗ trợ Full-time / Part-time / Thời vụ linh hoạt)",
        },
        {
          icon: "🎂",
          label: "Độ tuổi & Kinh nghiệm:",
          content: "16 tuổi – 25 tuổi\nKhông yêu cầu kinh nghiệm (đào tạo từ số 0)",
        },
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
        {
          icon: "📍",
          label: "Chi nhánh làm việc:",
          content: "Toàn bộ hệ thống 15 chi nhánh Lẩu Bò Trăm Rưỡi tại TP.HCM",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Thực hiện thanh toán tiền mặt, quẹt thẻ POS và quét mã QR cho khách",
      "In bill chính xác và bàn giao tiền mặt ca trực rõ ràng",
      "Hỗ trợ giải đáp các thắc mắc của khách về hóa đơn và chương trình ưu đãi",
    ],
    requirements: [
      "Độ tuổi: 16 tuổi - 25 tuổi",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
      "Hình thức: Full-time / Part-time / Thời vụ",
      "Thời gian làm việc: 15h00 – 00h00 hoặc 16h00 – 01h00",
    ],
    benefits: [
      "Thu nhập: Full-time: 8 - 10 triệu/tháng | Part-time / Thời vụ: 27k - 35k/1 giờ",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "FT-PC-01",
    slug: "pha-che-full-time",
    title: "Pha chế",
    category: "Full-time",
    parentMenu: "Full-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "16–25 tuổi, 8–10 triệu/tháng | 27k–35k/1 giờ",
    badges: [
      "16 – 25 tuổi",
      "8 – 10 triệu/tháng",
      "27k – 35k/1 giờ",
      "Đào tạo từ số 0",
    ],
    salaryDisplay: "8 - 10 triệu/tháng | 27k - 35k/1 giờ",
    minSalary: 8000000,
    maxSalary: 10000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú", "Bình Tân"],
    ageRequirement: "16 – 25 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Full-time / Part-time / Thời vụ",
    workHours: "15h00 – 00h00\nhoặc 16h00 – 01h00",
    experienceDisplay: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    experienceRequirements: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    isActive: true,
    contactZalo: "0981256712",
    images: [],
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG PHA CHẾ] 🔥",
      intro: `🔥 TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG PHA CHẾ 🔥
👉 THÔNG TIN TUYỂN DỤNG CHÍNH THỨC:
- 16 tuổi - 25 tuổi
- ko yêu cầu kinh nghiệm (đào tạo từ số 0)
- full time/part time/thời vụ
- 15h00 – 00h00 hoặc 16h00 – 01h00
- full time : 8 - 10 triệu/tháng
- part time/thời vụ: 27k - 35k/1 giờ
👉 Chế độ đãi ngộ:
- Không bao ăn, Không bao ở
- Tiền Tip tự giữ
- Cho phép ứng lương`,
      points: [
        {
          icon: "💰",
          label: "Mức thu nhập:",
          content: "Full-time: 8 - 10 triệu/tháng\nPart-time / Thời vụ: 27k - 35k/1 giờ",
        },
        {
          icon: "⏰",
          label: "Thời gian làm việc:",
          content: "15h00 – 00h00 hoặc 16h00 – 01h00 (Hỗ trợ Full-time / Part-time / Thời vụ linh hoạt)",
        },
        {
          icon: "🎂",
          label: "Độ tuổi & Kinh nghiệm:",
          content: "16 tuổi – 25 tuổi\nKhông yêu cầu kinh nghiệm (đào tạo từ số 0)",
        },
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
        {
          icon: "📍",
          label: "Chi nhánh làm việc:",
          content: "Toàn bộ hệ thống 15 chi nhánh Lẩu Bò Trăm Rưỡi tại TP.HCM",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Pha chế đồ uống, trà, nước giải khát theo đúng công thức độc quyền của tiệm",
      "Quản lý nguyên vật liệu quầy bar và bảo quản đồ uống sạch sẽ, an toàn",
      "Phối hợp cùng nhân viên tiếp thực để ra đồ nhanh chóng",
    ],
    requirements: [
      "Độ tuổi: 16 tuổi - 25 tuổi",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
      "Hình thức: Full-time / Part-time / Thời vụ",
      "Thời gian làm việc: 15h00 – 00h00 hoặc 16h00 – 01h00",
    ],
    benefits: [
      "Thu nhập: Full-time: 8 - 10 triệu/tháng | Part-time / Thời vụ: 27k - 35k/1 giờ",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "PV-BAN-01",
    slug: "phuc-vu-ban",
    title: "Phục vụ bàn",
    category: "Part-time",
    parentMenu: "Part-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "16–25 tuổi, 8–10 triệu/tháng | 27k–35k/1 giờ",
    badges: [
      "16 – 25 tuổi",
      "8 – 10 triệu/tháng",
      "27k – 35k/1 giờ",
      "Đào tạo từ số 0",
    ],
    salaryDisplay: "8 - 10 triệu/tháng | 27k - 35k/1 giờ",
    minSalary: 8000000,
    maxSalary: 10000000,
    salaryUnit: "MONTH",
    locations: ["Quận 3 (CMT8)", "Quận 9 (Đỗ Xuân Hợp)", "Gò Vấp (Quang Trung)", "Thủ Đức", "Tân Phú", "Bình Tân"],
    ageRequirement: "16 – 25 tuổi",
    workType: "PART_TIME",
    workTypeDisplay: "Full-time / Part-time / Thời vụ",
    workHours: "15h00 – 00h00\nhoặc 16h00 – 01h00",
    experienceDisplay: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    experienceRequirements: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/phucvuban1.webp",
      "/images/posters/phucvuban2.webp",
      "/images/posters/phucvuban3.webp",
    ],
    videoUrl: "/videos/jobs/phucvu.mp4",
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG PHỤC VỤ BÀN] 🔥",
      intro: `🔥 TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG PHỤC VỤ BÀN 🔥
👉 THÔNG TIN TUYỂN DỤNG CHÍNH THỨC:
- 16 tuổi - 25 tuổi
- ko yêu cầu kinh nghiệm (đào tạo từ số 0)
- full time/part time/thời vụ
- 15h00 – 00h00 hoặc 16h00 – 01h00
- full time : 8 - 10 triệu/tháng
- part time/thời vụ: 27k - 35k/1 giờ
👉 Chế độ đãi ngộ:
- Không bao ăn, Không bao ở
- Tiền Tip tự giữ
- Cho phép ứng lương`,
      points: [
        {
          icon: "💰",
          label: "Mức thu nhập:",
          content: "Full-time: 8 - 10 triệu/tháng\nPart-time / Thời vụ: 27k - 35k/1 giờ",
        },
        {
          icon: "⏰",
          label: "Thời gian làm việc:",
          content: "15h00 – 00h00 hoặc 16h00 – 01h00 (Hỗ trợ Full-time / Part-time / Thời vụ linh hoạt)",
        },
        {
          icon: "🎂",
          label: "Độ tuổi & Kinh nghiệm:",
          content: "16 tuổi – 25 tuổi\nKhông yêu cầu kinh nghiệm (đào tạo từ số 0)",
        },
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
        {
          icon: "📍",
          label: "Chi nhánh làm việc:",
          content: "Toàn bộ hệ thống 15 chi nhánh Lẩu Bò Trăm Rưỡi tại TP.HCM",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Đón tiếp khách hàng, giới thiệu món và lấy order món ăn chu đáo",
      "Phục vụ món ăn lên bàn cho khách, châm nước lẩu và hỗ trợ thực khách trong bữa ăn",
      "Dọn dẹp bàn ăn sau khi khách dùng xong, giữ gìn không gian bàn ăn luôn sạch đẹp",
    ],
    requirements: [
      "Độ tuổi: 16 tuổi - 25 tuổi",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
      "Hình thức: Full-time / Part-time / Thời vụ",
      "Thời gian làm việc: 15h00 – 00h00 hoặc 16h00 – 01h00",
    ],
    benefits: [
      "Thu nhập: Full-time: 8 - 10 triệu/tháng | Part-time / Thời vụ: 27k - 35k/1 giờ",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "CSKH-01",
    slug: "cham-soc-khach-hang",
    title: "Lễ tân, chăm sóc khách hàng",
    category: "Full-time",
    parentMenu: "Full-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "16–25 tuổi, 8–10 triệu/tháng | 27k–35k/1 giờ",
    badges: [
      "16 – 25 tuổi",
      "8 – 10 triệu/tháng",
      "27k – 35k/1 giờ",
      "Đào tạo từ số 0",
    ],
    salaryDisplay: "8 - 10 triệu/tháng | 27k - 35k/1 giờ",
    minSalary: 8000000,
    maxSalary: 10000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú", "Bình Tân"],
    ageRequirement: "16 – 25 tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Full-time / Part-time / Thời vụ",
    workHours: "15h00 – 00h00\nhoặc 16h00 – 01h00",
    experienceDisplay: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    experienceRequirements: "Không yêu cầu kinh nghiệm (Đào tạo từ số 0)",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/cskh1.webp",
      "/images/posters/cskh2.webp",
    ],
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG LỄ TÂN, CHĂM SÓC KHÁCH HÀNG] 🔥",
      intro: `🔥 TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG LỄ TÂN, CHĂM SÓC KHÁCH HÀNG 🔥
👉 THÔNG TIN TUYỂN DỤNG CHÍNH THỨC:
- 16 tuổi - 25 tuổi
- ko yêu cầu kinh nghiệm (đào tạo từ số 0)
- full time/part time/thời vụ
- 15h00 – 00h00 hoặc 16h00 – 01h00
- full time : 8 - 10 triệu/tháng
- part time/thời vụ: 27k - 35k/1 giờ
👉 Chế độ đãi ngộ:
- Không bao ăn, Không bao ở
- Tiền Tip tự giữ
- Cho phép ứng lương`,
      points: [
        {
          icon: "💰",
          label: "Mức thu nhập:",
          content: "Full-time: 8 - 10 triệu/tháng\nPart-time / Thời vụ: 27k - 35k/1 giờ",
        },
        {
          icon: "⏰",
          label: "Thời gian làm việc:",
          content: "15h00 – 00h00 hoặc 16h00 – 01h00 (Hỗ trợ Full-time / Part-time / Thời vụ linh hoạt)",
        },
        {
          icon: "🎂",
          label: "Độ tuổi & Kinh nghiệm:",
          content: "16 tuổi – 25 tuổi\nKhông yêu cầu kinh nghiệm (đào tạo từ số 0)",
        },
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
        {
          icon: "📍",
          label: "Chi nhánh làm việc:",
          content: "Toàn bộ hệ thống 15 chi nhánh Lẩu Bò Trăm Rưỡi tại TP.HCM",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Đón tiếp thực khách ngay cửa với nụ cười thân thiện, tươi tắn",
      "Hướng dẫn khách vào bàn ngồi ưng ý, sắp xếp chỗ ngồi hợp lý giờ cao điểm",
      "Lắng nghe và ghi nhận các góp ý, phản hồi của thực khách để cải thiện dịch vụ",
    ],
    requirements: [
      "Độ tuổi: 16 tuổi - 25 tuổi",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
      "Hình thức: Full-time / Part-time / Thời vụ",
      "Thời gian làm việc: 15h00 – 00h00 hoặc 16h00 – 01h00",
    ],
    benefits: [
      "Thu nhập: Full-time: 8 - 10 triệu/tháng | Part-time / Thời vụ: 27k - 35k/1 giờ",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },

  // ===========================================================================
  // NHÓM 4: CÁC VỊ TRÍ KHÁC (TẠP VỤ RỬA CHÉN & THỜI VỤ)
  // ===========================================================================
  {
    id: "FT-TVRC-01",
    slug: "tap-vu-rua-chen",
    title: "Tạp vụ, rửa chén",
    category: "Full-time",
    parentMenu: "Full-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "Ca ngày 09h00–18h00, Khởi điểm 8 triệu/tháng",
    badges: [
      "Ca ngày 09h00 – 18h00",
      "Khởi điểm 8 triệu/tháng",
      "Nghỉ 2 buổi/tháng",
      "Định kỳ 3 tháng tăng đãi ngộ",
    ],
    salaryDisplay: "8 triệu/tháng",
    minSalary: 8000000,
    maxSalary: 8000000,
    salaryUnit: "MONTH",
    locations: ["Gò Vấp", "Thủ Đức", "Quận 10", "Quận 3", "Tân Phú", "Bình Tân"],
    ageRequirement: "Không giới hạn độ tuổi",
    workType: "FULL_TIME",
    workTypeDisplay: "Toàn thời gian (09h00 – 18h00)",
    workHours: "09h00 – 18h00 (Nghỉ trưa 1 tiếng thoải mái)",
    experienceDisplay: "Không yêu cầu kinh nghiệm",
    experienceRequirements: "Không yêu cầu bằng cấp hay kinh nghiệm, chỉ cần chăm chỉ, trung thực và có trách nhiệm với công việc.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/ruachen1.webp",
    ],
    concisePost: {
      headline: "🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG TẠP VỤ, RỬA CHÉN] 🔥",
      intro: `🔥 [TIỆM LẨU BÒ TRĂM RƯỠI TUYỂN DỤNG TẠP VỤ, RỬA CHÉN] 🔥
Hệ thống Tiệm Lẩu Bò Trăm Rưỡi tuyển dụng nhân sự Tạp vụ, Rửa chén ca ngày với công việc ổn định, gắn bó lâu dài.

💰 Mức lương khởi điểm: 8.000.000 VNĐ/tháng.
⏰ Giờ làm việc: 09h00 – 18h00 (Được nghỉ trưa 1 tiếng thoải mái).
📅 Nghỉ 2 buổi/tháng. Định kỳ 3 tháng xét tăng đãi ngộ.
🎂 Không giới hạn độ tuổi.
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương`,
      points: [
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Vệ sinh chén dĩa, nồi lẩu, dụng cụ bếp sạch sẽ theo quy trình máy và bồn rửa",
      "Giữ gìn vệ sinh khu vực bếp và khuôn viên quán ngăn nắp",
      "Phân loại rác thải và dọn dẹp cuối ca",
    ],
    requirements: [
      "Không giới hạn độ tuổi",
      "Không yêu cầu kinh nghiệm",
      "Chăm chỉ, thật thà, có sức khỏe tốt",
    ],
    benefits: [
      "Thu nhập: 8.000.000 VNĐ/tháng",
      "Thời gian: 09h00 – 18h00 (Nghỉ trưa 1 tiếng, nghỉ 2 buổi/tháng)",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Định kỳ 3 tháng xét tăng đãi ngộ",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
  {
    id: "TV-3B-01",
    slug: "thoi-vu-3-buoi",
    title: "Thời vụ 3 buổi",
    category: "Part-time, Thời vụ",
    parentMenu: "Part-time",
    menuPlacement: "PARENT",
    showInMenu: true,
    badge: "16–25 tuổi, 27k–35k/1 giờ",
    badges: [
      "16 – 25 tuổi",
      "27k – 35k/1 giờ",
      "Đào tạo từ số 0",
      "Nhận lương tuần",
    ],
    salaryDisplay: "27k - 35k/1 giờ",
    minSalary: 27000,
    maxSalary: 35000,
    salaryUnit: "HOUR",
    locations: ["Toàn hệ thống TP.HCM", "Gò Vấp", "Thủ Đức", "Quận 10", "Tân Phú", "Bình Tân"],
    ageRequirement: "16 – 25 tuổi",
    workType: "TEMPORARY",
    workTypeDisplay: "Thời vụ (17h00 – 24h00, tối thiểu 3 buổi/tuần)",
    workHours: "17h00 – 24h00 (Đăng ký lịch rảnh từ 3 buổi/tuần)",
    experienceDisplay: "Không yêu cầu (Đào tạo từ số 0)",
    experienceRequirements: "Không yêu cầu kinh nghiệm, đào tạo thực chiến 30 phút là bắt nhịp làm được ngay.",
    isActive: true,
    contactZalo: "0981256712",
    images: [
      "/images/posters/thoivu3buoi1.webp",
    ],
    concisePost: {
      headline: "🔥 [VIỆC LÀM THỜI VỤ SIÊU LINH ĐỘNG TẠI TIỆM LẨU BÒ TRĂM RƯỠI] 🔥",
      intro: `🔥 [VIỆC LÀM THỜI VỤ SIÊU LINH ĐỘNG TẠI TIỆM LẨU BÒ TRĂM RƯỠI] 🔥
Bạn cần tìm công việc kiếm thêm thu nhập ngắn hạn, lịch làm linh hoạt, nhận lương tuần? Đăng ký ngay thời vụ tại Lẩu Bò Trăm Rưỡi!

💰 Mức lương hấp dẫn: 27k - 35k/1 giờ (Nhận lương tuần).
⏰ Thời gian: 17h00 – 24h00 (Đăng ký lịch rảnh từ 3 buổi/tuần).
🎂 Độ tuổi: 16 – 25 tuổi.
👉 Chế độ đãi ngộ: Không bao ăn, Không bao ở | Tiền Tip tự giữ | Cho phép ứng lương

👉 Công việc:
- Hỗ trợ các công việc đơn giản như dọn bàn, tiếp thực, phục vụ thực khách tại quán.
- Đào tạo 30 phút là làm được ngay, môi trường trẻ trung, thân thiện.`,
      points: [
        {
          icon: "💰",
          label: "Mức thu nhập:",
          content: "27k - 35k/1 giờ (Nhận lương tuần)",
        },
        {
          icon: "⏰",
          label: "Thời gian làm việc:",
          content: "17h00 – 24h00 (Đăng ký lịch rảnh từ 3 buổi/tuần)",
        },
        {
          icon: "🎂",
          label: "Độ tuổi & Kinh nghiệm:",
          content: "16 – 25 tuổi. Không yêu cầu kinh nghiệm (đào tạo từ số 0)",
        },
        {
          icon: "🍚",
          label: "Chế độ ăn ở:",
          content: "Không bao ăn, Không bao ở",
        },
        {
          icon: "💵",
          label: "Tiền Tip:",
          content: "Tiền Tip tự giữ",
        },
        {
          icon: "💸",
          label: "Ứng lương:",
          content: "Cho phép ứng lương",
        },
      ],
      zalo: "0981256712",
    },
    responsibilities: [
      "Hỗ trợ các công việc đơn giản như dọn bàn, tiếp thực, phục vụ thực khách tại quán",
      "Tiếp ứng hỗ trợ đội ngũ chi nhánh trong các khung giờ cao điểm",
    ],
    requirements: [
      "Độ tuổi: 16 – 25 tuổi",
      "Không yêu cầu kinh nghiệm (đào tạo 30 phút là làm được ngay)",
      "Đăng ký lịch làm từ 3 buổi/tuần",
    ],
    benefits: [
      "Thu nhập: 27k - 35k/1 giờ (Nhận lương tuần)",
      "Thời gian: 17h00 – 24h00 (Linh động từ 3 buổi/tuần)",
      "Không bao ăn, Không bao ở",
      "Tiền Tip tự giữ",
      "Cho phép ứng lương",
      "Môi trường năng động, vui vẻ, thân thiện",
    ],
    datePosted: "2026-11-23T08:00:00.000Z",
    validThrough: "2027-12-31T23:59:59.000Z",
    isUrgent: true,
  },
];
