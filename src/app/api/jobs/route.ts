import { NextResponse } from "next/server";
import { getJobsList } from "@/lib/jobs-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await getJobsList();
    const activeJobs = jobs.filter((j) => j.isActive !== false);
    return NextResponse.json({ success: true, jobs: activeJobs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
