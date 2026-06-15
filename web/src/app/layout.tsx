import type { Metadata } from "next";
import Link from "next/link";
import { Activity, FileText, Gauge, Settings, Scale } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tapo P110 — Energy & Cost",
  description: "Local energy + PGVCL cost dashboard for a TP-Link Tapo P110",
};

const nav = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/bill", label: "Bill", icon: FileText },
  { href: "/calibrate", label: "Calibrate", icon: Scale },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <div className="mx-auto max-w-6xl px-4 py-6">
            <header className="mb-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold tracking-tight">
                  Tapo P110 · Energy
                </span>
              </Link>
              <nav className="flex items-center gap-1 text-sm">
                {nav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                ))}
              </nav>
            </header>
            {children}
            <footer className="mt-10 border-t pt-4 text-xs text-muted-foreground">
              Cost figures are for reference — the P110 reads ~5–6% low; calibrate
              against your DISCOM meter. Times in IST.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
