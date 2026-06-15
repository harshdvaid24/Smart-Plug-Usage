import type { PeriodType } from "./tariff/types";

/**
 * IST period boundaries (§2.6). Store UTC; compute day/cycle boundaries in IST
 * (Asia/Kolkata, fixed UTC+5:30, no DST). All returned `start`/`end` are UTC
 * instants; `end` is EXCLUSIVE. `*Ymd` are IST calendar-day strings.
 */

const IST_MS = (5 * 60 + 30) * 60 * 1000; // +05:30
const DAY_MS = 86_400_000;

/** IST wall-clock calendar fields for a UTC instant. */
export function istFields(d: Date) {
  const t = new Date(d.getTime() + IST_MS); // shift so UTC getters read IST
  return {
    y: t.getUTCFullYear(),
    m: t.getUTCMonth() + 1, // 1–12
    day: t.getUTCDate(),
    hour: t.getUTCHours(),
    wday: t.getUTCDay(), // 0=Sun … 6=Sat
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** UTC instant of IST midnight for a given IST calendar date. */
export function istMidnight(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m - 1, day, 0, 0, 0) - IST_MS);
}

/** IST calendar day 'YYYY-MM-DD' for a UTC instant. */
export function istYmd(d: Date): string {
  const f = istFields(d);
  return `${f.y}-${pad(f.m)}-${pad(f.day)}`;
}

function addMonthsYM(y: number, m: number, delta: number): { y: number; m: number } {
  const total = (y * 12 + (m - 1)) + delta;
  return { y: Math.floor(total / 12), m: (total % 12) + 1 };
}

/**
 * Bi-monthly cycle start containing an instant. PGVCL cycles align to even
 * months (…, Feb–Mar, Apr–May, Jun–Jul, …); the Dec–Jan cycle starts in Dec.
 */
export function cycleStartYM(y: number, m: number): { y: number; m: number } {
  if (m % 2 === 0) return { y, m };
  if (m === 1) return { y: y - 1, m: 12 };
  return { y, m: m - 1 };
}

export interface PeriodRange {
  periodType: PeriodType;
  start: Date; // inclusive (UTC instant of IST start)
  end: Date; // exclusive
  prevStart: Date;
  prevEnd: Date;
  startYmd: string; // IST day at start (inclusive)
  endYmd: string; // IST day at end (exclusive)
}

function range(start: Date, end: Date, prevStart: Date, prevEnd: Date, periodType: PeriodType): PeriodRange {
  return {
    periodType,
    start,
    end,
    prevStart,
    prevEnd,
    startYmd: istYmd(start),
    endYmd: istYmd(end),
  };
}

/** Resolve a period to its IST-aligned UTC boundaries + the comparison window. */
export function resolvePeriod(
  periodType: PeriodType,
  opts: { now?: Date; start?: string; end?: string } = {},
): PeriodRange {
  const now = opts.now ?? new Date();
  const f = istFields(now);

  switch (periodType) {
    case "day": {
      const start = istMidnight(f.y, f.m, f.day);
      const end = new Date(start.getTime() + DAY_MS);
      return range(start, end, new Date(start.getTime() - DAY_MS), start, "day");
    }
    case "week": {
      const daysFromMon = (f.wday + 6) % 7; // Mon=0
      const start = new Date(istMidnight(f.y, f.m, f.day).getTime() - daysFromMon * DAY_MS);
      const end = new Date(start.getTime() + 7 * DAY_MS);
      return range(start, end, new Date(start.getTime() - 7 * DAY_MS), start, "week");
    }
    case "month": {
      const start = istMidnight(f.y, f.m, 1);
      const next = addMonthsYM(f.y, f.m, 1);
      const end = istMidnight(next.y, next.m, 1);
      const prev = addMonthsYM(f.y, f.m, -1);
      return range(start, end, istMidnight(prev.y, prev.m, 1), start, "month");
    }
    case "cycle": {
      const cs = cycleStartYM(f.y, f.m);
      const start = istMidnight(cs.y, cs.m, 1);
      const next = addMonthsYM(cs.y, cs.m, 2);
      const end = istMidnight(next.y, next.m, 1);
      const prev = addMonthsYM(cs.y, cs.m, -2);
      return range(start, end, istMidnight(prev.y, prev.m, 1), start, "cycle");
    }
    case "year": {
      const start = istMidnight(f.y, 1, 1);
      const end = istMidnight(f.y + 1, 1, 1);
      return range(start, end, istMidnight(f.y - 1, 1, 1), start, "year");
    }
    case "custom": {
      if (!opts.start || !opts.end) {
        throw new Error("custom period requires start and end (YYYY-MM-DD)");
      }
      const [sy, sm, sd] = opts.start.split("-").map(Number);
      const [ey, em, ed] = opts.end.split("-").map(Number);
      const start = istMidnight(sy, sm, sd);
      const end = new Date(istMidnight(ey, em, ed).getTime() + DAY_MS); // inclusive end day
      const len = end.getTime() - start.getTime();
      return range(start, end, new Date(start.getTime() - len), start, "custom");
    }
  }
}

/** Cycle range that CONTAINS a given instant (for sub-cycle marginal/projection). */
export function cycleRangeContaining(d: Date): { start: Date; end: Date } {
  const f = istFields(d);
  const cs = cycleStartYM(f.y, f.m);
  const start = istMidnight(cs.y, cs.m, 1);
  const next = addMonthsYM(cs.y, cs.m, 2);
  return { start, end: istMidnight(next.y, next.m, 1) };
}

export function daysBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / DAY_MS;
}

/** List the bi-monthly cycle starts (YM) that overlap a [start,end) window. */
export function cyclesInRange(start: Date, end: Date): { start: Date; end: Date }[] {
  const out: { start: Date; end: Date }[] = [];
  let cur = cycleRangeContaining(start);
  let guard = 0;
  while (cur.start < end && guard++ < 60) {
    out.push(cur);
    cur = cycleRangeContaining(new Date(cur.end.getTime() + DAY_MS));
  }
  return out;
}
