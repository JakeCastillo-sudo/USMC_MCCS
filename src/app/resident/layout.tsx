import NavBar from "@/components/layout/NavBar"
import ResidentNavBar from "@/components/resident/ResidentNavBar"

export const metadata = {
  title: "MCCS Camp Pendleton — Patron Portal",
  description: "Find and book MCCS programs, dining, childcare, and recreation at Camp Pendleton.",
}

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar activeRole="resident" />
      <main className="pt-16 pb-20 md:pb-6 w-full">
        <div className="w-full">{children}</div>
      </main>
      <ResidentNavBar />
    </div>
  )
}
