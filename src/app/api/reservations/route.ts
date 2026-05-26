import { NextRequest, NextResponse } from "next/server"
import type { Reservation } from "@/types"
import reservationsData from "@/data/reservations.json"

// In-memory state for demo
let reservations: Reservation[] = reservationsData as Reservation[]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status    = searchParams.get("status")
  const category  = searchParams.get("category")
  const date      = searchParams.get("date")
  const patronId  = searchParams.get("patronId")
  const search    = searchParams.get("search")?.toLowerCase()

  let filtered = reservations

  if (status)   filtered = filtered.filter(r => r.status === status)
  if (category) filtered = filtered.filter(r => r.category === category)
  if (date)     filtered = filtered.filter(r => r.date === date)
  if (patronId) filtered = filtered.filter(r => r.patronId === patronId)
  if (search) {
    filtered = filtered.filter(r =>
      r.patronName.toLowerCase().includes(search) ||
      r.programName.toLowerCase().includes(search) ||
      r.id.toLowerCase().includes(search)
    )
  }

  return NextResponse.json({ data: filtered, meta: { total: filtered.length } })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body

  const idx = reservations.findIndex(r => r.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
  }

  reservations[idx] = {
    ...reservations[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ data: reservations[idx] })
}
