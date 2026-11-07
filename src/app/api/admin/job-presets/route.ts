import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getJobPresets, saveJobPresets, JobPresetsConfig } from "@/lib/job-presets-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const presets = await getJobPresets();
    return NextResponse.json({ success: true, presets });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ success: false, error: "Chưa đăng nhập quyền Admin" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<JobPresetsConfig>;
    const updated = await saveJobPresets(body);
    return NextResponse.json({ success: true, presets: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ success: false, error: "Chưa đăng nhập quyền Admin" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Hỗ trợ thao tác xóa hoặc thêm 1 thẻ cụ thể: { type: "age" | "experience" | "workHours", action: "delete" | "add", item: string }
    if (body.type && body.action && body.item) {
      const current = await getJobPresets();
      const itemToHandle = String(body.item).trim();

      let ageTags = [...current.ageTags];
      let experienceTags = [...current.experienceTags];
      let workHoursTags = [...current.workHoursTags];

      if (body.type === "age") {
        if (body.action === "delete") {
          ageTags = ageTags.filter((t) => t !== itemToHandle);
        } else if (body.action === "add" && !ageTags.includes(itemToHandle)) {
          ageTags.push(itemToHandle);
        }
      } else if (body.type === "experience") {
        if (body.action === "delete") {
          experienceTags = experienceTags.filter((t) => t !== itemToHandle);
        } else if (body.action === "add" && !experienceTags.includes(itemToHandle)) {
          experienceTags.push(itemToHandle);
        }
      } else if (body.type === "workHours") {
        if (body.action === "delete") {
          workHoursTags = workHoursTags.filter((t) => t !== itemToHandle);
        } else if (body.action === "add" && !workHoursTags.includes(itemToHandle)) {
          workHoursTags.push(itemToHandle);
        }
      }

      const updated = await saveJobPresets({ ageTags, experienceTags, workHoursTags });
      return NextResponse.json({ success: true, presets: updated });
    }

    // Hoặc lưu trọn bộ mảng
    const updated = await saveJobPresets(body);
    return NextResponse.json({ success: true, presets: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
