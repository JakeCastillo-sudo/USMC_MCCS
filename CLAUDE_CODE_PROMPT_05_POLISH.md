# Claude Code Prompt — Step 5: Polish, Branding & Demo Flow

Paste this into Claude Code after Prompt 04 is verified. This is the final pass before the interview demo.

---

Reference SPEC.md. Both the Leadership Dashboard and Resident Portal are complete. This prompt handles final polish, StormBreaker branding, demo flow, and a guided walkthrough mode.

---

## PART A — StormBreaker Branding Integration

### StormBreaker Badge Component `src/components/shared/StormBreakerBadge.tsx`

Reusable badge used throughout the app. Three sizes via `size` prop.

```typescript
interface StormBreakerBadgeProps {
  size?: "sm" | "md" | "lg"
  variant?: "dark" | "light"
}
```

**Small (sm):** inline pill — ⚡ "StormBreaker" — used in footers, card corners
**Medium (md):** small card — lightning icon + "Built on Operation StormBreaker" + "MCCS AWS · Zero Trust" — used in sidebar
**Large (lg):** full banner card — used on landing page and dashboard overview

Content for medium/large:
- Icon: Zap (Lucide), animated subtle pulse on the icon `animate-pulse`
- Title: "Operation StormBreaker"
- Line 1: "MCCS DevSecOps Platform · AWS Landing Zone"
- Line 2: Three compliance chips: "ATO Compliant" | "Zero Trust" | "FedRAMP Ready"
- Tooltip on hover (shadcn Tooltip): "Operation StormBreaker reduced MCCS ATO timelines from 18 months to 30 days. Kaizen Labs deploys directly into this certified infrastructure."

Dark variant: navy bg `#003087`, white text — for landing page and sidebar
Light variant: white bg, navy text, navy border — for dashboard cards

### Add StormBreaker Badge to:
1. Landing page — large dark variant, centered below role cards
2. Dashboard sidebar — medium dark variant at bottom (already specified in Prompt 03, now use this component)
3. Dashboard overview page — medium light variant in a "Platform Info" card in the right column
4. Every page footer — small dark variant

---

## PART B — Demo Guided Walkthrough

### `src/components/shared/DemoGuide.tsx`

A floating demo guide panel that walks an interviewer through the app. Toggle with a floating button.

**Floating trigger button** — fixed, bottom-right corner (`fixed bottom-6 right-6 z-50`):
- Circular button, MCCS Red background, white text
- Icon: `PlayCircle` (Lucide)
- Label: "Demo Guide"
- Pulsing ring animation to draw attention: `animate-ping` on a pseudo-ring

**Guide panel** — slides in from right when triggered (`translate-x-0` transition):
- Width: 320px, full height, white background, shadow-2xl
- Header: "Demo Walkthrough" + close button
- Subheader: "Kaizen Labs · MCCS Camp Pendleton"

**Steps list** — numbered, each step is a card:

```
Step 1 — Landing Page
"Start here. Two roles: Marine/Family or MCCS Leadership. StormBreaker badge establishes deployment credibility."
[Go to Step →] links to: /

Step 2 — Resident Portal Home
"A Marine's spouse needs childcare and wants to book a gym class. One app, not five websites."
[Go to Step →] links to: /resident

Step 3 — Childcare Urgency
"The waitlist problem is real. 187 families at CDC-1 Mainside. The platform surfaces this instantly."
[Go to Step →] links to: /resident/childcare

Step 4 — Book a Fitness Class
"Three taps. Select program → pick time → confirm. Done. Show the booking modal."
[Go to Step →] links to: /resident/fitness

Step 5 — Switch to Leadership
"Now flip to the command view. Same data, different lens."
[Go to Step →] links to: /dashboard

Step 6 — KPI Bar & Revenue
"$4.2M monthly, 4.3 CSAT, 78% utilization. Revenue up 8.3% YoY. In one glance."
[Go to Step →] links to: /dashboard/revenue

Step 7 — Alerts Feed
"CDC waitlist is flagged automatically. Leadership doesn't need to go looking for problems."
[Go to Step →] links to: /dashboard

Step 8 — Enterprise Vision
"Scroll to the installation table. Pendleton is live. 14 installations are ready to onboard."
[Go to Step →] links to: /dashboard (scroll to InstallationTable)

Step 9 — StormBreaker Close
"This runs on StormBreaker. No new ATO. Kaizen deploys into infrastructure MCCS already certified."
[Go to Step →] links to: /
```

Active step: highlighted with MCCS Red left border, light red background.
Completed steps: gray with checkmark.
Current step number shown in header: "Step 3 of 9"

Navigation: "← Previous" and "Next →" buttons at bottom of panel.

Clicking "Go to Step →" navigates to that route using Next.js router.

---

## PART C — Micro-interactions & Animation

Add these subtle animations using Tailwind + CSS transitions. No external animation library needed.

