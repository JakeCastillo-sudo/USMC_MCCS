import { NextRequest, NextResponse } from "next/server"
import type { Patron } from "@/types"
import patronsData from "@/data/patrons.json"

let patrons: Patron[] = patronsData as Patron[]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search      = searchParams.get("search")?.toLowerCase()
  const loyaltyTier = searchParams.get("loyaltyTier")
  const branch      = searchParams.get("branch")

  let filtered = patrons

  if (loyaltyTier) filtered = filtered.filter(p => p.loyaltyTier === loyaltyTier)
  if (branch)      filtered = filtered.filter(p => p.branch === branch)
  if (search) {
    filtered = filtered.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search) ||
      p.rank.toLowerCase().includes(search) ||
      p.email.toLowerCase().includes(search) ||
      p.unit.toLowerCase().includes(search) ||
      p.id.toLowerCase().includes(search)
    )
  }

  return NextResponse.json({ data: filtered, meta: { total: filtered.length } })
}
