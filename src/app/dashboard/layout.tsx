import NavBar from "@/components/layout/NavBar"
import DashboardSidebar from "@/components/layout/DashboardSidebar"

export const metadata = {
  title: "MCCS Leadership Dashboard — Camp Pendleton",
  description: "Command-level view of MCCS operations, revenue, and patron satisfaction.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar activeRole="dashboard" />
      <DashboardSidebar />
      {/* Main content: offset for fixed nav + sidebar */}
      <main className="pt-16 md:ml-60">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
