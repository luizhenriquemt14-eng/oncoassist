import { useEffect, useRef, useState } from "react";
import { events as defaultEvents, Event } from "@/data/events";
import { fixImagePath } from "@/lib/bannerMappings";

const STORAGE_KEY = "oncoassist-events";
const DATA_VERSION_KEY = "oncoassist-events-version";
const CURRENT_DATA_VERSION = "2.2.0"; // Incrementar quando houver mudanças críticas (atualizado para sincronizar datas)

const safeParseEvents = (): Event[] => {
  try {
    // Verifica a versão dos dados
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
    const needsUpdate = storedVersion !== CURRENT_DATA_VERSION;
    
    if (needsUpdate) {
      // Limpa localStorage se a versão mudou
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      } catch {
        // Ignora erro ao limpar localStorage
      }
      return defaultEvents;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      try {
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      } catch {
        // Ignora erro
      }
      return defaultEvents;
    }
    
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      // Se há menos eventos que o padrão, provavelmente são dados antigos - usa os padrão
      if (parsed.length < defaultEvents.length) {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
        } catch {
          // Ignora erro ao limpar localStorage
        }
        return defaultEvents;
      }
      
      // Verifica se os IDs e slugs dos eventos correspondem aos eventos padrão
      // Se houver diferença, força atualização com dados padrão
      const defaultEventIds = new Set(defaultEvents.map(e => e.id));
      const defaultEventSlugs = new Set(defaultEvents.map(e => e.slug));
      const hasMismatchedIds = parsed.some((event: Event) => 
        !defaultEventIds.has(event.id) || !defaultEventSlugs.has(event.slug)
      );
      
      if (hasMismatchedIds) {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
        } catch {
          // Ignora erro ao limpar localStorage
        }
        return defaultEvents;
      }
      
      // Verifica se os eventos têm informações completas
      const hasIncompleteData = parsed.some((event: Event) => 
        !event.shortDescription || 
        !event.fullDescription || 
        !event.time || 
        !event.address ||
        !event.targetAudience ||
        !event.objective
      );
      
      if (hasIncompleteData) {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
        } catch {
          // Ignora erro ao limpar localStorage
        }
        return defaultEvents;
      }
      
      // Atualiza eventos do localStorage com dados mais recentes dos eventos padrão
      // Força sincronização de campos críticos (título, descrições, datas) com dados padrão
      const updatedEvents = defaultEvents.map(defaultEvent => {
        const storedEvent = parsed.find((e: Event) => e.id === defaultEvent.id);
        if (storedEvent) {
          // Força atualização de campos críticos com dados padrão mais recentes
          return {
            ...storedEvent,
            title: defaultEvent.title,
            shortDescription: defaultEvent.shortDescription,
            fullDescription: defaultEvent.fullDescription,
            date: defaultEvent.date, // Sincroniza data
            time: defaultEvent.time, // Sincroniza horário
            location: defaultEvent.location, // Sincroniza local
            address: defaultEvent.address, // Sincroniza endereço
            city: defaultEvent.city, // Sincroniza cidade
            state: defaultEvent.state, // Sincroniza estado
            targetAudience: defaultEvent.targetAudience,
            objective: defaultEvent.objective,
            image: fixImagePath(defaultEvent.image),
            speakers: defaultEvent.speakers, // Sincroniza palestrantes
          };
        }
        return defaultEvent;
      });
      
      // Salva eventos atualizados
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      } catch {
        // Ignora erro ao salvar localStorage
      }
      
      return updatedEvents;
    }
  } catch {
    // Ignora erros de parse
  }
  
  // Garante que a versão está salva
  try {
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
  } catch {
    // Ignora erro
  }
  
  return defaultEvents;
};

export const useEvents = () => {
  const isFirstRender = useRef(true);
  const [events, setEvents] = useState<Event[]>(() => safeParseEvents());

  // Persiste no localStorage sempre que mudar
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Ignora erro ao salvar localStorage
    }
  }, [events]);

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (id: string, updated: Event) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? updated : event))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const resetEvents = () => {
    setEvents(defaultEvents);
  };

  return { events, addEvent, updateEvent, deleteEvent, resetEvents };
};

export default useEvents;
