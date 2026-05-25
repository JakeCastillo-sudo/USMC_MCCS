import { NextRequest, NextResponse } from "next/server"
import rawPrograms from "@/data/programs.json"
import type { Program, ProgramCategory, ApiResponse } from "@/types"

const programs = rawPrograms as Program[]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category  = searchParams.get("category")
  const bookable  = searchParams.get("bookable")
  const eligibility = searchParams.get("eligibility")
  const q         = searchParams.get("q")

  let result = [...programs]

  // Filter by category
  if (category) {
    result = result.filter(
      (p) => p.category === (category as ProgramCategory)
    )
  }

  // Filter by bookable
  if (bookable === "true") {
    result = result.filter((p) => p.bookable === true)
  } else if (bookable === "false") {
    result = result.filter((p) => p.bookable === false)
  }

  // Filter by eligibility (case-insensitive includes check)
  if (eligibility) {
    const term = eligibility.toLowerCase()
    result = result.filter((p) =>
      p.eligibility.some((e) => e.toLowerCase().includes(term))
    )
  }

  // Full-text search across name, description, and tags
  if (q) {
    const term = q.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    )
  }

  const response: ApiResponse<Program[]> = {
    data: result,
    meta: {
      total: result.length,
      installation: "Camp Pendleton",
    },
  }

  return NextResponse.json(response)
}
