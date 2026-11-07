import { Branch } from "@/types/branch";
import { JobItem } from "@/types/job";
import { getBranchesList } from "@/lib/branches-store";
import { getJobsList } from "@/lib/jobs-store";

export async function fetchAllBranches(): Promise<Branch[]> {
  try {
    return await getBranchesList(true);
  } catch (err) {
    console.error("fetchAllBranches exception:", err);
    return [];
  }
}

export async function fetchAllJobs(): Promise<JobItem[]> {
  try {
    const jobs = await getJobsList();
    return jobs.filter((j) => j.isActive);
  } catch (err) {
    console.error("fetchAllJobs exception:", err);
    return [];
  }
}
