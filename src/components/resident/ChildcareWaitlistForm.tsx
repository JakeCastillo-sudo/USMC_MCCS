"use client"

import { useState } from "react"
import {
  X, ChevronRight, ChevronLeft, CheckCircle2,
  Baby, User, Heart, ClipboardList, Shield,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/hooks/useProfile"

interface Props {
  open: boolean
  onClose: () => void
  preselectedCDC?: string
}

type Step = 1 | 2 | 3 | 4

const CDC_OPTIONS = [
  { id: "cdc-1", name: "CDC-1 Mainside",   waitlist: 187, waitMonths: "~8 months", available: false, highlight: false },
  { id: "cdc-2", name: "CDC-2 Las Pulgas", waitlist: 43,  waitMonths: "~3 months", available: false, highlight: false },
  { id: "cdc-3", name: "CDC-3 San Onofre", waitlist: 0,   waitMonths: "~6 weeks",  available: true,  highlight: true  },
]

const SUPPORT_NEEDS = [
  "Physical/mobility accommodations",
  "Speech and language therapy",
  "Occupational therapy",
  "Behavioral support",
  "Hearing/visual impairment support",
  "Medical condition management",
  "Dietary restrictions or allergies",
]

const ALLERGY_OPTIONS = ["None", "Food", "Environmental", "Medication", "Other"]
const DIETARY_OPTIONS = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Other"]

function StepIndicator({ step, current }: { step: Step; current: Step }) {
  const done = current > step
  const active = current === step
  return (
    <div className={cn(
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
      done   ? "bg-emerald-500 text-white" :
      active ? "text-white"                : "bg-zinc-100 text-zinc-400",
    )}
    style={active ? { backgroundColor: "#003087" } : {}}>
      {done ? <CheckCircle2 className="h-4 w-4" /> : step}
    </div>
  )
}

export default function ChildcareWaitlistForm({ open, onClose, preselectedCDC }: Props) {
  const profile  = useProfile()
  const children = profile.dependents.filter(d => d.relationship === "Child" && d.age <= 5)

  const [step, setStep] = useState<Step>(1)

  // Step 1 state
  const [selectedCDC, setSelectedCDC] = useState(preselectedCDC ?? "")
  const [useExistingChild, setUseExistingChild] = useState(children.length > 0)
  const [selectedChildId, setSelectedChildId]   = useState(children[0]?.id ?? "")
  const [childFirstName, setChildFirstName]     = useState("")
  const [childLastName, setChildLastName]       = useState("")
  const [childDOB, setChildDOB]                 = useState("")
  const [careType, setCareType]                 = useState("full-day")
  const [partDays, setPartDays]                 = useState<string[]>([])
  const [startDate, setStartDate]               = useState("")
  const [flexibleStart, setFlexibleStart]       = useState(false)

  // Step 2 state
  const [workSchedule, setWorkSchedule]         = useState("standard")
  const [deployedReturn, setDeployedReturn]     = useState("")
  const [spouseEmployed, setSpouseEmployed]     = useState(false)

  // Step 3 state
  const [efmpEnrolled, setEfmpEnrolled]         = useState<"yes" | "no" | "not-sure">("no")
  const [efmpNumber, setEfmpNumber]             = useState("")
  const [supportNeeds, setSupportNeeds]         = useState<string[]>([])
  const [supportDescription, setSupportDescription] = useState("")
  const [hasIEP, setHasIEP]                     = useState(false)
  const [hasTherapy, setHasTherapy]             = useState(false)
  const [therapyTypes, setTherapyTypes]         = useState("")
  const [emergencyMedical, setEmergencyMedical] = useState("")
  const [hasMedications, setHasMedications]     = useState(false)
  const [medicationDetails, setMedicationDetails] = useState("")
  const [allergies, setAllergies]               = useState<string[]>(["None"])
  const [dietary, setDietary]                   = useState<string[]>(["None"])
  const [immunizationsUpToDate, setImmunizationsUpToDate] = useState<"yes" | "no" | "not-sure">("yes")

  // Step 4 state
  const [notifyEmail, setNotifyEmail]           = useState(true)
  const [notifySMS, setNotifySMS]               = useState(true)
  const [waitTimeUpdates, setWaitTimeUpdates]   = useState(true)
  const [ack1, setAck1] = useState(false)
  const [ack2, setAck2] = useState(false)
  const [ack3, setAck3] = useState(false)
  const [ack4, setAck4] = useState(false)
  const [ackEFMP, setAckEFMP] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const cdcObj   = CDC_OPTIONS.find(c => c.id === selectedCDC)
  const childObj = children.find(c => c.id === selectedChildId)

  const allAcksChecked = ack1 && ack2 && ack3 && ack4 && (efmpEnrolled !== "yes" || ackEFMP)
  const canSubmit = allAcksChecked && selectedCDC

  function toggleMultiSelect(arr: string[], val: string, setArr: (v: string[]) => void) {
    if (val === "None") { setArr(["None"]); return }
    const next = arr.filter(v => v !== "None")
    setArr(next.includes(val) ? next.filter(v => v !== val) : [...next, val])
  }

  function toggleSupportNeed(need: string) {
    setSupportNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need])
  }

  const STEPS = [
    { label: "Program",   icon: Baby     },
    { label: "Sponsor",   icon: User     },
    { label: "Health",    icon: Heart    },
    { label: "Review",    icon: ClipboardList },
  ]

  const confirmNum = `WL-${selectedCDC.toUpperCase().replace("-", "")}-2026-${String(188 + Math.floor(Math.random() * 3)).padStart(4, "0")}`

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex flex-col bg-white max-w-lg mx-auto sm:inset-y-4 sm:inset-x-auto sm:rounded-2xl sm:shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0" style={{ backgroundColor: "#003087" }}>
          <div>
            <h2 className="text-base font-bold text-white">Childcare Waitlist Registration</h2>
            <p className="text-xs text-blue-200 mt-0.5">MCCS Camp Pendleton</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        {!submitted && (
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 bg-zinc-50 shrink-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 flex-1">
                <StepIndicator step={(i + 1) as Step} current={step} />
                <span className={cn("text-[10px] font-semibold hidden sm:block", step === i + 1 ? "text-[#003087]" : "text-zinc-400")}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-zinc-200 ml-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {submitted ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center">
              <div className="rounded-full bg-emerald-100 p-5 mb-5">
                <CheckCircle2 className="h-14 w-14 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-1">You&apos;re on the Waitlist!</h3>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 w-full mt-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-emerald-600 font-semibold">Confirmation Number</p>
                  <p className="font-mono text-sm font-bold text-emerald-800">{confirmNum}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500">Center</p>
                  <p className="text-sm font-semibold text-zinc-800">{cdcObj?.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500">Child</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {useExistingChild && childObj ? `${childObj.firstName} ${childObj.lastName}` : `${childFirstName} ${childLastName}`}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500">Waitlist Position</p>
                  <p className="text-3xl font-black text-[#003087]">#188</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500">Estimated Wait</p>
                  <p className="text-sm font-semibold text-zinc-800">{cdcObj?.waitMonths}</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 w-full text-left">
                <p className="text-xs font-bold text-blue-700 mb-2">What happens next?</p>
                <ul className="space-y-1.5 text-xs text-blue-600">
                  <li className="flex items-start gap-2"><ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />Confirmation email within 24 hours to {profile.email}</li>
                  <li className="flex items-start gap-2"><ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />We&apos;ll contact you when your spot is within 30 days of opening</li>
                  <li className="flex items-start gap-2"><ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />You have 48 hours to accept an offered slot</li>
                  <li className="flex items-start gap-2"><ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />Keep contact info updated in your profile</li>
                </ul>
              </div>
              {efmpEnrolled === "yes" && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 w-full text-left">
                  <p className="text-xs font-bold text-amber-700">EFMP Coordination</p>
                  <p className="text-xs text-amber-600 mt-1">An EFMP coordinator will contact you within 5 business days to discuss your child&apos;s needs and care plan.</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-xl py-3 text-sm font-bold text-white"
                style={{ backgroundColor: "#003087" }}
              >
                Done
              </button>
            </div>
          ) : step === 1 ? (
            /* ── Step 1: Program & Child ── */
            <div className="px-5 py-5 space-y-5">
              {/* CDC selector */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-3">Select Child Development Center</p>
                <div className="space-y-2">
                  {CDC_OPTIONS.map(cdc => (
                    <button
                      key={cdc.id}
                      onClick={() => setSelectedCDC(cdc.id)}
                      className={cn(
                        "w-full text-left rounded-xl border p-4 transition-all",
                        selectedCDC === cdc.id ? "border-[#003087] bg-blue-50" : "border-zinc-200 hover:border-zinc-300",
                        cdc.highlight && "ring-1 ring-emerald-400"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm text-zinc-900">{cdc.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">Estimated wait: {cdc.waitMonths}</p>
                          {cdc.waitlist > 0 && <p className="text-xs text-red-500 mt-0.5">{cdc.waitlist} families ahead</p>}
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          {cdc.highlight && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">SHORTEST WAIT</span>}
                          {!cdc.available && !cdc.highlight && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">WAITLIST</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Child info */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-3">Child Information</p>
                {children.length > 0 && (
                  <div className="flex items-center gap-3 mb-3 rounded-lg border border-zinc-200 p-3">
                    <span className="text-xs text-zinc-600">Use existing family profile?</span>
                    <button
                      onClick={() => setUseExistingChild(!useExistingChild)}
                      className={cn("ml-auto relative inline-flex h-6 w-11 items-center rounded-full transition-colors", useExistingChild ? "bg-emerald-500" : "bg-zinc-300")}
                    >
                      <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow transition-transform", useExistingChild ? "translate-x-6" : "translate-x-1")} />
                    </button>
                  </div>
                )}
                {useExistingChild && children.length > 0 ? (
                  <div className="space-y-2">
                    {children.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedChildId(c.id)}
                        className={cn("w-full text-left rounded-xl border p-3 transition-all", selectedChildId === c.id ? "border-[#003087] bg-blue-50" : "border-zinc-200 hover:border-zinc-300")}
                      >
                        <p className="font-semibold text-sm text-zinc-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-zinc-500">Age {c.age} · DOB {c.dateOfBirth}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">First Name</label>
                        <input value={childFirstName} onChange={e => setChildFirstName(e.target.value)} placeholder="First name" className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Last Name</label>
                        <input value={childLastName} onChange={e => setChildLastName(e.target.value)} placeholder="Last name" className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Date of Birth</label>
                      <input type="date" value={childDOB} onChange={e => setChildDOB(e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
                    </div>
                  </div>
                )}
              </div>

              {/* Care schedule */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-2">Care Schedule</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { value: "full-day",  label: "Full-Time", sub: "Mon–Fri" },
                    { value: "part-day",  label: "Part-Time", sub: "Select days" },
                    { value: "hourly",    label: "Hourly",    sub: "As needed" },
                  ].map(({ value, label, sub }) => (
                    <button
                      key={value}
                      onClick={() => setCareType(value)}
                      className={cn("rounded-xl border p-3 text-center transition-all", careType === value ? "border-[#003087] bg-blue-50" : "border-zinc-200 hover:border-zinc-300")}
                    >
                      <p className="text-xs font-semibold text-zinc-900">{label}</p>
                      <p className="text-[10px] text-zinc-500">{sub}</p>
                    </button>
                  ))}
                </div>
                {careType === "part-day" && (
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map(d => (
                      <button
                        key={d}
                        onClick={() => setPartDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                        className={cn("rounded-full px-3 py-1 text-xs font-semibold transition-colors", partDays.includes(d) ? "bg-[#003087] text-white" : "bg-zinc-100 text-zinc-600")}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Requested Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={flexibleStart} onChange={e => setFlexibleStart(e.target.checked)} className="rounded" />
                    <span className="text-xs text-zinc-600">I&apos;m flexible on start date</span>
                  </label>
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* ── Step 2: Sponsor Info ── */
            <div className="px-5 py-5 space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">Your profile information has been pre-filled. Please review and update as needed.</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">First Name</label>
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.firstName}</div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Last Name</label>
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.lastName}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Rank</label>
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.rank}</div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Branch</label>
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.branch}</div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Unit / Command</label>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.unit}</div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Email</label>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.email}</div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Phone</label>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">{profile.phone}</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-2">Work Schedule</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "standard",  label: "Standard", sub: "M–F 8–5" },
                    { value: "rotating",  label: "Rotating Shifts", sub: "Varies" },
                    { value: "deployed",  label: "Deployed", sub: "Currently away" },
                    { value: "other",     label: "Other", sub: "Non-standard" },
                  ].map(({ value, label, sub }) => (
                    <button
                      key={value}
                      onClick={() => setWorkSchedule(value)}
                      className={cn("rounded-xl border p-3 text-left transition-all", workSchedule === value ? "border-[#003087] bg-blue-50" : "border-zinc-200 hover:border-zinc-300")}
                    >
                      <p className="text-xs font-semibold text-zinc-900">{label}</p>
                      <p className="text-[10px] text-zinc-500">{sub}</p>
                    </button>
                  ))}
                </div>
                {workSchedule === "deployed" && (
                  <div className="mt-3">
                    <label className="text-xs text-zinc-500 mb-1 block">Expected Return Date</label>
                    <input type="date" value={deployedReturn} onChange={e => setDeployedReturn(e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={spouseEmployed} onChange={e => setSpouseEmployed(e.target.checked)} className="rounded" />
                  <span className="text-sm text-zinc-700">Spouse/co-parent is also employed on base</span>
                </label>
              </div>
            </div>
          ) : step === 3 ? (
            /* ── Step 3: Special Needs & EFMP ── */
            <div className="px-5 py-5 space-y-5">
              {/* Info box */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-800 mb-1">Confidential Information</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    MCCS is committed to serving ALL children, including those with special needs. This information is kept strictly confidential and used only to prepare appropriate care and accommodations.
                  </p>
                </div>
              </div>

              {/* EFMP question */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-2">Is your child enrolled in EFMP?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "yes",      label: "Yes" },
                    { value: "no",       label: "No" },
                    { value: "not-sure", label: "Not sure" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setEfmpEnrolled(value as "yes" | "no" | "not-sure")}
                      className={cn("rounded-xl border py-3 text-sm font-semibold transition-all", efmpEnrolled === value ? "border-[#003087] bg-blue-50 text-[#003087]" : "border-zinc-200 text-zinc-600 hover:border-zinc-300")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {efmpEnrolled === "yes" && (
                <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold text-amber-800">EFMP Details</p>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">EFMP Enrollment Number (if known)</label>
                    <input value={efmpNumber} onChange={e => setEfmpNumber(e.target.value)} placeholder="Optional" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-700 mb-2">Types of support needed (select all):</p>
                    <div className="space-y-1.5">
                      {SUPPORT_NEEDS.map(need => (
                        <label key={need} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={supportNeeds.includes(need)} onChange={() => toggleSupportNeed(need)} className="rounded" />
                          <span className="text-xs text-zinc-700">{need}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={supportNeeds.includes("Other")} onChange={() => toggleSupportNeed("Other")} className="rounded" />
                        <span className="text-xs text-zinc-700">Other</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Please describe your child&apos;s needs and current accommodations:</label>
                    <textarea rows={3} value={supportDescription} onChange={e => setSupportDescription(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasIEP} onChange={e => setHasIEP(e.target.checked)} className="rounded mt-0.5" />
                      <span className="text-xs text-zinc-700">My child has an IEP or IFSP (Individual Education/Family Service Plan)</span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasTherapy} onChange={e => setHasTherapy(e.target.checked)} className="rounded mt-0.5" />
                      <span className="text-xs text-zinc-700">My child currently receives therapy services</span>
                    </label>
                  </div>
                  {hasTherapy && (
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Therapy type(s) and frequency:</label>
                      <input value={therapyTypes} onChange={e => setTherapyTypes(e.target.value)} placeholder="e.g. Speech therapy 2x/week, OT 1x/week" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Emergency medical protocols (if applicable):</label>
                    <textarea rows={2} value={emergencyMedical} onChange={e => setEmergencyMedical(e.target.value)} placeholder="Describe any medical conditions requiring emergency protocols" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={hasMedications} onChange={e => setHasMedications(e.target.checked)} className="rounded" />
                      <span className="text-xs text-zinc-700">My child takes daily medications</span>
                    </label>
                    {hasMedications && (
                      <input value={medicationDetails} onChange={e => setMedicationDetails(e.target.value)} placeholder="Medication name, dosage, schedule" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none" />
                    )}
                  </div>
                </div>
              )}

              {/* General health (non-EFMP) */}
              {efmpEnrolled !== "yes" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 mb-2">Allergies (select all that apply):</p>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGY_OPTIONS.map(a => (
                        <button
                          key={a}
                          onClick={() => toggleMultiSelect(allergies, a, setAllergies)}
                          className={cn("rounded-full px-3 py-1 text-xs font-semibold transition-colors", allergies.includes(a) ? "bg-[#003087] text-white" : "bg-zinc-100 text-zinc-600")}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 mb-2">Dietary restrictions:</p>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map(d => (
                        <button
                          key={d}
                          onClick={() => toggleMultiSelect(dietary, d, setDietary)}
                          className={cn("rounded-full px-3 py-1 text-xs font-semibold transition-colors", dietary.includes(d) ? "bg-[#003087] text-white" : "bg-zinc-100 text-zinc-600")}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Immunizations */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-2">Are immunizations up to date?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "yes",      label: "Yes" },
                    { value: "no",       label: "No" },
                    { value: "not-sure", label: "Not sure" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setImmunizationsUpToDate(value as "yes" | "no" | "not-sure")}
                      className={cn("rounded-xl border py-2.5 text-xs font-semibold transition-all", immunizationsUpToDate === value ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-zinc-200 text-zinc-600")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 mt-2">Immunization records are required at enrollment.</p>
              </div>
            </div>
          ) : (
            /* ── Step 4: Review & Submit ── */
            <div className="px-5 py-5 space-y-5">
              {/* Summary card */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Registration Summary</p>
                {[
                  { label: "Center",      value: cdcObj?.name ?? "" },
                  { label: "Est. Wait",   value: cdcObj?.waitMonths ?? "" },
                  { label: "Child",       value: useExistingChild && childObj ? `${childObj.firstName} ${childObj.lastName}` : `${childFirstName} ${childLastName}` },
                  { label: "Care Type",   value: careType === "full-day" ? "Full-Time (Mon–Fri)" : careType === "part-day" ? `Part-Time (${partDays.join(", ")})` : "Hourly" },
                  { label: "Sponsor",     value: `${profile.rank} ${profile.firstName} ${profile.lastName}` },
                  { label: "Contact",     value: profile.email },
                  { label: "EFMP",        value: efmpEnrolled === "yes" ? "EFMP support requested" : "N/A" },
                ].map(({ label, value }) => value ? (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="text-xs font-semibold text-zinc-800 text-right max-w-[60%]">{value}</p>
                  </div>
                ) : null)}
              </div>

              {/* Notification prefs */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-2">Notification Preferences</p>
                <div className="space-y-2">
                  {[
                    { label: `Email — ${profile.email}`,  checked: notifyEmail,     set: setNotifyEmail     },
                    { label: `SMS — ${profile.phone}`,    checked: notifySMS,       set: setNotifySMS       },
                    { label: "Wait time change alerts",    checked: waitTimeUpdates, set: setWaitTimeUpdates },
                  ].map(({ label, checked, set }) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={e => set(e.target.checked)} className="rounded" />
                      <span className="text-xs text-zinc-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Acknowledgments */}
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-3">Required Acknowledgments</p>
                <div className="space-y-3">
                  {[
                    { checked: ack1, set: setAck1, label: "I understand this is a waitlist registration and does not guarantee enrollment." },
                    { checked: ack2, set: setAck2, label: "I agree to provide current immunization records at time of enrollment." },
                    { checked: ack3, set: setAck3, label: "I understand that fees are income-based and will be determined at enrollment." },
                    { checked: ack4, set: setAck4, label: "I consent to MCCS contacting me regarding this waitlist registration." },
                  ].map(({ checked, set, label }, i) => (
                    <label key={i} className={cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors", checked ? "border-emerald-200 bg-emerald-50" : "border-zinc-200")}>
                      <input type="checkbox" checked={checked} onChange={e => set(e.target.checked)} className="rounded mt-0.5 shrink-0" />
                      <span className="text-xs text-zinc-700 leading-relaxed">{label}</span>
                    </label>
                  ))}
                  {efmpEnrolled === "yes" && (
                    <label className={cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors", ackEFMP ? "border-emerald-200 bg-emerald-50" : "border-amber-200")}>
                      <input type="checkbox" checked={ackEFMP} onChange={e => setAckEFMP(e.target.checked)} className="rounded mt-0.5 shrink-0" />
                      <span className="text-xs text-zinc-700 leading-relaxed">I authorize MCCS to coordinate with the EFMP office regarding my child&apos;s needs.</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="px-5 py-4 border-t border-zinc-100 shrink-0">
            {step < 4 ? (
              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => (s - 1) as Step)}
                    className="flex items-center gap-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                )}
                <button
                  onClick={() => setStep(s => (s + 1) as Step)}
                  disabled={step === 1 && !selectedCDC}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#003087" }}
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                disabled={!canSubmit}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "#C8102E" }}
              >
                Join Waitlist — {cdcObj?.name}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
