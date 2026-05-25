"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { Metric } from "@/types"
import { formatMetricValue, trendColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface KPICardProps {
  metric: Metric
  className?: string
}

export default function KPICard({ metric, className }: KPICardProps) {
  const { label, value, unit, trend, trendDirection, trendSentiment, sparkline } = metric

  const trendCls = trendColor(trendDirection, trendSentiment)
  const isPositive =
    (trendDirection === "up" && trendSentiment === "positive") ||
    (trendDirection === "down" && trendSentiment === "negative")
  const trendBg = isPositive ? "bg-emerald-50" : trendSentiment === "neutral" ? "bg-zinc-50" : "bg-red-50"

  const sparkData = sparkline.map((v, i) => ({ i, v }))

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </p>

      {/* Value */}
      <p className="mt-2 font-mono text-2xl font-bold leading-none text-zinc-900">
        {formatMetricValue(value, unit, true)}
      </p>

      {/* Trend badge */}
      <div className={cn("mt-2 inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-xs font-medium", trendBg, trendCls)}>
        {trendDirection === "up" ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span>
          {trend > 0 ? "+" : ""}{trend.toFixed(1)}% vs last mo
        </span>
      </div>

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <div className="mt-3 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8102E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C8102E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={() => null}
                cursor={false}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#C8102E"
                strokeWidth={1.5}
                fill={`url(#grad-${metric.id})`}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
