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

  payments[idx] = {
    ...payments[idx],
    status: "completed",
    method: body.method ?? payments[idx].method,
    last4: body.last4 ?? payments[idx].last4,
    processedAt: new Date().toISOString(),
    notes: body.notes ?? payments[idx].notes,
  }

  return NextResponse.json({ data: payments[idx] })
}
