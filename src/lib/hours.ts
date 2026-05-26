// Hours utility — determines open/closed status from a plain-text hours string
// Used for live status badges across the patron portal

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/**
 * Very light-weight open/closed determination from a free-text hours string.
 * Handles common formats like "Mon–Fri 5:00 AM–10:00 PM · Sat–Sun 7:00 AM–8:00 PM"
 */
export function isOpenNow(hoursText: string): boolean {
  const now   = new Date()
  const day   = DAY_NAMES[now.getDay()]       // "Mon", "Tue", etc.
  const mins  = now.getHours() * 60 + now.getMinutes()

  // Split by "·" or newlines into segments
  const segments = hoursText.split(/[·\n]/).map(s => s.trim()).filter(Boolean)

  for (const seg of segments) {
    if (!appliesTo(seg, day)) continue
    const range = extractTimeRange(seg)
    if (!range) continue
    if (mins >= range.open && mins < range.close) return true
  }
  return false
}

export function getTodayHours(hoursText: string): string | null {
  const day = DAY_NAMES[new Date().getDay()]
  const segments = hoursText.split(/[·\n]/).map(s => s.trim()).filter(Boolean)
  for (const seg of segments) {
    if (appliesTo(seg, day)) return seg.replace(/^[A-Za-z–,\s]+\s/, "").trim()
  }
  return null
}

// ── Internal helpers ──────────────────────────────────────────────────────

function appliesTo(segment: string, day: string): boolean {
  const upper = segment.toUpperCase()
  // "Daily" catches everything
  if (upper.includes("DAILY")) return true

  // Expand ranges like "Mon–Fri" or "Mon-Fri"
  const rangeMatch = segment.match(/([A-Za-z]{2,3})[–-]([A-Za-z]{2,3})/)
  if (rangeMatch) {
    const startIdx = DAY_NAMES.indexOf(capitalize(rangeMatch[1]))
    const endIdx   = DAY_NAMES.indexOf(capitalize(rangeMatch[2]))
    const todayIdx = DAY_NAMES.indexOf(day)
    if (startIdx !== -1 && endIdx !== -1 && todayIdx !== -1) {
      if (startIdx <= endIdx) {
        return todayIdx >= startIdx && todayIdx <= endIdx
      } else {
        // Wraps (e.g. Sat–Mon)
        return todayIdx >= startIdx || todayIdx <= endIdx
      }
    }
  }
  // Simple list like "Mon, Wed, Fri"
  return segment.includes(day)
}

function extractTimeRange(segment: string): { open: number; close: number } | null {
  // Match "5:00 AM–10:00 PM" or "5:30 AM-9:00 PM"
  const m = segment.match(/(\d{1,2}):(\d{2})\s*(AM|PM)[–-](\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!m) return null
  return {
    open:  to24h(Number(m[1]), Number(m[2]), m[3]),
    close: to24h(Number(m[4]), Number(m[5]), m[6]),
  }
}

function to24h(h: number, m: number, period: string): number {
  const p = period.toUpperCase()
  if (p === "AM") return (h === 12 ? 0 : h) * 60 + m
  return (h === 12 ? 12 : h + 12) * 60 + m
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
