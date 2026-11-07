import { Branch, RegionType } from "@/types/branch";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function getBranchesList(onlyActive = false): Promise<Branch[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    let query = supabase
      .from("branches")
      .select("*")
      .order("cn_number", { ascending: true });

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        cnNumber: b.cn_number,
        name: b.name,
        address: b.address,
        district: b.district,
        city: b.city,
        phone: b.phone || "0981256712",
        region: b.region as RegionType,
        mapUrl: b.map_url || undefined,
        lat: b.lat ?? undefined,
        lng: b.lng ?? undefined,
        isActive: b.is_active ?? true,
      }));
    }
  } catch (err) {
    console.error("Supabase load in getBranchesList failed:", err);
  }

  return [];
}

export async function getBranchById(id: string): Promise<Branch | null> {
  const list = await getBranchesList(false);
  return list.find((b) => b.id === id) || null;
}

export async function upsertBranch(branch: Branch): Promise<Branch> {
  const branchToSave: Branch = {
    ...branch,
    id: branch.id || `cn-${branch.cnNumber.toString().padStart(2, "0")}`,
    city: branch.city || "Hồ Chí Minh",
    phone: branch.phone || "0981256712",
    region: branch.region || "trung-tam",
    isActive: branch.isActive !== undefined ? branch.isActive : true,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const payload = {
          id: branchToSave.id,
          cn_number: branchToSave.cnNumber,
          name: branchToSave.name,
          address: branchToSave.address,
          district: branchToSave.district,
          city: branchToSave.city,
          phone: branchToSave.phone,
          region: branchToSave.region,
          map_url: branchToSave.mapUrl,
          lat: branchToSave.lat,
          lng: branchToSave.lng,
          is_active: branchToSave.isActive,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("branches").upsert(payload);
        if (error) {
          console.error("Supabase upsert branches error:", error.message);
        }
      }
    } catch (err) {
      console.error("Supabase upsert branches exception:", err);
    }
  }

  return branchToSave;
}

export async function deleteBranch(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { error } = await supabase.from("branches").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete branch error:", error.message);
        }
      }
    } catch (err) {
      console.error("Supabase delete branch exception:", err);
    }
  }

  return true;
}
