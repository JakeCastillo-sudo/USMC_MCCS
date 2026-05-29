"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlayCircle, X, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    num: 1,
    title: "Landing Page",
    description:
      "Start here. Two roles: Marine/Family or MCCS Leadership. StormBreaker badge establishes deployment credibility.",
    href: "/",
  },
  {
    num: 2,
    title: "Patron Portal Home",
    description:
      "A Marine's spouse needs childcare and wants to book a gym class. One app, not five websites.",
    href: "/resident",
  },
  {
    num: 3,
    title: "Childcare Urgency",
    description:
      "The waitlist problem is real. 187 families at CDC-1 Mainside. The platform surfaces this instantly.",
    href: "/resident/childcare",
  },
  {
    num: 4,
    title: "Book a Fitness Class",
    description:
      "Three taps. Select program → pick time → confirm. Done. Show the booking modal.",
    href: "/resident/fitness",
  },
  {
    num: 5,
    title: "Switch to Leadership",
    description: "Now flip to the command view. Same data, different lens.",
    href: "/dashboard",
  },
  {
    num: 6,
    title: "KPI Bar & Revenue",
    description:
      "$4.2M monthly, 4.3 CSAT, 78% utilization. Revenue up 8.3% YoY. In one glance.",
    href: "/dashboard/revenue",
  },
  {
    num: 7,
    title: "Alerts Feed",
    description:
      "CDC waitlist is flagged automatically. Leadership doesn't need to go looking for problems.",
    href: "/dashboard",
  },
  {
    num: 8,
    title: "Enterprise Vision",
    description:
      "Scroll to the installation table. Pendleton is live. 14 installations are ready to onboard.",
    href: "/dashboard",
  },
  {
    num: 9,
    title: "StormBreaker Close",
    description:
      "This runs on StormBreaker. No new ATO. Kaizen deploys into infrastructure MCCS already certified.",
    href: "/",
  },
]

export default function DemoGuide() {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const router = useRouter()

  function goToStep(step: (typeof STEPS)[number]) {
    setCompleted((prev) => new Set([...prev, currentStep]))
    setCurrentStep(step.num)
    router.push(step.href)
  }

  function prev() {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  function next() {
    if (currentStep < STEPS.length) {
      setCompleted((prev) => new Set([...prev, currentStep]))
      setCurrentStep(currentStep + 1)
    }
  }

  const activeStep = STEPS[currentStep - 1]

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulsing ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: "#C8102E" }} />
        )}
        <button
          onClick={() => setOpen(!open)}
          className="relative flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#C8102E" }}
          aria-label="Toggle demo guide"
        >
          <PlayCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Demo Guide</span>
        </button>
      </div>

      {/* Side panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-80 max-w-[calc(100vw-2rem)] bg-white shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100" style={{ backgroundColor: "#003087" }}>
          <div className="flex items-center justify-between mb-0.5">
            <h2 className="text-base font-bold text-white">Demo Walkthrough</h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-blue-200 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-blue-200">Kaizen Labs · MCCS Camp Pendleton</p>
          <p className="text-xs text-blue-300/70 mt-1">
            Step {currentStep} of {STEPS.length}
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-1 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70 transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
          {STEPS.map((step) => {
            const isActive = step.num === currentStep
            const isDone = completed.has(step.num) && !isActive

            return (
              <div
                key={step.num}
                className={cn(
                  "rounded-xl border p-3 transition-all cursor-pointer",
                  isActive
                    ? "border-red-200 bg-red-50 border-l-4"
                    : isDone
                      ? "border-zinc-100 bg-zinc-50 opacity-60"
                      : "border-zinc-100 bg-white hover:bg-zinc-50"
                )}
                style={isActive ? { borderLeftColor: "#C8102E" } : {}}
                onClick={() => goToStep(step)}
              >
                <div className="flex items-start gap-2.5">
                  {/* Step number / check */}
                  <div
                    className={cn(
                      "shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                      isActive
                        ? "text-white"
                        : isDone
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-zinc-100 text-zinc-500"
                    )}
                    style={isActive ? { backgroundColor: "#C8102E" } : {}}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : step.num}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs font-semibold mb-0.5",
                        isActive ? "text-[#C8102E]" : isDone ? "text-zinc-400" : "text-zinc-800"
                      )}
                    >
                      {step.title}
                    </p>
                    {isActive && (
                      <p className="text-xs text-zinc-600 leading-relaxed">{step.description}</p>
                    )}
                  </div>

                  {/* Go to step arrow */}
                  <ArrowRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 mt-1",
                      isActive ? "text-[#C8102E]" : "text-zinc-300"
                    )}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Active step description (visible at bottom for non-active expanded) */}
        {activeStep && (
          <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-xs font-semibold text-zinc-500 mb-1">Current talking point</p>
            <p className="text-xs text-zinc-700 leading-relaxed">{activeStep.description}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="px-4 py-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-all disabled:opacity-40 hover:bg-zinc-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={next}
            disabled={currentStep === STEPS.length}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: "#C8102E" }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
