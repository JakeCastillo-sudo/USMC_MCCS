"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, Baby, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Current baseline data
const BASELINE = {
  cdc1: { name: "CDC-1 Mainside",   capacity: 158, enrolled: 158, waitlist: 187, utilPct: 100 },
  cdc2: { name: "CDC-2 Las Pulgas", capacity: 72,  enrolled: 72,  waitlist: 43,  utilPct: 100 },
  cdc3: { name: "CDC-3 San Onofre", capacity: 86,  enrolled: 71,  waitlist: 0,   utilPct: 82  },
}

const MONTHLY_COST_PER_SLOT = 480 // avg monthly operational cost per new enrollment slot

function CapacityBar({ pct }: { pct: number }) {
  const color = pct >= 100 ? "bg-red-500" : pct >= 85 ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-500", color)}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}

export default function ChildcareRebalancer() {
  const [transferSlots, setTransferSlots] = useState(0)    // CDC-3 → CDC-1 (0-20)
  const [overflowSAC, setOverflowSAC] = useState(false)    // +8 slots at School Age Care
  const [fccNetwork, setFccNetwork] = useState(false)      // +15 virtual slots via FCC
  const [applied, setApplied] = useState(false)

  // Computed state
  const cdc3Available = BASELINE.cdc3.capacity - BASELINE.cdc3.enrolled  // = 15 headroom
  const actualTransfer = Math.min(transferSlots, cdc3Available)

  const sacBonus    = overflowSAC ? 8  : 0
  const fccBonus    = fccNetwork  ? 15 : 0
  const totalNewSlots = actualTransfer + sacBonus + fccBonus

  const cdc1WaitlistNew = Math.max(0, BASELINE.cdc1.waitlist - totalNewSlots)
  const cdc2WaitlistNew = Math.max(0, BASELINE.cdc2.waitlist)   // unaffected by these levers

  const cdc1UtilNew = Math.min(
    Math.round(((BASELINE.cdc1.enrolled + actualTransfer + sacBonus) / (BASELINE.cdc1.capacity + actualTransfer + sacBonus)) * 100),
    100
  )
  const cdc3UtilNew = Math.round(
    ((BASELINE.cdc3.enrolled + actualTransfer) / BASELINE.cdc3.capacity) * 100
  )

  const additionalMonthlyCost = totalNewSlots * MONTHLY_COST_PER_SLOT

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
        <Baby className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-bold text-zinc-900">Childcare Capacity Rebalancer</h3>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 ml-auto">
          230 families on waitlist
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Current state — CDC cards */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-3">Current Capacity</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* CDC-1 */}
            <div className={cn(
              "rounded-xl border p-4 transition-all duration-500",
              cdc1WaitlistNew < BASELINE.cdc1.waitlist ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            )}>
              <p className="text-xs font-bold text-zinc-500 mb-1">{BASELINE.cdc1.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-red-600">{cdc1WaitlistNew}</span>
                {cdc1WaitlistNew !== BASELINE.cdc1.waitlist && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    ↓ from {BASELINE.cdc1.waitlist}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mb-2">families on waitlist</p>
              <CapacityBar pct={cdc1UtilNew} />
              <p className="text-xs text-zinc-500 mt-1">{cdc1UtilNew}% capacity</p>
            </div>

            {/* CDC-2 */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold text-zinc-500 mb-1">{BASELINE.cdc2.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-amber-600">{cdc2WaitlistNew}</span>
              </div>
              <p className="text-[10px] text-zinc-500 mb-2">families on waitlist</p>
              <CapacityBar pct={100} />
              <p className="text-xs text-zinc-500 mt-1">100% capacity</p>
            </div>

            {/* CDC-3 */}
            <div className={cn(
              "rounded-xl border p-4 transition-all duration-500",
              cdc3UtilNew >= 95 ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"
            )}>
              <p className="text-xs font-bold text-zinc-500 mb-1">{BASELINE.cdc3.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-emerald-600">{BASELINE.cdc3.capacity - BASELINE.cdc3.enrolled - actualTransfer}</span>
              </div>
              <p className="text-[10px] text-zinc-500 mb-2">slots available</p>
              <CapacityBar pct={cdc3UtilNew} />
              <p className="text-xs text-zinc-500 mt-1">{cdc3UtilNew}% capacity</p>
            </div>
          </div>
        </div>

        {/* Rebalancing Levers */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-3">Rebalancing Levers</p>
          <div className="space-y-4">
            {/* Slider: Transfer slots CDC-3 → CDC-1 */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-zinc-800">
                  Reallocate CDC-3 slots to CDC-1
                </label>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-bold text-blue-700">
                  {actualTransfer} slots
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-3">
                CDC-3 has {cdc3Available} slots of headroom. Reallocating shifts families closer to their area.
              </p>
              <input
                type="range"
                min={0}
                max={cdc3Available}
                value={transferSlots}
                onChange={(e) => setTransferSlots(Number(e.target.value))}
                className="w-full accent-[#003087]"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>0</span>
                <span>{cdc3Available} max</span>
              </div>
            </div>

            {/* Toggle: Overflow SAC */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-800">Overflow at School Age Care</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Open 8 overflow slots for 4–5 year-olds from CDC-1 waitlist
                </p>
                <span className="text-xs text-emerald-600 font-semibold">+8 slots</span>
              </div>
              <button
                onClick={() => setOverflowSAC(!overflowSAC)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  overflowSAC ? "bg-emerald-500" : "bg-zinc-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                    overflowSAC ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Toggle: FCC Network */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-800">Activate FCC Referral Network</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Refer 15 waitlisted families to certified Family Child Care providers on-installation
                </p>
                <span className="text-xs text-emerald-600 font-semibold">+15 virtual slots</span>
              </div>
              <button
                onClick={() => setFccNetwork(!fccNetwork)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  fccNetwork ? "bg-emerald-500" : "bg-zinc-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                    fccNetwork ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live projection */}
        <div className={cn(
          "rounded-xl border p-4 transition-all",
          totalNewSlots > 0 ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-zinc-50"
        )}>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Live Projection</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <p className="text-xs text-zinc-500">Waitlist reduction</p>
              <p className="text-xl font-bold text-zinc-900">
                {BASELINE.cdc1.waitlist} → <span className={totalNewSlots > 0 ? "text-emerald-600" : "text-zinc-900"}>{cdc1WaitlistNew}</span>
              </p>
            </div>
            <div className="h-8 w-px bg-zinc-200" />
            <div>
              <p className="text-xs text-zinc-500">New slots created</p>
              <p className="text-xl font-bold text-emerald-600">+{totalNewSlots}</p>
            </div>
            <div className="h-8 w-px bg-zinc-200" />
            <div>
              <p className="text-xs text-zinc-500">Additional cost/mo</p>
              <p className="text-xl font-bold text-zinc-900">
                {additionalMonthlyCost > 0
                  ? `$${additionalMonthlyCost.toLocaleString()}`
                  : "$0"}
              </p>
            </div>
          </div>
          {totalNewSlots === 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
              <p className="text-xs text-zinc-500">Adjust levers above to model capacity changes</p>
            </div>
          )}
        </div>

        {/* Apply button */}
        {applied ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Rebalancing Plan Applied</p>
              <p className="text-xs text-emerald-600">Coordinators have been notified. Dashboard will update within 24 hours.</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setApplied(true)}
            disabled={totalNewSlots === 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "#C8102E" }}
          >
            Apply Rebalancing Plan
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
