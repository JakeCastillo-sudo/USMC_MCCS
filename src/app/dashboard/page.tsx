import KPIBar from "@/components/dashboard/KPIBar"
import RevenueChart from "@/components/dashboard/RevenueChart"
import AlertsFeed from "@/components/dashboard/AlertsFeed"
import ReinvestmentTracker from "@/components/dashboard/ReinvestmentTracker"
import SatisfactionTable from "@/components/dashboard/SatisfactionTable"
import UtilizationGrid from "@/components/dashboard/UtilizationGrid"
import InstallationTable from "@/components/dashboard/InstallationTable"
import StormBreakerBadge from "@/components/shared/StormBreakerBadge"
import Link from "next/link"
import { TrendingUp, Sparkles, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          MCCS Command Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Camp Pendleton · Live operational view · May 2026
        </p>
      </div>

      {/* 1. KPI Bar */}
      <KPIBar />

      {/* 2. Revenue + Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart view="monthly" />
        </div>
        <div className="lg:col-span-1">
          <AlertsFeed limit={6} />
        </div>
      </div>

      {/* 3. Reinvestment Tracker */}
      <ReinvestmentTracker />

      {/* 4. Satisfaction + Utilization */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-700">Satisfaction Overview</h2>
            <Link
              href="/dashboard/satisfaction"
              className="text-xs font-medium hover:underline"
              style={{ color: "#C8102E" }}
            >
              See full report →
            </Link>
          </div>
          <SatisfactionTable limit={5} showHeader />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-700">Facility Utilization</h2>
            <Link
              href="/dashboard/utilization"
              className="text-xs font-medium hover:underline"
              style={{ color: "#C8102E" }}
            >
              See all facilities →
            </Link>
          </div>
          <UtilizationGrid limit={6} />
        </div>
      </div>

      {/* 4b. Forecast Preview */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-100 p-2.5 shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-blue-900">Forecast Alert</h3>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Action Required</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                <span className="font-semibold">Del Mar Beach Cottages</span> predicted at{" "}
                <span className="font-bold text-red-600">100% capacity Jun 15 through Aug 31.</span>{" "}
                Summer surge confirmed — expand reservations or add overflow capacity now.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[10px] text-blue-500">Kaizen Predict · 93% confidence</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[10px] text-amber-600">21 days until summer peak</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/forecast"
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#003087" }}
          >
            View Full Forecast →
          </Link>
        </div>
      </div>

      {/* 5. Platform info + Enterprise installation table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InstallationTable />
        </div>
        <div className="space-y-4">
          <StormBreakerBadge size="md" variant="light" />
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-zinc-700 text-sm">About this Demo</p>
            <p>Data is synthetic but internally consistent, built from real Camp Pendleton MCCS programs sourced from pendleton.usmc-mccs.org.</p>
            <p className="pt-1">Prepared for Kaizen Labs · Head of Federal interview · May 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
