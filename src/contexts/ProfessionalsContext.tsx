import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { professionals as fallbackProfessionals } from "@/data/professionals";
import type { Professional } from "@/types/site";
import { getSupabase } from "@/lib/supabase";
import { PROFESSIONALS_CACHE_KEY } from "@/lib/site-config";

interface ProfessionalsContextValue {
  professionals: Professional[];
  isLoading: boolean;
  refreshProfessionals: () => Promise<void>;
  upsertProfessional: (professional: Professional) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
}

const ProfessionalsContext = createContext<ProfessionalsContextValue | null>(null);

const normalizeProfessional = (value: Partial<Professional> & { id: string; name: string }): Professional => ({
  id: value.id,
  name: value.name,
  role: value.role || "",
  photo: value.photo || "/placeholder.svg",
  showOnHome: value.showOnHome !== false,
  curriculum: Array.isArray(value.curriculum) ? value.curriculum : [],
  locations: Array.isArray(value.locations) ? value.locations : [],
});

const parseCached = (): Professional[] => {
  try {
    const raw = localStorage.getItem(PROFESSIONALS_CACHE_KEY);
    if (!raw) {
      return fallbackProfessionals;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeProfessional(item))
      : fallbackProfessionals;
  } catch {
    return fallbackProfessionals;
  }
};

export const ProfessionalsProvider = ({ children }: PropsWithChildren) => {
  const [professionals, setProfessionals] = useState<Professional[]>(parseCached);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfessionals = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setProfessionals(fallbackProfessionals);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("professionals")
      .select("id,name,role,photo_url,show_on_home,curriculum,locations")
      .order("name");

    if (error || !data) {
      setProfessionals(parseCached());
      setIsLoading(false);
      return;
    }

    const next = data.map((item) =>
      normalizeProfessional({
        id: item.id,
        name: item.name,
        role: item.role ?? "",
        photo: item.photo_url ?? "/placeholder.svg",
        showOnHome: item.show_on_home ?? true,
        curriculum: item.curriculum ?? [],
        locations: item.locations ?? [],
      })
    );

    setProfessionals(next);
    setIsLoading(false);

    try {
      localStorage.setItem(PROFESSIONALS_CACHE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const upsertProfessional = useCallback(
    async (professional: Professional) => {
      const supabase = getSupabase();
      if (!supabase) {
        setProfessionals((current) => {
          const exists = current.some((item) => item.id === professional.id);
          return exists
            ? current.map((item) => (item.id === professional.id ? professional : item))
            : [...current, professional];
        });
        return;
      }

      const { error } = await supabase.from("professionals").upsert({
        id: professional.id,
        name: professional.name,
        role: professional.role ?? "",
        photo_url: professional.photo,
        show_on_home: professional.showOnHome ?? true,
        curriculum: professional.curriculum,
        locations: professional.locations,
      });

      if (error) {
        throw error;
      }

      await refreshProfessionals();
    },
    [refreshProfessionals]
  );

  const deleteProfessional = useCallback(
    async (id: string) => {
      const supabase = getSupabase();
      if (!supabase) {
        setProfessionals((current) => current.filter((item) => item.id !== id));
        return;
      }

      const { error } = await supabase.from("professionals").delete().eq("id", id);
      if (error) {
        throw error;
      }

      await refreshProfessionals();
    },
    [refreshProfessionals]
  );

  useEffect(() => {
    void refreshProfessionals();
  }, [refreshProfessionals]);

  const value = useMemo(
    () => ({
      professionals,
      isLoading,
      refreshProfessionals,
      upsertProfessional,
      deleteProfessional,
    }),
    [deleteProfessional, isLoading, professionals, refreshProfessionals, upsertProfessional]
  );

  return (
    <ProfessionalsContext.Provider value={value}>
      {children}
    </ProfessionalsContext.Provider>
  );
};

export const useProfessionals = () => {
  const context = useContext(ProfessionalsContext);
  if (!context) {
    throw new Error("useProfessionals must be used within ProfessionalsProvider");
  }
  return context;
};
