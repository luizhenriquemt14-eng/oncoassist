import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { events as fallbackEvents } from "@/data/events";
import type { Event, Professional, Speaker } from "@/types/site";
import {
  EVENTS_CACHE_KEY,
  EVENTS_DATA_VERSION,
  EVENTS_VERSION_KEY,
} from "@/lib/site-config";
import { getSupabase } from "@/lib/supabase";
import { sortEventsChronologically } from "@/lib/utils";
import { useProfessionals } from "./ProfessionalsContext";

interface EventsContextValue {
  events: Event[];
  isLoading: boolean;
  refreshEvents: () => Promise<void>;
  updateEvent: (id: string, event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextValue | null>(null);

const toSpeaker = (professional: Professional): Speaker => ({
  id: professional.id,
  name: professional.name,
  role: professional.role || "",
  image: professional.photo,
});

const normalizeStoredSpeakers = (value: unknown): Speaker[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const candidate = item as Partial<Speaker>;
    if (
      typeof candidate.id !== "string" ||
      typeof candidate.name !== "string" ||
      typeof candidate.role !== "string" ||
      typeof candidate.image !== "string"
    ) {
      return [];
    }

    return [
      {
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
        image: candidate.image || "/placeholder.svg",
      },
    ];
  });
};

const hydrateFallbackEvents = (professionals: Professional[]) => {
  const baseSpeakers = professionals.slice(0, 3).map(toSpeaker);
  return sortEventsChronologically(
    fallbackEvents.map((event) => ({
      ...event,
      speakers: event.speakers.length > 0 ? event.speakers : baseSpeakers,
    }))
  );
};

const readCachedEvents = (professionals: Professional[]) => {
  try {
    const version = localStorage.getItem(EVENTS_VERSION_KEY);
    if (version !== EVENTS_DATA_VERSION) {
      localStorage.removeItem(EVENTS_CACHE_KEY);
      localStorage.setItem(EVENTS_VERSION_KEY, EVENTS_DATA_VERSION);
      return hydrateFallbackEvents(professionals);
    }

    const raw = localStorage.getItem(EVENTS_CACHE_KEY);
    if (!raw) {
      return hydrateFallbackEvents(professionals);
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? (parsed as Event[])
      : hydrateFallbackEvents(professionals);
  } catch {
    return hydrateFallbackEvents(professionals);
  }
};

export const EventsProvider = ({ children }: PropsWithChildren) => {
  const { professionals } = useProfessionals();
  const [events, setEvents] = useState<Event[]>(() => readCachedEvents(professionals));
  const [isLoading, setIsLoading] = useState(true);

  const refreshEvents = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setEvents(hydrateFallbackEvents(professionals));
      setIsLoading(false);
      return;
    }

    const [eventsResponse, speakersResponse] = await Promise.all([
      supabase
        .from("events")
        .select(
          "id,slug,title,short_description,full_description,date,time,location,address,city,state,target_audience,objective,image,mobile_image,speakers,schedule"
        )
        .order("date"),
      supabase
        .from("event_speakers")
        .select("event_id,position,professional:professionals(id,name,role,photo_url)")
        .order("position"),
    ]);

    if (eventsResponse.error || !eventsResponse.data) {
      setEvents(readCachedEvents(professionals));
      setIsLoading(false);
      return;
    }

    const speakersByEvent = new Map<string, Speaker[]>();
    if (speakersResponse.data) {
      for (const item of speakersResponse.data) {
        const professional = item.professional as {
          id: string;
          name: string;
          role: string | null;
          photo_url: string | null;
        } | null;

        if (!professional) {
          continue;
        }

        const current = speakersByEvent.get(item.event_id) || [];
        current.push({
          id: professional.id,
          name: professional.name,
          role: professional.role ?? "",
          image: professional.photo_url ?? "/placeholder.svg",
        });
        speakersByEvent.set(item.event_id, current);
      }
    }

    const next = eventsResponse.data.map((item) => {
      const relationSpeakers = speakersByEvent.get(item.id) || [];
      const storedSpeakers = normalizeStoredSpeakers(item.speakers);

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        shortDescription: item.short_description,
        fullDescription: item.full_description,
        date: item.date,
        time: item.time,
        location: item.location,
        address: item.address ?? "",
        city: item.city,
        state: item.state,
        targetAudience: item.target_audience ?? "",
        objective: item.objective ?? "",
        image: item.image,
        mobileImage: item.mobile_image ?? undefined,
        schedule: item.schedule ?? undefined,
        speakers: relationSpeakers.length > 0 ? relationSpeakers : storedSpeakers,
      };
    });

    const sortedEvents = sortEventsChronologically(next);

    setEvents(sortedEvents);
    setIsLoading(false);

    try {
      localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(sortedEvents));
      localStorage.setItem(EVENTS_VERSION_KEY, EVENTS_DATA_VERSION);
    } catch {
      // Ignore storage errors
    }
  }, [professionals]);

  const updateEvent = useCallback(
    async (id: string, event: Event) => {
      const supabase = getSupabase();
      if (!supabase) {
        setEvents((current) => current.map((item) => (item.id === id ? event : item)));
        return;
      }

      const { error } = await supabase.from("events").upsert({
        id,
        slug: event.slug,
        title: event.title,
        short_description: event.shortDescription,
        full_description: event.fullDescription,
        date: event.date,
        time: event.time,
        location: event.location,
        address: event.address,
        city: event.city,
        state: event.state,
        target_audience: event.targetAudience,
        objective: event.objective,
        image: event.image,
        mobile_image: event.mobileImage ?? null,
        speakers: event.speakers,
        schedule: event.schedule ?? [],
      });

      if (error) {
        throw error;
      }

      await supabase.from("event_speakers").delete().eq("event_id", id);
      if (event.speakers.length > 0) {
        const { error: speakersError } = await supabase.from("event_speakers").insert(
          event.speakers.map((speaker, index) => ({
            event_id: id,
            professional_id: speaker.id,
            position: index + 1,
          }))
        );

        if (speakersError) {
          throw speakersError;
        }
      }

      await refreshEvents();
    },
    [refreshEvents]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      const supabase = getSupabase();
      if (!supabase) {
        setEvents((current) => current.filter((item) => item.id !== id));
        return;
      }

      await supabase.from("event_speakers").delete().eq("event_id", id);
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        throw error;
      }

      await refreshEvents();
    },
    [refreshEvents]
  );

  useEffect(() => {
    void refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    setEvents((current) =>
      current.map((event) =>
        event.speakers.length > 0
          ? event
          : {
              ...event,
              speakers: professionals.slice(0, 3).map(toSpeaker),
            }
      )
    );
  }, [professionals]);

  const value = useMemo(
    () => ({ events, isLoading, refreshEvents, updateEvent, deleteEvent }),
    [deleteEvent, events, isLoading, refreshEvents, updateEvent]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEventsContext must be used within EventsProvider");
  }
  return context;
};
