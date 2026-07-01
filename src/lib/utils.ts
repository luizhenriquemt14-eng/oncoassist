import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event } from "@/types/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseBrazilianDate(date: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date.trim());
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return null;
  }

  return parsedDate;
}

export function sortEventsChronologically(events: Event[], referenceDate = new Date()) {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  ).getTime();

  const getTimestamp = (event: Event) => {
    const parsedDate = parseBrazilianDate(event.date);
    return parsedDate ? parsedDate.getTime() : Number.POSITIVE_INFINITY;
  };

  const sortedEvents = [...events].sort((firstEvent, secondEvent) => {
    return getTimestamp(firstEvent) - getTimestamp(secondEvent);
  });

  const upcomingEvents = sortedEvents.filter((event) => getTimestamp(event) >= today);
  const pastEvents = sortedEvents.filter((event) => getTimestamp(event) < today);

  return [...upcomingEvents, ...pastEvents];
}
