"use client"

import { useState } from "react"
import { X, Send, CheckCircle2, Users, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface CSATResponseComposerProps {
  open: boolean
  onClose: () => void
  defaultProgram?: string
}

type MessageType = "apology" | "survey" | "offer" | "invitation"
type OfferType = "guest-pass" | "discount-20" | "free-class" | "priority-booking"
type RecipientFilter = "all" | "low-csat" | "lapsed"

const PROGRAMS = [
  "21 Area Pool",
  "Paige Field House",
  "Iron Mike's",
  "CDC-1 Mainside",
  "Marine Memorial Golf Course",
  "Leatherneck Lanes",
  "Group Exercise Classes",
  "Del Mar Beach Cottages",
]

const MESSAGE_TEMPLATES: Record<MessageType, (program: string, offer?: string) => string> = {
  apology: (p) =>
    `We noticed your recent experience at ${p} may not have met our standards. We sincerely apologize for any inconvenience and want you to know that your feedback matters. We are actively working to address the issues you encountered and improve our services. As a valued MCCS patron, please reach out to us directly if there is anything we can do to make this right.`,
  survey: (p) =>
    `We value your experience at ${p} and would love to hear your thoughts. Please take 2 minutes to complete our brief satisfaction survey — your feedback directly shapes how we improve our programs. As a thank-you, completed surveys are entered into a monthly drawing for a $50 MCCS gift card.`,
  offer: (p, offer) =>
    `As a valued MCCS patron who visited ${p}, we'd like to extend a special offer as our way of saying thank you. ${offer ? `Enjoy ${offer} on your next visit.` : "A special offer is waiting for you."} This offer is valid for 30 days and can be redeemed at any MCCS facility. Show this message at the front desk or enter code MCCS2026 in the app.`,
  invitation: (p) =>
    `You're invited to experience what's new at ${p}! We've made improvements based on patron feedback and would love for you to come see the difference. Join us for our Open House event and get a complimentary tour, refreshments, and exclusive first access to our new amenities. RSVP in the MCCS app or call the facility directly.`,
}

const OFFER_LABELS: Record<OfferType, string> = {
  "guest-pass":        "one free guest pass",
  "discount-20":       "20% off your next booking",
  "free-class":        "one complimentary group fitness class",
  "priority-booking":  "priority booking access for 30 days",
}

const RECIPIENT_COUNTS: Record<RecipientFilter, number> = {
  all:       4218,
  "low-csat": 312,
  lapsed:    1847,
}

export default function CSATResponseComposer({ open, onClose, defaultProgram }: CSATResponseComposerProps) {
  const [program, setProgram] = useState(defaultProgram ?? PROGRAMS[0])
  const [messageType, setMessageType] = useState<MessageType>("apology")
  const [offer, setOffer] = useState<OfferType>("guest-pass")
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>("low-csat")
  const [sent, setSent] = useState(false)

  if (!open) return null

  const messageText = MESSAGE_TEMPLATES[messageType](
    program,
    messageType === "offer" ? OFFER_LABELS[offer] : undefined
  )
  const recipientCount = RECIPIENT_COUNTS[recipientFilter]

  function handleSend() {
    setSent(true)
  }

  function handleClose() {
    setSent(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full sm:max-w-2xl max-h-[95vh] flex flex-col bg-white sm:rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100" style={{ backgroundColor: "#003087" }}>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-200" />
            <h2 className="text-base font-bold text-white">Patron Outreach Composer</h2>
          </div>
          <button onClick={handleClose} className="rounded-full p-1 text-blue-200 hover:text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          /* Success */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="rounded-full bg-emerald-100 p-4 mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Message Sent!</h3>
            <p className="text-sm text-zinc-500">
              Your message was sent to <span className="font-bold text-zinc-800">{recipientCount.toLocaleString()} patrons</span>.
            </p>
            <p className="text-xs text-zinc-400 mt-1">Delivery reports will appear in your activity log within 1 hour.</p>
            <button
              onClick={handleClose}
              className="mt-6 rounded-xl px-6 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Program selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Program</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Message type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Message Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["apology", "survey", "offer", "invitation"] as MessageType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setMessageType(type)}
                    className={cn(
                      "rounded-xl border py-2 text-xs font-semibold capitalize transition-all",
                      messageType === type
                        ? "border-[#003087] bg-blue-50 text-[#003087]"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    {type === "offer" ? "Special Offer" : type === "invitation" ? "Event Invitation" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Offer selector (conditional) */}
            {messageType === "offer" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Offer Type</label>
                <div className="space-y-2">
                  {(Object.entries(OFFER_LABELS) as [OfferType, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setOffer(key)}
                      className={cn(
                        "w-full text-left rounded-xl border px-3 py-2.5 text-sm transition-all",
                        offer === key
                          ? "border-[#003087] bg-blue-50 font-semibold text-[#003087]"
                          : "border-zinc-100 text-zinc-600 hover:border-zinc-200"
                      )}
                    >
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Recipients</label>
              <div className="space-y-2">
                {([
                  { key: "all",       label: "All Patrons",            count: RECIPIENT_COUNTS.all },
                  { key: "low-csat",  label: "Low CSAT Respondents",   count: RECIPIENT_COUNTS["low-csat"] },
                  { key: "lapsed",    label: "Lapsed Patrons (90d)",   count: RECIPIENT_COUNTS.lapsed },
                ] as { key: RecipientFilter; label: string; count: number }[]).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setRecipientFilter(key)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all",
                      recipientFilter === key
                        ? "border-[#003087] bg-blue-50"
                        : "border-zinc-100 hover:border-zinc-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Users className={cn("h-4 w-4", recipientFilter === key ? "text-[#003087]" : "text-zinc-400")} />
                      <span className={cn("text-sm font-medium", recipientFilter === key ? "text-[#003087]" : "text-zinc-700")}>
                        {label}
                      </span>
                    </div>
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      recipientFilter === key ? "bg-[#003087] text-white" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {count.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message preview */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Message Preview</label>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm text-zinc-700 leading-relaxed">{messageText}</p>
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C8102E" }}
            >
              <Send className="h-4 w-4" />
              Send to {recipientCount.toLocaleString()} Patrons
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
