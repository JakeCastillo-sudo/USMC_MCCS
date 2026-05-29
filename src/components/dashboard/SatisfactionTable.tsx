"use client"

import { useEffect, useState, useCallback } from "react"
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { SatisfactionEntry, ProgramCategory } from "@/types"
import { categoryLabel, formatCsat } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface SatisfactionTableProps {
  limit?: number       // show only top N rows; undefined = all
  showHeader?: boolean // show overall stat pills
}

type SortKey = "csatScore" | "npsScore" | "responseCount" | "trend"

function csatColor(score: number) {
  if (score >= 4.3) return "text-emerald-600"
  if (score >= 3.8) return "text-amber-600"
  return "text-red-600"
}

function npsColor(score: number) {
  if (score >= 30) return "text-emerald-600"
  if (score >= 0)  return "text-amber-600"
  return "text-red-600"
}

function categoryBadgeStyle(cat: ProgramCategory): string {
  const map: Record<ProgramCategory, string> = {
    fitness: "bg-red-50 text-red-700",
    childcare: "bg-blue-50 text-blue-700",
    dining: "bg-amber-50 text-amber-700",
    recreation: "bg-emerald-50 text-emerald-700",
    retail: "bg-violet-50 text-violet-700",
    lodging: "bg-cyan-50 text-cyan-700",
    "family-support": "bg-orange-50 text-orange-700",
    education: "bg-slate-50 text-slate-700",
  }
  return map[cat] ?? "bg-zinc-100 text-zinc-600"
}

interface MetaSummary {
  overallCsat: number
  overallNps: number
  totalResponses: number
}

export default function SatisfactionTable({
  limit,
  showHeader = true,
}: SatisfactionTableProps) {
  const [entries, setEntries] = useState<SatisfactionEntry[]>([])
  const [meta, setMeta] = useState<MetaSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showAll, setShowAll] = useState(!limit)
  const [sortKey, setSortKey] = useState<SortKey>("csatScore")
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    fetch("/api/satisfaction?sort=csat_desc")
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.data as SatisfactionEntry[])
        setMeta(d.meta as MetaSummary)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) setSortAsc((v) => !v)
      else { setSortKey(key); setSortAsc(false) }
    },
    [sortKey]
  )

  const sorted = [...entries].sort((a, b) => {
    const diff = (a[sortKey] as number) - (b[sortKey] as number)
    return sortAsc ? diff : -diff
  })

  const displayed = !showAll && limit ? sorted.slice(0, limit) : sorted

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown className="ml-1 inline h-3 w-3 text-zinc-300" />
    return sortAsc
      ? <ChevronUp className="ml-1 inline h-3 w-3 text-zinc-500" />
      : <ChevronDown className="ml-1 inline h-3 w-3 text-zinc-500" />
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          {[1,2,3].map((i) => <Skeleton key={i} className="h-8 w-36 rounded-full" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load satisfaction data. Please refresh.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {showHeader && meta && (
        <div className="flex flex-wrap gap-2 border-b border-zinc-100 px-5 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Overall CSAT: {formatCsat(meta.overallCsat)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Overall NPS: +{meta.overallNps}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
            {meta.totalResponses.toLocaleString()} responses
          </span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-100 bg-zinc-50">
            <TableHead className="w-48 text-xs">Program</TableHead>
            <TableHead className="text-xs">Category</TableHead>
            <TableHead
              className="cursor-pointer text-xs"
              onClick={() => handleSort("csatScore")}
            >
              CSAT<SortIcon k="csatScore" />
            </TableHead>
            <TableHead
              className="cursor-pointer text-xs"
              onClick={() => handleSort("npsScore")}
            >
              NPS<SortIcon k="npsScore" />
            </TableHead>
            <TableHead
              className="cursor-pointer text-xs"
              onClick={() => handleSort("responseCount")}
            >
              Responses<SortIcon k="responseCount" />
            </TableHead>
            <TableHead className="hidden lg:table-cell text-xs">Top Positive</TableHead>
            <TableHead className="hidden lg:table-cell text-xs">Top Negative</TableHead>
            <TableHead
              className="cursor-pointer text-xs"
              onClick={() => handleSort("trend")}
            >
              Trend<SortIcon k="trend" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayed.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center text-zinc-400">
                No results found for this filter.
              </TableCell>
            </TableRow>
          ) : (
            displayed.map((entry) => (
              <TableRow key={entry.programId} className="border-zinc-100 hover:bg-zinc-50">
                <TableCell className="font-medium text-sm text-zinc-900 py-3">
                  {entry.programName}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      categoryBadgeStyle(entry.category as ProgramCategory)
                    )}
                  >
                    {categoryLabel(entry.category as ProgramCategory)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn("font-mono text-sm font-semibold", csatColor(entry.csatScore))}>
                    {entry.csatScore.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn("font-mono text-sm font-semibold", npsColor(entry.npsScore))}>
                    {entry.npsScore >= 0 ? "+" : ""}{entry.npsScore}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-zinc-600">
                  {entry.responseCount.toLocaleString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-xs">
                  <p className="truncate text-xs italic text-zinc-500">{entry.topPositive}</p>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-xs">
                  <p className="truncate text-xs italic text-zinc-500">{entry.topNegative}</p>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-semibold",
                      entry.trend >= 0 ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {entry.trend >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(entry.trend).toFixed(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {limit && entries.length > limit && (
        <div className="border-t border-zinc-100 px-5 py-3 text-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-medium text-[#C8102E] hover:underline"
          >
            {showAll ? "Show less ↑" : `Show all ${entries.length} programs ↓`}
          </button>
        </div>
      )}
    </div>
  )
}
