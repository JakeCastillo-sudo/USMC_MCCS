# Claude Code Prompt — Step 2: TypeScript Types & API Routes

Paste this entire prompt into Claude Code after Prompt 01 has finished generating all files in `src/data/`.

---

Reference SPEC.md in the project root. The `src/data/` JSON fixtures are now complete. Build the TypeScript types and all Next.js API routes that serve that data.

---

## PART A — `src/types/index.ts`

Create a single types file exporting all shared TypeScript interfaces and types used across the app. Must match the data shapes in `src/data/` exactly.

```typescript
// Program types
export type ProgramCategory =
  | "fitness"
  | "childcare"
  | "dining"
  | "recreation"
  | "retail"
  | "lodging"
  | "family-support"
  | "education"

export interface Program {
  id: string
  name: string
  category: ProgramCategory
  facility: string
  description: string
  hours: string
  eligibility: string[]        // e.g. ["Active Duty", "Family Members", "Retirees"]
  bookable: boolean
  price: number | null         // null = free
  tags: string[]
  image?: string
}

export interface Facility {
  id: string
  name: string
  building: string
  area: string
  category: ProgramCategory
  capacity: number
  coordinates: { lat: number; lng: number }
  programs: string[]           // program IDs
}

// Dashboard types
export type MetricUnit = "currency" | "percent" | "count" | "score"
export type TrendDirection = "up" | "down"
export type TrendSentiment = "positive" | "negative" | "neutral"

export interface Metric {
  id: string
  label: string
  value: number
  unit: MetricUnit
  trend: number
  trendDirection: TrendDirection
  trendSentiment: TrendSentiment
  sparkline: number[]
}

export interface RevenueEntry {
  month: string
  year: number
  category: ProgramCategory
  installation: string
  amount: number
  transactions: number
}

export interface UtilizationEntry {
  facilityId: string
  facilityName: string
  category: ProgramCategory
  capacityPct: number
  peakHour: string
  avgDailyVisits: number
  trend: number
  waitlistCount?: number       // only for childcare when overloaded
  alert?: "critical" | "warning" | "good"
}

export interface SatisfactionEntry {
  programId: string
  programName: string
  category: ProgramCategory
  csatScore: number
  npsScore: number
  responseCount: number
  topPositive: string
  topNegative: string
  trend: number
}

export interface Installation {
  id: string
  name: string
  location: string
  marinePopulation: number
  revenue: number | null
  csatAvg: number | null
  utilizationAvg: number | null
  status: "live" | "coming-soon"
}

// API response wrappers
export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    installation?: string
    asOf?: string
  }
}
```

---

## PART B — API Routes

Create all API routes under `src/app/api/`. Each route reads from the corresponding JSON fixture in `src/data/` and returns filtered/shaped data. All routes are GET only. No auth.

Use this pattern for every route:

```typescript
import { NextRequest, NextResponse } from "next/server"
import data from "@/data/[file].json"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // ... filter logic
  return NextResponse.json({ data: result, meta: { ... } })
}
```

---

### Route 1 — `src/app/api/programs/route.ts`

**GET /api/programs**

Query params:
- `?category=fitness` — filter by ProgramCategory (optional)
- `?bookable=true` — filter to bookable only (optional)
- `?eligibility=family` — filter where eligibility includes "Family Members" (optional, case-insensitive)
- `?q=golf` — text search across name, description, tags (optional)

Returns: `ApiResponse<Program[]>`

Meta: `{ total: number, installation: "Camp Pendleton" }`

---

### Route 2 — `src/app/api/facilities/route.ts`

**GET /api/facilities**

Query params:
- `?category=fitness` — filter by category (optional)
- `?area=21` — filter by area string match (optional)

Returns: `ApiResponse<Facility[]>`

---

### Route 3 — `src/app/api/metrics/route.ts`

**GET /api/metrics**

No query params. Returns all top-level KPI metrics.

Returns: `ApiResponse<Metric[]>`

Also compute and append a derived metric object:
```json
{
  "id": "reinvestment",
  "label": "QoL Reinvestment YTD",
  "value": 6192000,
  "unit": "currency",
  "trend": 12.4,
  "trendDirection": "up",
  "trendSentiment": "positive",
  "sparkline": []
}
```

Meta: `{ asOf: new Date().toISOString(), installation: "Camp Pendleton" }`

---

### Route 4 — `src/app/api/revenue/route.ts`

**GET /api/revenue**

Query params:
- `?year=2025` — filter by year (optional, defaults to current year)
- `?category=fitness` — filter by category (optional)
- `?view=monthly` or `?view=category` — shape of response (optional, default: "monthly")

When `view=monthly`: return entries grouped by month, summed across all categories.
Shape: `Array<{ month: string, year: number, total: number, byCategory: Record<ProgramCategory, number> }>`

When `view=category`: return entries grouped by category, summed across all months in year.
Shape: `Array<{ category: ProgramCategory, total: number, transactions: number, avgMonthly: number }>`

Default (no view param): return raw RevenueEntry array filtered by params.

Returns: `ApiResponse<...>` with meta `{ year, totalRevenue, priorYearRevenue, yoyGrowthPct }`

---

### Route 5 — `src/app/api/utilization/route.ts`

