import "server-only";

import { DEMO_POLICY } from "./index";

declare const calendarDate: unique symbol;
export type CalendarDate = string & { readonly [calendarDate]: true };

/** Reject impossible dates instead of letting JavaScript silently normalize them. */
export function parseCalendarDate(value: string): CalendarDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) {
    throw new RangeError("Use a valid calendar date in YYYY-MM-DD format.");
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new RangeError("Use a valid calendar date in YYYY-MM-DD format.");
  }
  return value as CalendarDate;
}

/** Convert a timestamp to the application date, regardless of the host timezone. */
export function applicationDate(now: Date = new Date()): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DEMO_POLICY.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;
  return parseCalendarDate(`${part("year")}-${part("month")}-${part("day")}`);
}

/** UTC is used only as a calendar arithmetic carrier, never as the business timezone. */
export function addCalendarDays(value: CalendarDate, days: number): CalendarDate {
  if (!Number.isSafeInteger(days)) throw new RangeError("Days must be a whole number.");
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return parseCalendarDate(date.toISOString().slice(0, 10));
}

export function formatCalendarDate(value: CalendarDate): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
