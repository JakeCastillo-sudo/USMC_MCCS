# MCCS Camp Pendleton — Unified Platform Demo

A full-stack demo showcasing how Kaizen Labs' modular platform modernizes Marine Corps Community Services at Camp Pendleton — deployed via Operation StormBreaker's AWS DevSecOps infrastructure.

## Two Surfaces

**Resident Portal** (`/resident`)
Unified app for Marines and families to discover, book, and pay for MCCS programs — fitness, childcare, dining, recreation, and more.

**Leadership Dashboard** (`/dashboard`)
Enterprise command view for MCCS leadership — revenue, utilization, satisfaction, and engagement metrics with real-time alerts.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (Nova preset)
- Recharts (AreaChart, LineChart, BarChart, PieChart)
- JSON fixtures via Next.js API routes (no database)

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Demo Flow

Use the built-in **Demo Guide** (floating red button, bottom-right corner) to walk through all 9 steps of the interview narrative — from landing page role selection through the enterprise installation expansion vision.

### 9-Step Narrative

| Step | Route | Talking Point |
|------|-------|---------------|
| 1 | `/` | Landing page — two roles, StormBreaker badge |
| 2 | `/resident` | Marine's spouse — one app, not five websites |
| 3 | `/resident/childcare` | 187 families waitlisted — surfaced instantly |
| 4 | `/resident/fitness` | Three taps to book a fitness class |
| 5 | `/dashboard` | Flip to leadership — same data, different lens |
| 6 | `/dashboard/revenue` | $4.2M monthly, 8.3% YoY in one glance |
| 7 | `/dashboard` | Alerts auto-surface problems for leadership |
| 8 | `/dashboard` | 14 installations ready to onboard |
| 9 | `/` | StormBreaker — no new ATO required |

## API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/programs` | Programs with `?category`, `?q`, `?bookable` filters |
| `/api/facilities` | Facilities with `?category`, `?area` filters |
| `/api/metrics` | 6 KPIs + derived reinvestment metric |
| `/api/revenue` | Monthly and category views, fiscal year Jun 2025–May 2026 |
| `/api/utilization` | 31 facilities with alert levels |
| `/api/satisfaction` | 34 programs, weighted CSAT 4.35 / NPS 39 |
| `/api/alerts` | 12 dynamically generated alerts, sorted by severity |
| `/api/installations` | 15 installations (1 live, 14 coming-soon) |

## Data

All data is synthetic but internally consistent, built from real Camp Pendleton MCCS program and facility names sourced from [pendleton.usmc-mccs.org](https://pendleton.usmc-mccs.org).

Key figures (May 2026 snapshot):
- **Monthly Revenue:** $4.2M (+8.3% MoM)
- **YTD Revenue:** $38.7M (FY Jun 2025–May 2026)
- **Active Patrons:** 48,200
- **Overall CSAT:** 4.3 / 5.0
- **Facility Utilization:** 78% avg
- **CDC Waitlist:** 230 families across 2 centers

## Deployment

Built for **Operation StormBreaker** — MCCS's AWS-based DevSecOps platform. Deployable via FS Form 7600A inter-agency agreement. No new ATO required — runs inside MCCS's existing FedRAMP-authorized boundary.

---

*Demo prepared for Kaizen Labs Head of Federal interview*
*Installation: MCB Camp Pendleton, CA*
*Platform: Kaizen Labs · Infrastructure: Operation StormBreaker*
