"use client"

import { useState, useEffect } from "react"
import {
  DollarSign, CheckCircle2, RotateCcw, AlertCircle,
  ChevronDown, TrendingUp,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { cn } from "@/lib/utils"
import type { PaymentTransaction, ProgramCategory } from "@/types"

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
  pending:   { bg: "bg-amber-100",   text: "text-amber-700"   },
  refunded:  { bg: "bg-zinc-100",    text: "text-zinc-500"    },
  partial:   { bg: "bg-purple-100",  text: "text-purple-700"  },
  failed:    { bg: "bg-red-100",     text: "text-red-700"     },
}

const CATEGORY_COLORS: Partial<Record<ProgramCategory, string>> = {
  fitness:        "#003087",
  childcare:      "#C8102E",
  dining:         "#22c55e",
  recreation:     "#f59e0b",
  lodging:        "#8b5cf6",
  retail:         "#ec4899",
  "family-support": "#06b6d4",
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 flex items-center gap-3">
      <div className={cn("rounded-lg p-2.5", color)}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-zinc-900">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
        {sub && <p className="text-xs text-emerald-600 font-semibold">{sub}</p>}
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set("status", statusFilter)
    setLoading(true)
    fetch(`/api/payments?${params}`)
      .then(r => r.json())
      .then(j => {
        setTransactions(j.data)
        setLoading(false)
      })
  }, [statusFilter])

  // Derived stats
  const totalRevenue  = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0)
  const pendingCount  = transactions.filter(t => t.status === "pending").length
  const refundedAmt   = transactions.filter(t => t.status === "refunded").reduce((s, t) => s + (t.refundAmount ?? t.amount), 0)
  const totalCount    = transactions.length

  // Revenue by category
  const byCategory = transactions
    .filter(t => t.status === "completed")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})

  const chartData = Object.entries(byCategory).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount,
    fill: CATEGORY_COLORS[category as ProgramCategory] ?? "#003087",
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Payments</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Transaction ledger and payment processing</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={DollarSign}   label="Collected"       value={`$${totalRevenue.toLocaleString()}`} color="bg-emerald-500" />
        <StatCard icon={AlertCircle}  label="Pending"         value={String(pendingCount)}                color="bg-amber-500"  />
        <StatCard icon={RotateCcw}    label="Refunded"        value={`$${refundedAmt.toLocaleString()}`} color="bg-zinc-500"   />
        <StatCard icon={TrendingUp}   label="Total Txns"      value={String(totalCount)}                 color="bg-[#003087]"  />
      </div>

      {/* Revenue by category chart */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Revenue by Category</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                formatter={(v) => typeof v === "number" ? [`$${v}`, "Revenue"] : [String(v), "Revenue"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-zinc-400 text-sm">
            No completed transactions
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="partial">Partial</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>
      </div>

      {/* Transaction table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">TXN ID</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Patron</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Program</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Method</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-zinc-100 animate-pulse" style={{ width: "80%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-zinc-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{t.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">{t.patronName}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="text-sm text-zinc-700 truncate">{t.programName}</p>
                      <p className="text-xs text-zinc-400 capitalize">{t.category}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600">
                      {t.method}{t.last4 ? ` ••${t.last4}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "font-bold",
                        t.amount === 0 ? "text-emerald-600 text-xs" : "text-zinc-900"
                      )}>
                        {t.amount === 0 ? "FREE" : `$${t.amount}`}
                      </span>
                      {t.refundAmount && (
                        <p className="text-xs text-red-500">−${t.refundAmount} refunded</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        STATUS_STYLES[t.status]?.bg ?? "bg-zinc-100",
                        STATUS_STYLES[t.status]?.text ?? "text-zinc-600"
                      )}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {t.processedAt
                        ? new Date(t.processedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && transactions.length > 0 && (
          <div className="border-t border-zinc-100 px-4 py-3 text-xs text-zinc-400">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
            {statusFilter === "completed" && ` · $${totalRevenue.toLocaleString()} total collected`}
          </div>
        )}
      </div>
    </div>
  )
}
