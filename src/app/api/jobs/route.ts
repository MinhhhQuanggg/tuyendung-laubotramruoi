import { NextResponse } from "next/server";
import { getJobsList } from "@/lib/jobs-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const jobs = await getJobsList();
    const activeJobs = jobs.filter((j) => j.isActive !== false);
    return NextResponse.json(
      { success: true, jobs: activeJobs },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
