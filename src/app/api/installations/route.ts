import { NextRequest, NextResponse } from "next/server"
import rawInstallations from "@/data/installations.json"
import type { Installation, ApiResponse } from "@/types"

const installations = rawInstallations as Installation[]

export async function GET(_request: NextRequest) {
  const total               = installations.length
  const live                = installations.filter((i) => i.status === "live").length
  const comingSoon          = installations.filter((i) => i.status === "coming-soon").length
  const totalPopulationServed = installations.reduce(
    (s, i) => s + i.marinePopulation,
    0
  )

  const response: ApiResponse<Installation[]> = {
    data: installations,
    meta: {
      total,
      live,
      comingSoon,
      totalPopulationServed,
      installation: "Camp Pendleton",
    },
  }

  return NextResponse.json(response)
}
