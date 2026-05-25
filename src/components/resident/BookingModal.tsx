"use client"

import { useState, useMemo } from "react"
import { CheckCircle2, ChevronLeft, CalendarDays, CreditCard } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Program } from "@/types"

interface BookingModalProps {
  program: Program | null
  open: boolean
  onClose: () => void
}

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function getNext7Days() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

function generateTimeSlots() {
  const slots: { time: string; full: boolean }[] = []
  const fullSet = new Set([2, 5, 8]) // indices that are "full"
  for (let h = 6; h <= 20; h++) {
    const label = h < 12
      ? `${h}:00 AM`
      : h === 12
        ? `12:00 PM`
        : `${h - 12}:00 PM`
    slots.push({ time: label, full: fullSet.has(h - 6) })
  }
  return slots
}

function randomBookingRef() {
  return `MCCS-PND-${Math.floor(100000 + Math.random() * 900000)}`
}

const TIME_SLOTS = generateTimeSlots()

export default function BookingModal({ program, open, onClose }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const bookingRef = useMemo(() => randomBookingRef(), [])

  const days = useMemo(() => getNext7Days(), [])

  function reset() {
    setStep(1)
    setSelectedDay(null)
    setSelectedTime(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  if (!program) return null

  const isFree = program.price === null || program.price === 0
  const priceLabel = isFree ? "Free" : `$${program.price?.toFixed(2)}`

  const dayLabel = selectedDay
    ? `${DAY_ABBR[selectedDay.getDay()]}, ${MONTH_ABBR[selectedDay.getMonth()]} ${selectedDay.getDate()}`
    : ""

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent onClose={handleClose}>
        {/* ── Step 1 — Select Time ── */}
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Step 1 of 3
                </span>
              </div>
              <DialogTitle>{program.name}</DialogTitle>
              <p className="text-sm text-zinc-500 mt-0.5">{program.facility}</p>
            </DialogHeader>

            <div className="px-5 py-4 space-y-5">
              {/* Date picker */}
              <div>
                <p className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Select a Date
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {days.map((d) => {
                    const isSel = selectedDay?.toDateString() === d.toDateString()
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                        className={`shrink-0 flex flex-col items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                          ${isSel
                            ? "text-white shadow-sm"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        style={isSel ? { backgroundColor: "#C8102E" } : {}}
                      >
                        <span className="text-xs">{DAY_ABBR[d.getDay()]}</span>
                        <span className="text-base font-bold">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDay && (
                <div>
                  <p className="text-sm font-semibold text-zinc-700 mb-3">Select a Time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(({ time, full }) => {
                      const isSel = selectedTime === time
                      return (
                        <button
                          key={time}
                          disabled={full}
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-xl py-2 text-sm font-medium transition-all
                            ${full
                              ? "bg-zinc-100 text-zinc-300 line-through cursor-not-allowed"
                              : isSel
                                ? "text-white shadow-sm"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                          style={isSel ? { backgroundColor: "#003087" } : {}}
                        >
                          {full ? `${time}` : time}
                          {full && <span className="block text-[10px] no-underline">Full</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <button
                disabled={!selectedDay || !selectedTime}
                onClick={() => setStep(2)}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: "#C8102E" }}
              >
                Continue →
              </button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 2 — Confirm Details ── */}
        {step === 2 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-zinc-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Step 2 of 3
                </span>
              </div>
              <DialogTitle>Confirm Your Booking</DialogTitle>
            </DialogHeader>

            <div className="px-5 py-4 space-y-4">
              {/* Booking summary */}
              <div className="rounded-xl bg-zinc-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Program</span>
                  <span className="font-semibold text-zinc-900 text-right max-w-[60%]">{program.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date</span>
                  <span className="font-semibold text-zinc-900">{dayLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Time</span>
                  <span className="font-semibold text-zinc-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-2 mt-2">
                  <span className="text-zinc-500">Total</span>
                  <span className="font-bold text-zinc-900">{priceLabel}</span>
                </div>
              </div>

              {/* Patron info */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Patron</p>
                <div className="rounded-xl border border-zinc-200 p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Name</span>
                    <span className="font-semibold">SSgt Jacob Martinez</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">ID</span>
                    <span className="font-mono text-xs">USMC-2847391</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Eligibility</span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
                      Active Duty
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              {!isFree && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Payment</p>
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 p-4 text-sm">
                    <CreditCard className="h-4 w-4 text-zinc-400" />
                    <span className="font-medium text-zinc-900">MCCS Pay</span>
                    <span className="text-zinc-400 ml-auto font-mono">···· 4521</span>
                  </div>
                </div>
              )}

              {/* Policy */}
              <p className="text-xs text-zinc-400 text-center">
                Cancel up to 24 hours before for a full refund.
              </p>
            </div>

            <DialogFooter>
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C8102E" }}
              >
                Confirm Booking →
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
              >
                Back
              </button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 3 — Confirmation ── */}
        {step === 3 && (
          <>
            <div className="px-5 pt-8 pb-4 flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-emerald-50 p-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Booking Confirmed!</h2>
                <p className="text-sm text-zinc-500 mt-1">A confirmation has been sent to your MCCS account.</p>
              </div>

              {/* Booking reference */}
              <div className="w-full rounded-xl bg-zinc-50 p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reference</span>
                  <span className="font-mono font-bold text-zinc-900">{bookingRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Program</span>
                  <span className="font-semibold text-zinc-900 text-right max-w-[60%]">{program.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date</span>
                  <span className="font-semibold text-zinc-900">{dayLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Time</span>
                  <span className="font-semibold text-zinc-900">{selectedTime}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col gap-2">
              <button
                onClick={handleClose}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: "#C8102E" }}
              >
                Done
              </button>
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 rounded-xl border py-2.5 text-sm font-medium hover:bg-zinc-50"
                  style={{ color: "#003087", borderColor: "#003087" }}
                >
                  Add to Calendar
                </button>
                <button
                  onClick={() => { reset(); }}
                  className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Book Another
                </button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
