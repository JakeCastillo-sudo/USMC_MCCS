import { NextRequest, NextResponse } from "next/server"
import eventsData from "@/data/events.json"

interface EventPricing {
  free: boolean
  adultPrice?: number
  activeDutyPrice?: number
  childPrice?: number
  childFreeUnder?: number
  notes?: string
}

interface MCCSEvent {
  id: string
  title: string
  type: string
  venue: string
  venueId: string
  date: string
  endDate?: string
  time: string
  description: string
  price: EventPricing
  eligibility: string[]
  capacity: number
  registrationRequired: boolean
  registrationOpen: boolean
  spotsRemaining?: number | null
  image: string
  tags: string[]
  featured: boolean
}

const events: MCCSEvent[] = eventsData as MCCSEvent[]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type     = searchParams.get("type")
  const featured = searchParams.get("featured")
  const limit    = searchParams.get("limit")

  let filtered = [...events]

  // Default: only upcoming events (date >= today or endDate >= today)
  const today = new Date().toISOString().split("T")[0]
  filtered = filtered.filter(e => (e.endDate ?? e.date) >= today)

  if (type)                 filtered = filtered.filter(e => e.type === type)
  if (featured === "true")  filtered = filtered.filter(e => e.featured)

  // Sort by date ascending
  filtered.sort((a, b) => a.date.localeCompare(b.date))

  if (limit) filtered = filtered.slice(0, parseInt(limit))

  return NextResponse.json({ data: filtered, meta: { total: filtered.length } })
}
