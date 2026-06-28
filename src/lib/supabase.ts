import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import {
  ADMIN_SESSION_KEY,
  DEFAULT_SUPABASE_ANON_KEY,
  DEFAULT_SUPABASE_URL,
} from "./site-config";

type Database = Record<string, never>;

let client: SupabaseClient<Database> | null = null;

export const getSupabaseConfig = () => {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  const url = rawUrl
    ? rawUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/g, "")
    : rawUrl;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};

export const getSupabase = () => {
  if (client) {
    return client;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  client = createClient<Database>(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true,
    },
  });

  return client;
};

export const readStoredAdminSession = (): Session | null => {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

export const writeStoredAdminSession = (session: Session | null) => {
  try {
    if (session) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      return;
    }
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
};
