import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { useEvents } from "./use-events";
import { events as defaultEvents } from "@/data/events";
import { EventsProvider } from "@/contexts/EventsContext";
import { ProfessionalsProvider } from "@/contexts/ProfessionalsContext";
vi.mock("@/lib/supabase", () => ({
  getSupabase: vi.fn(() => null),
}));

const wrapper = ({ children }: PropsWithChildren) => (
  <ProfessionalsProvider>
    <EventsProvider>{children}</EventsProvider>
  </ProfessionalsProvider>
);

describe("useEvents", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("should initialize with sorted fallback events when localStorage is empty", async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events.map((event) => event.id)).toEqual([
      "multiprofissional",
      "torax",
      "mama",
      "medicina-intensiva",
      "tumores-ginecologicos",
      "tumores-gastrointestinais",
      "tumores-geniturinarios",
      "hematologia",
    ]);
    expect(result.current.events.length).toBeGreaterThan(0);
    expect(result.current.events.every((event) => event.speakers.length > 0)).toBe(true);
  });

  it("should sort future events before past events", async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events.map((event) => event.id)).toEqual([
      "multiprofissional",
      "torax",
      "mama",
      "medicina-intensiva",
      "tumores-ginecologicos",
      "tumores-gastrointestinais",
      "tumores-geniturinarios",
      "hematologia",
    ]);
  });

  it("should update an event when supabase is unavailable", async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const eventToUpdate = result.current.events[0];
    const updatedEvent = { ...eventToUpdate, title: "Updated Title" };

    await act(async () => {
      await result.current.updateEvent(eventToUpdate.id, updatedEvent);
    });

    const updated = result.current.events.find((event) => event.id === eventToUpdate.id);
    expect(updated?.title).toBe("Updated Title");
  });

  it("should delete an event when supabase is unavailable", async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const eventToDelete = result.current.events[0];
    const initialLength = result.current.events.length;

    await act(async () => {
      await result.current.deleteEvent(eventToDelete.id);
    });

    expect(result.current.events.length).toBe(initialLength - 1);
    expect(result.current.events.find((event) => event.id === eventToDelete.id)).toBeUndefined();
  });
});
