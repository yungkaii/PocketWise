/** Date-range helpers shared by dashboard filters, analytics and reports. */

export interface DateRange {
  from: string; // yyyy-MM-dd
  to: string; // yyyy-MM-dd
}

export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday-first
  d.setDate(d.getDate() - day);
  return d;
}

export function endOfWeek(date: Date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function rangeForPreset(preset: string, now = new Date()): DateRange {
  switch (preset) {
    case "week":
      return { from: toISODate(startOfWeek(now)), to: toISODate(endOfWeek(now)) };
    case "last-month": {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { from: toISODate(startOfMonth(prev)), to: toISODate(endOfMonth(prev)) };
    }
    case "month":
    default:
      return { from: toISODate(startOfMonth(now)), to: toISODate(endOfMonth(now)) };
  }
}

export function monthLabel(month: number, year: number) {
  return new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit" }).format(
    new Date(year, month - 1, 1),
  );
}
