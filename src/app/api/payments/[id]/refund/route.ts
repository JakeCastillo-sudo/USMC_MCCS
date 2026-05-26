import { NextRequest, NextResponse } from "next/server"
import type { PaymentTransaction } from "@/types"
import paymentsData from "@/data/payments.json"

let payments: PaymentTransaction[] = paymentsData as PaymentTransaction[]

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const idx = payments.findIndex(p => p.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  const payment = payments[idx]
  const refundAmount = body.amount ?? payment.amount
  const isPartial = refundAmount < payment.amount

  payments[idx] = {
    ...payment,
    status: isPartial ? "partial" : "refunded",
    refundedAt: new Date().toISOString(),
    refundAmount,
    refundReason: body.reason ?? "Refund processed by staff",
  }

  return NextResponse.json({ data: payments[idx] })
}
