import KPIBar from "@/components/dashboard/KPIBar"
import RevenueChart from "@/components/dashboard/RevenueChart"
import AlertsFeed from "@/components/dashboard/AlertsFeed"
import ReinvestmentTracker from "@/components/dashboard/ReinvestmentTracker"
import SatisfactionTable from "@/components/dashboard/SatisfactionTable"
import UtilizationGrid from "@/components/dashboard/UtilizationGrid"
import InstallationTable from "@/components/dashboard/InstallationTable"
import Link from "next/link"

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

      {/* 5. Enterprise installation table */}
      <InstallationTable />
    </div>
  )
}
