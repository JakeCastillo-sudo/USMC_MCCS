"use client"

import { useState } from "react"
import { X, CheckCircle2, Circle, AlertCircle, Zap, TrendingUp, Users, HeartHandshake, Megaphone, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Action, ActionImpact } from "@/types"

interface ActionPanelProps {
  action: Action | null
  open: boolean
  onClose: () => void
  onExecute: (actionId: string) => void
  onDismiss: (actionId: string) => void
}

const IMPACT_COLORS: Record<ActionImpact, { border: string; bg: string; text: string; badge: string }> = {
  high:   { border: "border-red-300",   bg: "bg-red-50",   text: "text-red-700",   badge: "bg-red-100 text-red-700" },
  medium: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  low:    { border: "border-blue-200",  bg: "bg-blue-50",  text: "text-blue-600",  badge: "bg-blue-100 text-blue-600" },
}

const TYPE_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  "action-cdc-rebalance":   { label: "Rebalancing",      icon: Zap },
  "action-paige-staffing":  { label: "Staffing",          icon: TrendingUp },
  "action-pool-csat":       { label: "CSAT Recovery",     icon: HeartHandshake },
  "action-dining-revenue":  { label: "Campaign",          icon: Megaphone },
  "action-warr-expansion":  { label: "Staffing",          icon: Users },
}

function ImpactLabel({ impact }: { impact: ActionImpact }) {
  const c = IMPACT_COLORS[impact]
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", c.badge)}>
      {impact === "high" ? "Critical" : impact === "medium" ? "Warning" : "Info"}
    </span>
  )
}

export default function ActionPanel({ action, open, onClose, onExecute, onDismiss }: ActionPanelProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set())
  const [executed, setExecuted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Reset state when action changes
  function handleOpen() {
    setCheckedSteps(new Set())
    setExecuted(false)
    setDismissed(false)
  }

  if (!open || !action) return null

  // action is guaranteed non-null below this point
  const safeAction = action
  const impact = IMPACT_COLORS[safeAction.impact]
  const typeInfo = TYPE_LABELS[safeAction.id] ?? { label: "Action", icon: Zap }
  const TypeIcon = typeInfo.icon

  function toggleStep(stepId: string) {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      next.has(stepId) ? next.delete(stepId) : next.add(stepId)
      return next
    })
  }

  function handleExecute() {
    setExecuted(true)
    onExecute(safeAction.id)
  }

  function handleDismiss() {
    setDismissed(true)
    onDismiss(safeAction.id)
    setTimeout(onClose, 800)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-black/20"
        onClick={onClose}
      />

      {/* Panel — full screen on mobile, 480px drawer on desktop */}
      <div
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300",
          "inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-[480px]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        onAnimationEnd={handleOpen}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-zinc-100" style={{ backgroundColor: "#003087" }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white flex items-center gap-1">
                <TypeIcon className="h-3 w-3" />
                {typeInfo.label}
              </span>
              <ImpactLabel impact={safeAction.impact} />
            </div>
            <h2 className="text-base font-bold text-white leading-snug">{safeAction.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {executed ? (
            /* Success state */
            <div className="flex flex-col items-center justify-center h-full px-8 text-center py-16">
              <div className="rounded-full bg-emerald-100 p-4 mb-4">
                <CheckCheck className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Plan Initiated</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your action plan has been submitted. Dashboard metrics will reflect changes within 24 hours.
              </p>
              <button
                className="mt-6 text-sm font-semibold underline"
                style={{ color: "#003087" }}
                onClick={onClose}
              >
                View Activity Log →
              </button>
            </div>
          ) : dismissed ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center py-16">
              <div className="rounded-full bg-zinc-100 p-4 mb-4">
                <X className="h-8 w-8 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-500">Action dismissed.</p>
            </div>
          ) : (
            <div className="px-5 py-5 space-y-5">
              {/* Summary */}
              <p className="text-sm text-zinc-600 leading-relaxed">{safeAction.summary}</p>

              {/* Impact card */}
              <div className={cn("rounded-xl border p-4 space-y-3", impact.border, impact.bg)}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">Estimated Impact</p>
                  <p className={cn("text-sm font-medium", impact.text)}>
                    {safeAction.estimatedPatrons
                      ? `${safeAction.estimatedPatrons} patrons directly affected`
                      : "Operational improvement"}
                  </p>
                  {safeAction.estimatedRevenue != null && safeAction.estimatedRevenue > 0 && (
                    <p className="text-sm text-emerald-700 font-medium mt-0.5">
                      +${safeAction.estimatedRevenue.toLocaleString()} estimated annual revenue
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">Category</p>
                  <span className="rounded-full bg-black/10 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
                    {safeAction.category}
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-900">Recommended Steps</h3>
                  <span className="text-xs text-zinc-400">
                    {safeAction.steps.length - checkedSteps.size} steps remaining
                  </span>
                </div>
                <div className="space-y-2">
                  {safeAction.steps.map((step, i) => {
                    const checked = checkedSteps.has(step.id)
                    return (
                      <button
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={cn(
                          "w-full text-left rounded-xl border p-3 transition-all",
                          checked ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-white hover:border-zinc-200"
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="shrink-0 mt-0.5">
                            {checked
                              ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              : <Circle className="h-4 w-4 text-zinc-300" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-bold text-zinc-400">Step {i + 1}</span>
                              <span className="text-xs text-zinc-400">· {step.estimatedTime}</span>
                            </div>
                            <p className={cn(
                              "text-sm font-medium transition-colors",
                              checked ? "text-emerald-700 line-through" : "text-zinc-800"
                            )}>
                              {step.label}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5">{step.owner}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Info note */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Executing this plan will notify relevant program coordinators and log the action in your MCCS activity dashboard.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {!executed && !dismissed && (
          <div className="px-5 py-4 border-t border-zinc-100 space-y-2">
            <button
              onClick={handleExecute}
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C8102E" }}
            >
              Execute Plan
            </button>
            <div className="flex gap-2">
              <button
                className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors hover:bg-blue-50"
                style={{ color: "#003087", borderColor: "#003087" }}
                onClick={() => {}}
              >
                Schedule for Later
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-500 transition-colors hover:bg-zinc-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
