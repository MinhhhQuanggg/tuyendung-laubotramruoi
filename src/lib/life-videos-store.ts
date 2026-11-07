import { LifeVideo } from "@/types/life-video";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function getLifeVideosList(onlyActive = false): Promise<LifeVideo[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    let query = supabase
      .from("life_videos")
      .select("*")
      .order("display_order", { ascending: true });

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author || "@tiemlaubotramruoi",
        platform: item.platform || "TikTok",
        thumbnail: item.thumbnail,
        tag: item.tag,
        url: item.url,
        displayOrder: item.display_order ?? 0,
        isActive: item.is_active ?? true,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }
  } catch (err) {
    console.error("Supabase load in getLifeVideosList failed:", err);
  }

  return [];
}

export async function getLifeVideoById(id: string): Promise<LifeVideo | null> {
  const list = await getLifeVideosList(false);
  return list.find((v) => v.id === id) || null;
}

export async function upsertLifeVideo(video: LifeVideo): Promise<LifeVideo> {
  const now = new Date().toISOString();
  const videoToSave: LifeVideo = {
    ...video,
    id: video.id || `VID-${Date.now().toString(36).toUpperCase()}`,
    author: video.author || "@tiemlaubotramruoi",
    platform: video.platform || "TikTok",
    displayOrder: Number(video.displayOrder) || 0,
    isActive: video.isActive !== undefined ? video.isActive : true,
    updatedAt: now,
    createdAt: video.createdAt || now,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const payload = {
          id: videoToSave.id,
          title: videoToSave.title,
          author: videoToSave.author,
          platform: videoToSave.platform,
          thumbnail: videoToSave.thumbnail,
          tag: videoToSave.tag,
          url: videoToSave.url,
          display_order: videoToSave.displayOrder,
          is_active: videoToSave.isActive,
          updated_at: now,
        };
        const { error } = await supabase.from("life_videos").upsert(payload);
        if (error) {
          console.error("Supabase upsert life_videos error:", error.message);
        }
      }
    } catch (err) {
      console.error("Supabase upsert life_videos exception:", err);
    }
  }

  return videoToSave;
}

export async function deleteLifeVideo(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { error } = await supabase.from("life_videos").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete life_videos error:", error.message);
        }
      }
    } catch (err) {
      console.error("Supabase delete life_videos exception:", err);
    }
  }

  return true;
}
