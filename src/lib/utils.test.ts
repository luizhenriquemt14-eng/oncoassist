import { describe, it, expect } from "vitest";
import { cn, parseBrazilianDate, sortEventsChronologically } from "./utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });
});

describe("parseBrazilianDate", () => {
  it("should parse valid dates in dd/mm/yyyy format", () => {
    expect(parseBrazilianDate("18/07/2026")).toEqual(new Date(2026, 6, 18));
  });

  it("should return null for invalid dates", () => {
    expect(parseBrazilianDate("31/02/2026")).toBeNull();
    expect(parseBrazilianDate("2026-07-18")).toBeNull();
  });
});

describe("sortEventsChronologically", () => {
  it("should sort upcoming events first and past events last", () => {
    const sortedEvents = sortEventsChronologically(
      [
        { id: "3", slug: "c", title: "C", shortDescription: "", fullDescription: "", date: "09/05/2026", time: "", location: "", address: "", city: "", state: "", targetAudience: "", objective: "", image: "", speakers: [] },
        { id: "1", slug: "a", title: "A", shortDescription: "", fullDescription: "", date: "18/07/2026", time: "", location: "", address: "", city: "", state: "", targetAudience: "", objective: "", image: "", speakers: [] },
        { id: "2", slug: "b", title: "B", shortDescription: "", fullDescription: "", date: "15/08/2026", time: "", location: "", address: "", city: "", state: "", targetAudience: "", objective: "", image: "", speakers: [] },
      ],
      new Date(2026, 6, 1)
    );

    expect(sortedEvents.map((event) => event.id)).toEqual(["1", "2", "3"]);
  });
});
