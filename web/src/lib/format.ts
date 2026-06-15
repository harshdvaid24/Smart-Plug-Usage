/** Indian formatting (§3, §9.2). ₹ with Indian digit grouping; IST dates. */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const inrWhole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export function formatRupees(value: number, whole = false): string {
  if (!Number.isFinite(value)) return "—";
  return (whole ? inrWhole : inr).format(value);
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value);
}

export function formatKwh(value: number): string {
  return `${num.format(value)} kWh`;
}

export function formatWatts(value: number): string {
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)} W`;
}

export function formatPct(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${num.format(value)}%`;
}

const istDate = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatIstDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return istDate.format(d);
}

/** Label an IST day-string 'YYYY-MM-DD' as 'DD Mon'. */
export function formatDayLabel(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
