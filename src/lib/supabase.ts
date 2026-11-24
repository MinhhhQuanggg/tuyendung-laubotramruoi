import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * CỜ CẤU HÌNH KẾT NỐI SUPABASE
 * Đã ngắt kết nối: Dự án hiện tại chạy 100% bằng dữ liệu tĩnh cục bộ (Static Data), không cần DB và Admin.
 */
export const ENABLE_SUPABASE = false;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured = (): boolean => {
  if (!ENABLE_SUPABASE) return false;
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your_anon_key_here"
  );
};

// Client for Browser / Public operations (Luôn là null khi đã ngắt kết nối)
export const supabase = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

// Admin / Server Client for Route Handlers and Server Components
export const getSupabaseAdmin = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
