import { NextRequest, NextResponse } from "next/server"
import rawFacilities from "@/data/facilities.json"
import type { Facility, ProgramCategory, ApiResponse } from "@/types"

const facilities = rawFacilities as Facility[]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category")
  const area     = searchParams.get("area")

  let result = [...facilities]

  // Filter by category
  if (category) {
    result = result.filter(
      (f) => f.category === (category as ProgramCategory)
    )
  }

  // Filter by area (case-insensitive substring match)
  if (area) {
    const term = area.toLowerCase()
    result = result.filter((f) => f.area.toLowerCase().includes(term))
  }

  const response: ApiResponse<Facility[]> = {
    data: result,
    meta: {
      total: result.length,
      installation: "Camp Pendleton",
    },
  }

  return NextResponse.json(response)
}
