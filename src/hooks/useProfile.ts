// Returns the hardcoded demo patron profile (SSgt Jacob Martinez).
// In production this would fetch from an auth-gated API using the logged-in user's session.

import type { Patron } from "@/types"

// The demo profile — matches patron-001 in patrons.json
const DEMO_PROFILE: Patron = {
  id: "patron-001",
  firstName: "Jacob",
  lastName: "Martinez",
  rank: "SSgt",
  branch: "USMC",
  unit: "1st Marine Division, 7th Marines",
  edipi: "1234567890",
  dodId: "1234567890",
  email: "jacob.martinez@usmc.mil",
  phone: "(760) 555-0112",
  address: "1247 Basilone Rd, Camp Pendleton, CA 92055",
  dependents: [
    {
      id: "dep-001-a",
      firstName: "Maria",
      lastName: "Martinez",
      relationship: "Spouse",
      dateOfBirth: "1996-08-22",
      age: 29,
      eligibilityGroups: ["Active Duty Dependent", "Spouse"],
    },
    {
      id: "dep-001-b",
      firstName: "Lucas",
      lastName: "Martinez",
      relationship: "Child",
      dateOfBirth: "2019-11-05",
      age: 6,
      eligibilityGroups: ["Active Duty Dependent", "Child"],
    },
    {
      id: "dep-001-c",
      firstName: "Sofia",
      lastName: "Martinez",
      relationship: "Child",
      dateOfBirth: "2022-03-14",
      age: 4,
      eligibilityGroups: ["Active Duty Dependent", "Child"],
    },
  ],
  paymentMethods: [
    {
      id: "pm-001-a",
      type: "MCCS Pay",
      last4: "7842",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      nickname: "MCCS Wallet",
    },
    {
      id: "pm-001-b",
      type: "Visa",
      last4: "4521",
      expiryMonth: 9,
      expiryYear: 2026,
      isDefault: false,
      nickname: "Personal Visa",
    },
  ],
  preferredPaymentId: "pm-001-a",
  preferences: {
    favoriteCategories: ["fitness", "childcare", "recreation"],
    preferredNotifications: ["email", "sms"],
    dietaryRestrictions: [],
    accessibilityNeeds: [],
    preferredLanguage: "en",
    marketingOptIn: true,
  },
  bookingHistory: [
    {
      reservationId: "RES-PND-001",
      programName: "Paige Field House — CrossFit",
      category: "fitness",
      date: "2026-05-20",
      amount: 0,
      status: "completed",
      csatScore: 5,
      review: "Best gym on base. Equipment is always clean.",
    },
    {
      reservationId: "RES-PND-002",
      programName: "CDC-1 — Full-Day Childcare",
      category: "childcare",
      date: "2026-05-19",
      amount: 320,
      status: "completed",
      csatScore: 4,
    },
    {
      reservationId: "RES-PND-003",
      programName: "Marine Memorial Golf — Tee Time",
      category: "recreation",
      date: "2026-05-10",
      amount: 28,
      status: "completed",
      csatScore: 5,
    },
    {
      reservationId: "RES-PND-010",
      programName: "Paige Field House — Yoga",
      category: "fitness",
      date: "2026-05-22",
      amount: 0,
      status: "confirmed",
    },
  ],
  totalBookings: 24,
  totalSpend: 1840,
  memberSince: "2023-02-15",
  lastActivity: "2026-05-22",
  loyaltyTier: "Elite",
  csatAvg: 4.7,
  eligibilityGroups: ["Active Duty", "E-1 through E-9"],
  eligibilityVerified: true,
  eligibilityExpiry: "2027-02-15",
}

export function useProfile(): Patron {
  return DEMO_PROFILE
}
