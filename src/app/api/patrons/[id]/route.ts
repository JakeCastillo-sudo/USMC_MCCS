import { NextRequest, NextResponse } from "next/server"
import type { Patron } from "@/types"
import patronsData from "@/data/patrons.json"

let patrons: Patron[] = patronsData as Patron[]

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const patron = patrons.find(p => p.id === id)
  if (!patron) {
    return NextResponse.json({ error: "Patron not found" }, { status: 404 })
  }
  return NextResponse.json({ data: patron })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const idx = patrons.findIndex(p => p.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: "Patron not found" }, { status: 404 })
  }

  patrons[idx] = { ...patrons[idx], ...body }
  return NextResponse.json({ data: patrons[idx] })
}
