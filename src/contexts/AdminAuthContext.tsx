import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ADMIN_LAST_ACTIVITY_KEY,
  ADMIN_LOGOUT_REASON_KEY,
} from "@/lib/site-config";
import { getSupabase, readStoredAdminSession, writeStoredAdminSession } from "@/lib/supabase";

interface AdminAuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (reason?: "manual" | "inactive") => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
const INACTIVITY_LIMIT_MS = 1000 * 60 * 60 * 4;

export const AdminAuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(() => readStoredAdminSession());
  const [isLoading, setIsLoading] = useState(false);

  const persistSession = useCallback((next: Session | null) => {
    setSession(next);
    writeStoredAdminSession(next);
  }, []);

  const logout = useCallback(
    async (reason: "manual" | "inactive" = "manual") => {
      try {
        sessionStorage.setItem(ADMIN_LOGOUT_REASON_KEY, reason);
      } catch {
        // Ignore storage errors
      }

      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }

      persistSession(null);
    },
    [persistSession]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Supabase nao configurado.");
      }

      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);

      if (error || !data.session) {
        throw error || new Error("Nao foi possivel entrar.");
      }

      persistSession(data.session);
      try {
        sessionStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(Date.now()));
      } catch {
        // Ignore storage errors
      }
    },
    [persistSession]
  );

  useEffect(() => {
    if (!session) {
      return;
    }

    const markActivity = () => {
      try {
        sessionStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, String(Date.now()));
      } catch {
        // Ignore storage errors
      }
    };

    const eventNames: Array<keyof WindowEventMap> = ["click", "keydown", "mousemove", "touchstart"];
    eventNames.forEach((eventName) =>
      window.addEventListener(eventName, markActivity, { passive: true })
    );

    const intervalId = window.setInterval(() => {
      const lastActivity = Number(sessionStorage.getItem(ADMIN_LAST_ACTIVITY_KEY) || Date.now());
      if (Date.now() - lastActivity > INACTIVITY_LIMIT_MS) {
        void logout("inactive");
      }
    }, 60000);

    markActivity();

    return () => {
      eventNames.forEach((eventName) =>
        window.removeEventListener(eventName, markActivity)
      );
      window.clearInterval(intervalId);
    };
  }, [logout, session]);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: !!session,
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, session]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
