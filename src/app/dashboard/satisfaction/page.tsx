"use client"

import { useState } from "react"
import SatisfactionTable from "@/components/dashboard/SatisfactionTable"
import CSATResponseComposer from "@/components/dashboard/CSATResponseComposer"
import ActionPanel from "@/components/dashboard/ActionPanel"
import { Star, TrendingDown, TrendingUp, AlertCircle, Users, MessageSquare, Activity } from "lucide-react"
import type { Action } from "@/types"

// Programs needing attention (CSAT < 4.0)
const ATTENTION_PROGRAMS = [
  { id: "21-area-pool",       name: "21 Area Pool",         csat: 3.7, trend: -4.2, issue: "Inconsistent hours, facility aging" },
  { id: "fc-mcas",            name: "Fitness Center – MCAS", csat: 3.8, trend: -1.8, issue: "Equipment maintenance backlog" },
  { id: "leatherneck-cafe",   name: "Leatherneck Café",      csat: 3.9, trend: -0.9, issue: "Limited menu, slow service" },
]

// Re-engagement action (Layer 2)
const REENGAGEMENT_ACTION: Action = {
  id: "action-warr-expansion",
  title: "Patron Re-engagement — Lapsed Users",
  summary: "4,200 patrons active 90 days ago have not returned. Win-back campaign targeting lapsed patrons with personalized offers and program highlights.",
  impact: "medium",
  category: "fitness",
  estimatedPatrons: 1200,
  estimatedRevenue: 57000,
  steps: [
    { id: "s1", label: "Segment lapsed patron list by program history", owner: "MCCS Analytics",     estimatedTime: "2 hours" },
    { id: "s2", label: "Design personalized 'We miss you' message",      owner: "MCCS Marketing",     estimatedTime: "3 hours" },
    { id: "s3", label: "Offer MCCS Discovery Day — 3 free programs",    owner: "Program Directors",  estimatedTime: "1 day"  },
    { id: "s4", label: "Send via app push + email, track conversion",   owner: "IT / App Team",      estimatedTime: "30 min" },
  ],
  status: "pending",
  createdAt: "2026-05-25T08:00:00Z",
}

export default function SatisfactionPage() {
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerProgram, setComposerProgram] = useState<string | undefined>(undefined)
  const [reengageOpen, setReengageOpen] = useState(false)

  function openComposer(program?: string) {
    setComposerProgram(program)
    setComposerOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Customer Satisfaction & Feedback
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Camp Pendleton · Based on patron surveys, May 2026
        </p>
      </div>

      {/* Full table */}
      <SatisfactionTable showHeader />

      {/* Spotlight cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top performer */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Top Performer</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 mb-1">ITT / Latitudes Travel Desk</p>
          <div className="flex gap-4 text-sm">
            <div><p className="text-xs text-zinc-500">CSAT</p><p className="font-mono text-2xl font-bold text-emerald-600">4.8</p></div>
            <div><p className="text-xs text-zinc-500">NPS</p><p className="font-mono text-2xl font-bold text-emerald-600">+71</p></div>
          </div>
          <p className="mt-2 text-xs text-zinc-600 italic">"Incredible discounts — savings civilians can&apos;t get"</p>
        </div>

        {/* Needs attention */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Needs Attention</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 mb-1">21 Area Pool</p>
          <div className="flex gap-4 text-sm">
            <div><p className="text-xs text-zinc-500">CSAT</p><p className="font-mono text-2xl font-bold text-red-600">3.7</p></div>
            <div><p className="text-xs text-zinc-500">NPS</p><p className="font-mono text-2xl font-bold text-amber-600">+4</p></div>
            <div><p className="text-xs text-zinc-500">Trend</p><p className="font-mono text-2xl font-bold text-red-600">−4.2</p></div>
          </div>
          <p className="mt-2 text-xs text-zinc-600 italic">"Pool hours inconsistent, facility showing age"</p>
          <button
            onClick={() => openComposer("21 Area Pool")}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold hover:underline"
            style={{ color: "#C8102E" }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Compose Patron Outreach →
          </button>
        </div>
      </div>

      {/* ── CSAT Action Center ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-bold text-zinc-900">CSAT Action Center</h2>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 ml-auto">
            {ATTENTION_PROGRAMS.length} programs below 4.0
          </span>
        </div>
        <div className="divide-y divide-zinc-50">
          {ATTENTION_PROGRAMS.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-4 gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-zinc-900">{p.name}</p>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-red-600">{p.csat}</span>
                  </div>
                  <span className="text-xs text-red-500 font-medium">▼ {p.trend}%</span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{p.issue}</p>
              </div>
              <button
                onClick={() => openComposer(p.name)}
                className="shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50"
                style={{ color: "#003087", borderColor: "#003087" }}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Compose Outreach →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Patron Engagement Score ────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-bold text-zinc-900">Patron Engagement Health</h2>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ml-auto">
            72 / 100 — Good
          </span>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl bg-zinc-50 p-4 text-center">
            <p className="text-xs text-zinc-500 mb-1">Retention Rate</p>
            <p className="text-2xl font-bold text-zinc-900">78<span className="text-sm font-normal">%</span></p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-600">+2.1%</span>
            </div>
          </div>
          <div className="rounded-xl bg-zinc-50 p-4 text-center">
            <p className="text-xs text-zinc-500 mb-1">Avg Visits / Mo</p>
            <p className="text-2xl font-bold text-zinc-900">2.3</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-600">+0.2</span>
            </div>
          </div>
          <div className="rounded-xl bg-zinc-50 p-4 text-center">
            <p className="text-xs text-zinc-500 mb-1">Net Promoter Score</p>
            <p className="text-2xl font-bold text-zinc-900">+42</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              <TrendingDown className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] text-amber-600">−3</span>
            </div>
          </div>
        </div>

        {/* At-risk patrons */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">4,200 At-Risk Patrons</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Visited within 90 days but have not returned. High win-back potential.
              </p>
            </div>
          </div>
          <button
            onClick={() => setReengageOpen(true)}
            className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C8102E" }}
          >
            Launch Campaign →
          </button>
        </div>
      </div>

      {/* Modals */}
      <CSATResponseComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultProgram={composerProgram}
      />

      <ActionPanel
        action={REENGAGEMENT_ACTION}
        open={reengageOpen}
        onClose={() => setReengageOpen(false)}
        onExecute={() => setReengageOpen(false)}
        onDismiss={() => setReengageOpen(false)}
      />
    </div>
  )
}
