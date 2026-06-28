import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEvents } from "./use-events";
import { events as defaultEvents } from "@/data/events";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useEvents", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should initialize with default events when localStorage is empty", () => {
    const { result } = renderHook(() => useEvents());
    expect(result.current.events).toEqual(defaultEvents);
    expect(result.current.events.length).toBeGreaterThan(0);
  });

  it("should load events from localStorage", () => {
    const customEvents = [{ ...defaultEvents[0], title: "Custom Event" }];
    localStorageMock.setItem("oncoassist-events", JSON.stringify(customEvents));

    const { result } = renderHook(() => useEvents());
    expect(result.current.events).toEqual(customEvents);
  });

  it("should add an event", () => {
    const { result } = renderHook(() => useEvents());
    const newEvent = {
      ...defaultEvents[0],
      id: "new-event",
      slug: "new-event",
      title: "New Event",
    };

    act(() => {
      result.current.addEvent(newEvent);
    });

    expect(result.current.events).toContainEqual(newEvent);
    expect(result.current.events.length).toBe(defaultEvents.length + 1);
  });

  it("should update an event", () => {
    const { result } = renderHook(() => useEvents());
    const eventToUpdate = result.current.events[0];
    const updatedEvent = { ...eventToUpdate, title: "Updated Title" };

    act(() => {
      result.current.updateEvent(eventToUpdate.id, updatedEvent);
    });

    const updated = result.current.events.find((e) => e.id === eventToUpdate.id);
    expect(updated?.title).toBe("Updated Title");
  });

  it("should delete an event", () => {
    const { result } = renderHook(() => useEvents());
    const eventToDelete = result.current.events[0];
    const initialLength = result.current.events.length;

    act(() => {
      result.current.deleteEvent(eventToDelete.id);
    });

    expect(result.current.events.length).toBe(initialLength - 1);
    expect(result.current.events.find((e) => e.id === eventToDelete.id)).toBeUndefined();
  });

  it("should reset events to default", () => {
    const { result } = renderHook(() => useEvents());
    const newEvent = {
      ...defaultEvents[0],
      id: "temp-event",
      slug: "temp-event",
      title: "Temp Event",
    };

    act(() => {
      result.current.addEvent(newEvent);
      result.current.resetEvents();
    });

    expect(result.current.events).toEqual(defaultEvents);
    expect(result.current.events.find((e) => e.id === "temp-event")).toBeUndefined();
  });
});



