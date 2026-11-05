import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getApplicationsList,
  updateApplicationStatus,
  deleteApplication,
} from "@/lib/applications-store";
import { ApplicationStatus } from "@/types/application";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    );
  }

  try {
    const applications = await getApplicationsList();
    return NextResponse.json({ success: true, applications });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: ApplicationStatus };

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID hoặc trạng thái cập nhật" },
        { status: 400 }
      );
    }

    const success = await updateApplicationStatus(id, status);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json(
      { success: false, error: "Chưa đăng nhập quyền Admin" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID ứng viên cần xóa" },
        { status: 400 }
      );
    }

    const success = await deleteApplication(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
