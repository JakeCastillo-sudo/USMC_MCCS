"use client"

import { Zap, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface StormBreakerBadgeProps {
  size?: "sm" | "md" | "lg"
  variant?: "dark" | "light"
  className?: string
}

const TOOLTIP_TEXT =
  "Operation StormBreaker reduced MCCS ATO timelines from 18 months to 30 days. Kaizen Labs deploys directly into this certified infrastructure."

export default function StormBreakerBadge({
  size = "md",
  variant = "dark",
  className,
}: StormBreakerBadgeProps) {
  const isDark = variant === "dark"

  /* ── Small: inline pill ─────────────────────────────────────────── */
  if (size === "sm") {
    return (
      <div
        title={TOOLTIP_TEXT}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
          isDark
            ? "bg-[#003087] text-white"
            : "border border-[#003087]/20 bg-white text-[#003087]",
          className
        )}
      >
        <Zap className="h-3 w-3 text-yellow-400" />
        <span>StormBreaker</span>
      </div>
    )
  }

  /* ── Medium: compact card ───────────────────────────────────────── */
  if (size === "md") {
    return (
      <div
        title={TOOLTIP_TEXT}
        className={cn(
          "rounded-xl p-3 space-y-1.5",
          isDark
            ? "bg-[#003087] text-white"
            : "border border-[#003087]/20 bg-white text-[#003087]",
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <Zap
            className={cn("h-4 w-4 shrink-0 animate-pulse", isDark ? "text-yellow-300" : "text-yellow-500")}
          />
          <span className={cn("text-xs font-bold", isDark ? "text-white" : "text-[#003087]")}>
            Operation StormBreaker
          </span>
        </div>
        <p className={cn("text-xs leading-snug", isDark ? "text-blue-200" : "text-zinc-500")}>
          MCCS DevSecOps Platform · AWS Landing Zone
        </p>
        <div className="flex flex-wrap gap-1">
          {["ATO Compliant", "Zero Trust", "FedRAMP Ready"].map((chip) => (
            <span
              key={chip}
              className={cn(
                "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                isDark ? "bg-white/10 text-blue-100" : "bg-[#003087]/10 text-[#003087]"
              )}
            >
              <ShieldCheck className="h-2.5 w-2.5" />
              {chip}
            </span>
          ))}
        </div>
      </div>
    )
  }

  /* ── Large: full banner card ────────────────────────────────────── */
  return (
    <div
      title={TOOLTIP_TEXT}
      className={cn(
        "rounded-2xl p-6",
        isDark
          ? "bg-[#003087] text-white"
          : "border border-[#003087]/20 bg-white text-[#003087]",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap
          className={cn("h-6 w-6 shrink-0 animate-pulse", isDark ? "text-yellow-300" : "text-yellow-500")}
        />
        <span className={cn("text-base font-bold", isDark ? "text-white" : "text-[#003087]")}>
          Operation StormBreaker
        </span>
      </div>
      <p className={cn("text-sm mb-1", isDark ? "text-blue-200" : "text-zinc-600")}>
        MCCS DevSecOps Platform · AWS Landing Zone
      </p>
      <p className={cn("text-xs leading-relaxed mb-4", isDark ? "text-blue-300/80" : "text-zinc-400")}>
        {TOOLTIP_TEXT}
      </p>
      <div className="flex flex-wrap gap-2">
        {["ATO Compliant", "Zero Trust", "FedRAMP Ready"].map((chip) => (
          <span
            key={chip}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              isDark ? "bg-white/10 text-blue-100" : "bg-[#003087]/10 text-[#003087]"
            )}
          >
            <ShieldCheck className="h-3 w-3" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}
