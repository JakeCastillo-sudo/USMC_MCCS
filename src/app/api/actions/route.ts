import { NextRequest, NextResponse } from "next/server"
import actionsData from "@/data/actions.json"
import type { Action, ActionStatus } from "@/types"

// In-memory state for demo (resets on server restart — expected)
let actions: Action[] = actionsData as Action[]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const alertId = searchParams.get("alertId")
  const status = searchParams.get("status") as ActionStatus | null

  let result = [...actions]
  if (alertId) result = result.filter((a) => a.alertId === alertId)
  if (status) result = result.filter((a) => a.status === status)

  return NextResponse.json({
    data: result,
    meta: { total: result.length },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, operation } = body as { id: string; operation: "execute" | "dismiss" }

  const idx = actions.findIndex((a) => a.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: "Action not found" }, { status: 404 })
  }

  if (operation === "execute") {
    actions[idx] = { ...actions[idx], status: "in_progress" }
  } else if (operation === "dismiss") {
    actions[idx] = { ...actions[idx], status: "dismissed" }
  } else {
    return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
  }

  return NextResponse.json({ data: actions[idx] })
}