**GET /api/utilization**

Query params:
- `?category=fitness` — filter by category (optional)
- `?alert=critical` — filter by alert level: "critical" | "warning" | "good" (optional)
- `?sort=capacity_desc` or `?sort=capacity_asc` — sort by utilization % (optional, default: capacity_desc)

Also compute and return summary stats in meta:
```json
{
  "avgUtilization": 78,
  "criticalCount": 2,
  "warningCount": 3,
  "topPerformer": "Paige Field House",
  "underperformer": "MCAS Fitness Center"
}
```

Returns: `ApiResponse<UtilizationEntry[]>`

---

### Route 6 — `src/app/api/satisfaction/route.ts`

**GET /api/satisfaction**

Query params:
- `?category=fitness` — filter by category (optional)
- `?sort=csat_desc` | `csat_asc` | `nps_desc` | `nps_asc` (optional, default: csat_desc)
- `?flag=true` — return only entries with CSAT < 4.0 (optional)

Compute and return in meta:
```json
{
  "overallCsat": 4.3,
  "overallNps": 42,
  "totalResponses": 8420,
  "trending_up": ["Group Exercise Classes", "ITT / Latitudes Travel"],
  "trending_down": ["21 Area Pool", "53 Area Fitness Center"]
}
```

Returns: `ApiResponse<SatisfactionEntry[]>`

---

### Route 7 — `src/app/api/installations/route.ts`

**GET /api/installations**

No query params. Returns all installations.

Compute summary in meta:
```json
{
  "total": 15,
  "live": 1,
  "comingSoon": 14,
  "totalPopulationServed": 518200
}
```

Returns: `ApiResponse<Installation[]>`

---

### Route 8 — `src/app/api/alerts/route.ts`

**GET /api/alerts**

No query params. Dynamically generate alerts by reading from utilization and satisfaction data.

Return an array of Alert objects computed from the fixture data:

```typescript
interface Alert {
  id: string
  level: "critical" | "warning" | "success" | "info"
  title: string
  message: string
  category: ProgramCategory
  metric: string
  value: string | number
  action?: string
}
```

Must generate these specific alerts from the data:
1. 🔴 CRITICAL — CDC waitlist: "CDC-1 Mainside waitlist at 187 families — immediate action required"
2. 🔴 CRITICAL — CDC-2 Las Pulgas waitlist: "43 families on waitlist"
3. 🟡 WARNING — 21 Area Pool CSAT drop: "CSAT declined to 3.7 — review maintenance schedule"
4. 🟡 WARNING — 53 Area Fitness: "Utilization at 44% and CSAT 3.8 — equipment complaints"
5. 🟡 WARNING — MCAS Fitness: "Utilization at 39% — assess staffing and program offerings"
6. 🟢 SUCCESS — Group Exercise: "Revenue up 18% MoM — new class schedule driving growth"
7. 🟢 SUCCESS — ITT / Latitudes Travel: "CSAT 4.8 — highest rated program on installation"
8. ℹ️ INFO — Summer seasonality: "Beach cottage bookings trending +24% — peak season approaching"

---

## PART C — Lib Utilities

### `src/lib/utils.ts`

Add these utility functions (keep existing `cn()` from shadcn):

```typescript
// Format currency: 4200000 → "$4.2M" or "$4,200,000"
export function formatCurrency(value: number, compact = false): string

// Format percentage: 78.4 → "78.4%"
export function formatPercent(value: number, decimals = 1): string

// Format large counts: 22400 → "22,400"
export function formatCount(value: number): string

// Format CSAT: 4.3 → "4.3 / 5.0"
export function formatCsat(value: number): string

// Get trend badge color class based on direction + sentiment
export function trendColor(direction: TrendDirection, sentiment: TrendSentiment): string
// Returns Tailwind classes: "text-emerald-600" | "text-red-600" | "text-zinc-500"

// Get alert level color
export function alertColor(level: "critical" | "warning" | "success" | "info"): string
// Returns Tailwind classes for bg + text

// Get category display label
export function categoryLabel(category: ProgramCategory): string
// e.g. "fitness" → "Fitness & Recreation"

// Get category icon name (Lucide icon name string)
export function categoryIcon(category: ProgramCategory): string
// e.g. "fitness" → "Dumbbell", "childcare" → "Baby", "dining" → "UtensilsCrossed"
```

---

## PART D — Next.js Config

### `next.config.ts`

Add JSON import support and ensure `src/data/` files are readable at build time. The config should already work with Next.js 16 App Router — just confirm no changes needed or add:

```typescript
const nextConfig = {
  experimental: {
    // any needed flags
  },
}
```

---

## VERIFICATION

After generating all files, run this check in the terminal:

```bash
# Start dev server and test all routes
curl http://localhost:3000/api/metrics | head -c 500
curl "http://localhost:3000/api/programs?category=fitness" | head -c 500
curl "http://localhost:3000/api/revenue?view=category" | head -c 500
curl http://localhost:3000/api/alerts | head -c 500
```

All routes should return valid JSON with `data` and `meta` fields. Fix any import path errors before moving on.

---

*Ready for Prompt 03 — Dashboard Components & Pages after all routes return valid JSON.*
