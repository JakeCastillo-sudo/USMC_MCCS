import { NextRequest, NextResponse } from "next/server"
import type { PaymentTransaction } from "@/types"
import paymentsData from "@/data/payments.json"

let payments: PaymentTransaction[] = paymentsData as PaymentTransaction[]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status        = searchParams.get("status")
  const reservationId = searchParams.get("reservationId")
  const patronId      = searchParams.get("patronId")
  const category      = searchParams.get("category")

  let filtered = payments

  if (status)        filtered = filtered.filter(p => p.status === status)
  if (reservationId) filtered = filtered.filter(p => p.reservationId === reservationId)
  if (patronId)      filtered = filtered.filter(p => p.patronId === patronId)
  if (category)      filtered = filtered.filter(p => p.category === category)

  const total = filtered.reduce((sum, p) => sum + p.amount, 0)

  return NextResponse.json({ data: filtered, meta: { total: filtered.length, totalAmount: total } })
}