### Page transitions
In `src/app/layout.tsx`, wrap children in a div with:
```css
.page-enter {
  animation: fadeSlideIn 0.2s ease-out;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Add `page-enter` class to the main content wrapper.

### KPI Card counter animation
In `KPICard.tsx`, animate the number counting up from 0 to its value on mount:
```typescript
// Simple counter hook
function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress === 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}
```
Use this for the numeric value in each KPI card. Currency and count metrics animate. CSAT score animates from 0.0 to 4.3 (format with one decimal throughout).

### Alert card entrance
In `AlertsFeed.tsx`, stagger the entrance of alert cards:
```typescript
// Add delay based on index
style={{ animationDelay: `${index * 80}ms` }}
className="animate-fadeIn" // define in globals.css
```

### Booking modal step transitions
Between steps 1→2→3, slide the content:
- Entering: slide in from right
- Exiting: slide out to left
Simple CSS classes, no library needed.

---

## PART D — Mobile Optimization Pass

Review every page and fix these common mobile issues:

### Touch targets
All buttons and tappable elements must be minimum 44×44px. Check:
- Category tiles ✓ (already large)
- Quick action rows — add `min-h-[56px]`
- Booking modal time slots — add `min-h-[44px] min-w-[80px]`
- Bottom tab bar items — add `min-h-[56px]`

### Text sizing
- No text smaller than `text-xs` on mobile
- Program card descriptions: `text-sm` minimum
- KPI values on mobile: `text-2xl` (reduce from 3xl to fit 2-column grid)

### Horizontal scrolling
These sections must scroll horizontally on mobile without showing scrollbar:
- Category filter chips in SearchBar
- Featured Programs cards
- Date picker in BookingModal
- Dining venue status strip

Add to each: `overflow-x-auto scrollbar-hide flex gap-3`
Add to globals.css: `.scrollbar-hide::-webkit-scrollbar { display: none; }`

### Safe area (iPhone notch/home indicator)
Add to layout bottom padding: `pb-[env(safe-area-inset-bottom)]`
Bottom tab bar: `padding-bottom: env(safe-area-inset-bottom)`

---

## PART E — README for the Repo

### `README.md`

```markdown
# MCCS Camp Pendleton — Unified Platform Demo

A full-stack demo showcasing how Kaizen Labs' modular platform modernizes Marine Corps Community Services at Camp Pendleton — deployed via Operation StormBreaker's AWS DevSecOps infrastructure.

## Two Surfaces

**Resident Portal** (`/resident`)  
Unified app for Marines and families to discover, book, and pay for MCCS programs — fitness, childcare, dining, recreation, and more.

**Leadership Dashboard** (`/dashboard`)  
Enterprise command view for MCCS leadership — revenue, utilization, satisfaction, and engagement metrics with real-time alerts.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui (Nova preset)
- Recharts
- JSON fixtures via Next.js API routes

## Running Locally
\`\`\`bash
npm install
npm run dev
# Open http://localhost:3000
\`\`\`

## Demo Flow
Use the built-in Demo Guide (floating button, bottom-right) to walk through the 9-step interview narrative.

## Data
All data is synthetic but internally consistent, built from real Camp Pendleton MCCS program and facility names sourced from pendleton.usmc-mccs.org.

## Deployment
Built for Operation StormBreaker — MCCS's AWS-based DevSecOps platform. Fundable via FS Form 7600A. No new ATO required.

---
*Demo prepared for Kaizen Labs Head of Federal interview*  
*Installation: MCB Camp Pendleton, CA*  
*Platform: Kaizen Labs · Infrastructure: Operation StormBreaker*
```

---

## PART F — Final Verification Checklist

Run through every item before the interview:

### Functionality
- [ ] Landing page → both role cards navigate correctly
- [ ] Resident home → all sections render, no empty states
- [ ] Fitness page → programs load, filter tabs work
- [ ] Childcare page → waitlist banners visible, CDC cards show capacity
- [ ] Dining page → restaurants show, reservation button opens modal
- [ ] Recreation page → outdoor programs load
- [ ] Booking modal → all 3 steps complete, confirmation shows booking reference
- [ ] Dashboard overview → all sections render, KPI bar loads
- [ ] Revenue page → both chart views toggle correctly
- [ ] Utilization page → grid loads, alert badges visible
- [ ] Satisfaction page → table sortable, color coding correct
- [ ] Installation table → Pendleton live, others blurred
- [ ] Alerts feed → 8 alerts, correct priority order
- [ ] Role switcher → toggles between surfaces correctly
- [ ] Demo Guide → opens, all 9 steps navigate correctly

### Visual
- [ ] MCCS Red used consistently for primary CTAs
- [ ] Navy used for secondary elements and headers
- [ ] StormBreaker badge appears on landing, sidebar, and dashboard
- [ ] No broken images (all use emoji/icons as placeholders, no broken img tags)
- [ ] Dark mode doesn't break layout (Tailwind default — just verify it's acceptable)

### Mobile (test in Chrome DevTools → iPhone 15)
- [ ] Landing page — role cards stack vertically
- [ ] Resident home — single column, bottom tab bar visible
- [ ] Category tiles — 2 columns
- [ ] Booking modal — full screen, steps readable
- [ ] Dashboard — sidebar hidden, KPI cards 2-column grid

### Performance
- [ ] `npm run build` completes with no errors
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No console errors in browser

### Git
```bash
git add -A
git commit -m "Complete MCCS demo — resident portal, dashboard, polish pass"
```

---

*Demo is ready. Use the Demo Guide during the interview to walk through all 9 steps.*
*Total build: 5 prompts, ~3 days, Next.js 16 + Tailwind + Recharts*
*Deployed target: Operation StormBreaker, MCCS AWS Landing Zone*
```
