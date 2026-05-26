"use client"

import { useState } from "react"
import { CreditCard, Wallet, Banknote, CheckCircle2, RefreshCw, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Reservation } from "@/types"
import { toast } from "sonner"

type Method = "MCCS Pay" | "Credit Card" | "Cash"

const METHOD_ICONS: Record<Method, React.ElementType> = {
  "MCCS Pay":    Wallet,
  "Credit Card": CreditCard,
  "Cash":        Banknote,
}

interface Props {
  reservation: Reservation
  onUpdate: (updated: Reservation) => void
}

export default function PaymentProcessor({ reservation: r, onUpdate }: Props) {
  const [method, setMethod] = useState<Method>("MCCS Pay")
  const [processing, setProcessing] = useState(false)
  const [refunding, setRefunding]   = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const [showRefund, setShowRefund] = useState(false)

  const isPaid     = r.paymentStatus === "paid"
  const isRefunded = r.paymentStatus === "refunded"
  const isFree     = r.paymentAmount === 0

  async function handleProcess() {
    setProcessing(true)
    await new Promise(res => setTimeout(res, 1200))

    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: r.id,
          paymentStatus: "paid",
          paymentMethod: method,
        }),
      })
      const json = await res.json()
      onUpdate(json.data)
      toast.success(`Payment of $${r.paymentAmount} processed via ${method}`)
    } catch {
      toast.error("Payment processing failed")
    } finally {
      setProcessing(false)
    }
  }

  async function handleRefund() {
    setRefunding(true)
    await new Promise(res => setTimeout(res, 1200))

    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: r.id,
          paymentStatus: "refunded",
        }),
      })
      const json = await res.json()
      onUpdate(json.data)
      toast.success(`Refund of $${r.paymentAmount} issued`)
      setShowRefund(false)
    } catch {
      toast.error("Refund failed")
    } finally {
      setRefunding(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className={cn(
        "rounded-xl border p-4 flex items-center gap-4",
        isFree      ? "border-emerald-200 bg-emerald-50" :
        isPaid      ? "border-emerald-200 bg-emerald-50" :
        isRefunded  ? "border-zinc-200 bg-zinc-50" :
        "border-amber-200 bg-amber-50"
      )}>
        <div className={cn(
          "rounded-full p-2",
          isFree || isPaid ? "bg-emerald-100" : isRefunded ? "bg-zinc-100" : "bg-amber-100"
        )}>
          {isFree || isPaid
            ? <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            : isRefunded
              ? <RotateCcw className="h-6 w-6 text-zinc-500" />
              : <CreditCard className="h-6 w-6 text-amber-600" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-900">
            {isFree      ? "No charge — complimentary access" :
             isPaid      ? "Payment collected" :
             isRefunded  ? "Refund issued" :
             "Payment required"}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isFree      ? "Active Duty free program" :
             isPaid      ? `$${r.paymentAmount} via ${r.paymentMethod}` :
             isRefunded  ? `$${r.paymentAmount} refunded` :
             `$${r.paymentAmount} outstanding — ${r.paymentMethod}`}
          </p>
        </div>
        {!isFree && (
          <p className="text-2xl font-bold text-zinc-900">${r.paymentAmount}</p>
        )}
      </div>

      {/* Process payment */}
      {!isPaid && !isRefunded && !isFree && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Select Payment Method</p>
          <div className="grid grid-cols-3 gap-3">
            {(["MCCS Pay", "Credit Card", "Cash"] as Method[]).map(m => {
              const Icon = METHOD_ICONS[m]
              return (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all",
                    method === m
                      ? "border-[#003087] bg-blue-50 text-[#003087]"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {m}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleProcess}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#C8102E" }}
          >
            {processing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Process ${r.paymentAmount} via {method}
              </>
            )}
          </button>
        </div>
      )}

      {/* Refund section */}
      {isPaid && !isRefunded && !isFree && (
        <div>
          {!showRefund ? (
            <button
              onClick={() => setShowRefund(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Issue Refund
            </button>
          ) : (
            <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">Confirm Refund of ${r.paymentAmount}</p>
              <textarea
                rows={2}
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="Reason for refund (required)…"
                className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRefund}
                  disabled={refunding || !refundReason.trim()}
                  className="flex-1 rounded-lg py-2 text-sm font-bold text-white bg-red-600 disabled:opacity-50 hover:bg-red-700 transition-colors"
                >
                  {refunding ? "Processing…" : "Confirm Refund"}
                </button>
                <button
                  onClick={() => setShowRefund(false)}
                  className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm font-semibold text-zinc-600 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction history note */}
      <p className="text-xs text-zinc-400 text-center">
        All payment actions are logged to the MCCS transaction ledger.
      </p>
    </div>
  )
}
