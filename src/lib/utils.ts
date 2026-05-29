import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ProgramCategory, TrendDirection, TrendSentiment } from "@/types"

// ─── shadcn base utility ─────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Number formatters ───────────────────────────────────────────────────────

/**
 * Format a dollar amount.
 * compact=true  →  "$4.2M" / "$820K" / "$42"
 * compact=false →  "$4,200,000"
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      const m = value / 1_000_000
      return `$${parseFloat(m.toFixed(1))}M`
    }
    if (Math.abs(value) >= 1_000) {
      const k = value / 1_000
      return `$${parseFloat(k.toFixed(1))}K`
    }
    return `$${value}`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a percentage value.
 * formatPercent(78.4)    → "78.4%"
 * formatPercent(78.4, 0) → "78%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format a large integer with commas.
 * formatCount(22400) → "22,400"
 */
export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

/**
 * Format a CSAT score.
 * formatCsat(4.3) → "4.3 / 5.0"
 */
export function formatCsat(value: number): string {
  return `${value.toFixed(1)} / 5.0`
}

/**
 * Format a metric value based on its unit type.
 */
export function formatMetricValue(
  value: number,
  unit: "currency" | "percent" | "count" | "score",
  compact = false
): string {
  switch (unit) {
    case "currency":
      return formatCurrency(value, compact)
    case "percent":
      return formatPercent(value, 0)
    case "count":
      return formatCount(value)
    case "score":
      return formatCsat(value)
  }
}

// ─── Trend & alert colors ─────────────────────────────────────────────────────

/**
 * Returns Tailwind text color class based on trend direction + sentiment.
 * trendColor("up", "positive")  → "text-emerald-600"
 * trendColor("up", "negative")  → "text-red-600"   (e.g. costs rising)
 * trendColor("down", "positive")→ "text-emerald-600"
 */
export function trendColor(
  direction: TrendDirection,
  sentiment: TrendSentiment
): string {
  if (sentiment === "neutral") return "text-zinc-500"
  const isGood =
    (direction === "up" && sentiment === "positive") ||
    (direction === "down" && sentiment === "negative")
  return isGood ? "text-emerald-600" : "text-red-600"
}

/**
 * Returns Tailwind bg + text + border classes for alert level badges.
 */
export function alertColor(
  level: "critical" | "warning" | "success" | "info"
): string {
  switch (level) {
    case "critical":
      return "bg-red-50 text-red-700 border-red-200"
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "info":
      return "bg-blue-50 text-blue-700 border-blue-200"
  }
}

/**
 * Returns Tailwind dot/indicator color class for an alert level.
 */
export function alertDotColor(
  level: "critical" | "warning" | "success" | "info"
): string {
  switch (level) {
    case "critical":
      return "bg-red-500"
    case "warning":
      return "bg-amber-500"
    case "success":
      return "bg-emerald-500"
    case "info":
      return "bg-blue-500"
  }
}

// ─── Category helpers ─────────────────────────────────────────────────────────

/**
 * Human-readable display label for a program category.
 */
export function categoryLabel(category: ProgramCategory): string {
  const labels: Record<ProgramCategory, string> = {
    fitness: "Fitness & Recreation",
    childcare: "Child & Youth Programs",
    dining: "Dining & Events",
    recreation: "Outdoor Recreation",
    retail: "Shopping & Retail",
    lodging: "Lodging & Cottages",
    "family-support": "Family Support",
    education: "Education & Career",
  }
  return labels[category] ?? category
}

/**
 * Lucide icon name string for a program category.
 * Import the returned name from lucide-react in your component.
 */
export function categoryIcon(category: ProgramCategory): string {
  const icons: Record<ProgramCategory, string> = {
    fitness: "Dumbbell",
    childcare: "Baby",
    dining: "UtensilsCrossed",
    recreation: "Tent",
    retail: "ShoppingBag",
    lodging: "BedDouble",
    "family-support": "Heart",
    education: "GraduationCap",
  }
  return icons[category] ?? "Circle"
}

/**
 * MCCS brand color (hex) for chart series per category.
 */
export function categoryColor(category: ProgramCategory): string {
  const colors: Record<ProgramCategory, string> = {
    fitness: "#C8102E",       // MCCS Red
    childcare: "#003087",     // Navy
    dining: "#d97706",        // Amber (Gold readable on white)
    recreation: "#16a34a",    // Emerald
    retail: "#7c3aed",        // Violet
    lodging: "#0891b2",       // Cyan
    "family-support": "#ea580c", // Orange
    education: "#475569",     // Slate
  }
  return colors[category] ?? "#94a3b8"
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Extract the 4-digit year from a month string like "May 2026".
 */
export function yearFromMonth(month: string): number {
  const parts = month.split(" ")
  return parseInt(parts[parts.length - 1], 10)
}

const MONTH_ORDER: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

/**
 * Compare two month strings ("May 2026") chronologically.
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareMonths(a: string, b: string): number {
  const [aMonth, aYear] = a.split(" ")
  const [bMonth, bYear] = b.split(" ")
  const yearDiff = parseInt(aYear, 10) - parseInt(bYear, 10)
  if (yearDiff !== 0) return yearDiff
  return (MONTH_ORDER[aMonth] ?? 0) - (MONTH_ORDER[bMonth] ?? 0)
}
