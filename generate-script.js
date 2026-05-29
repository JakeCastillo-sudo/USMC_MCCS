/**
 * MCCS Camp Pendleton -- Kaizen Labs Interview Demo Script
 * Run: node generate-script.js
 * Output: MCCS-Demo-Script.docx
 *
 * Setup (run once in your mccs-demo directory):
 *   npm install docx
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, PageNumber, PageBreak, Header, Footer,
  TabStopType, TabStopPosition
} = require("docx");
const fs = require("fs");

// ── COLORS ────────────────────────────────────────────────────────────────────
const RED   = "C8102E";
const NAVY  = "003087";
const GOLD  = "C9A84C";
const LGRAY = "F4F4F5";
const MGRAY = "E4E4E7";
const DGRAY = "52525B";

// ── HELPERS ───────────────────────────────────────────────────────────────────

function spacer(pts = 120) {
  return new Paragraph({ children: [], spacing: { before: pts, after: 0 } });
}

function ruled() {
  return new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MGRAY, space: 1 } },
    spacing: { before: 0, after: 120 },
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, color: NAVY, bold: true, size: 36, font: "Calibri" })],
    spacing: { before: 360, after: 120 },
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, color: RED, bold: true, size: 28, font: "Calibri" })],
    spacing: { before: 280, after: 80 },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, color: NAVY, bold: true, size: 24, font: "Calibri" })],
    spacing: { before: 200, after: 60 },
  });
}

// A shaded callout box using a single-cell table
function callout(label, text, shadeColor, labelColor) {
  const border = { style: BorderStyle.SINGLE, size: 2, color: shadeColor };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 18, color: labelColor || RED }, right: border },
            shading: { fill: shadeColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: label + "  ", bold: true, size: 20, color: labelColor || RED, font: "Calibri" }),
                  new TextRun({ text, size: 20, color: "27272A", font: "Calibri" }),
                ],
                spacing: { before: 0, after: 0 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// SAY / DO / NOTE table row
function scriptRow(say, doAction, note, isHeader) {
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: MGRAY };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const headerShade = { fill: NAVY, type: ShadingType.CLEAR };
  const altShade    = { fill: LGRAY, type: ShadingType.CLEAR };

  function cell(text, w, bold, color, shade) {
    return new TableCell({
      borders,
      width: { size: w, type: WidthType.DXA },
      shading: shade || {},
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      verticalAlign: VerticalAlign.TOP,
      children: [
        new Paragraph({
          children: [new TextRun({ text: text || "", bold: !!bold, size: isHeader ? 20 : 19, color: color || "27272A", font: "Calibri" })],
          spacing: { before: 0, after: 0 },
        }),
      ],
    });
  }

  if (isHeader) {
    return new TableRow({
      tableHeader: true,
      children: [
        cell("SAY",    4600, true, "FFFFFF", headerShade),
        cell("DO",     2680, true, "FFFFFF", headerShade),
        cell("NOTE",   2080, true, "FFFFFF", headerShade),
      ],
    });
  }

  return new TableRow({
    children: [
      cell(say,      4600, false, "27272A"),
      cell(doAction, 2680, false, RED),
      cell(note,     2080, false, "6B7280"),
    ],
  });
}

function scriptTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4600, 2680, 2080],
    rows: [
      scriptRow("SAY", "DO", "NOTE", true),
      ...rows.map(([say, doAction, note]) => scriptRow(say, doAction, note)),
    ],
  });
}

function tip(text) {
  return callout("TIP:", text, "FEF9E7", "C9A84C");
}

function warning(text) {
  return callout("WATCH:", text, "FEF2F2", "C8102E");
}

function note(text) {
  return callout("NOTE:", text, "EFF6FF", "003087");
}

function para(text, opts) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Calibri", color: "27272A", ...opts })],
    spacing: { before: 60, after: 60 },
  });
}

function bullet(text, sub) {
  return new Paragraph({
    numbering: { reference: "bullets", level: sub ? 1 : 0 },
    children: [new TextRun({ text, size: 21, font: "Calibri", color: "27272A" })],
    spacing: { before: 40, after: 40 },
  });
}

// ── DOCUMENT ──────────────────────────────────────────────────────────────────

async function buildScript() {

  const children = [];

  // ── COVER ──────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "MCCS CAMP PENDLETON", bold: true, size: 52, color: NAVY, font: "Calibri" })],
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Unified Digital Platform -- Kaizen Labs Demo", size: 32, color: RED, font: "Calibri" })],
      spacing: { before: 0, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "INTERVIEW DEMO SCRIPT  |  READ-ALONG GUIDE", size: 22, color: DGRAY, font: "Calibri", bold: true })],
      spacing: { before: 0, after: 60 },
    }),
    ruled(),
    new Paragraph({
      children: [
        new TextRun({ text: "Candidate: ", bold: true, size: 22, font: "Calibri", color: "27272A" }),
        new TextRun({ text: "Jacob Castillo", size: 22, font: "Calibri", color: "27272A" }),
        new TextRun({ text: "     |     ", size: 22, font: "Calibri", color: MGRAY }),
        new TextRun({ text: "Role: ", bold: true, size: 22, font: "Calibri", color: "27272A" }),
        new TextRun({ text: "Head of Federal", size: 22, font: "Calibri", color: "27272A" }),
        new TextRun({ text: "     |     ", size: 22, font: "Calibri", color: MGRAY }),
        new TextRun({ text: "Demo: ", bold: true, size: 22, font: "Calibri", color: "27272A" }),
        new TextRun({ text: "localhost:3000", size: 22, font: "Calibri", color: RED }),
      ],
      spacing: { before: 60, after: 180 },
    }),
  );

  children.push(
    callout(
      "HOW TO USE THIS SCRIPT:",
      "This is your read-along during the live demo. Each section has three columns: SAY (your words), DO (what to click), and NOTE (things to watch for or anticipate). Keep this open on your phone or a second screen. Do not read verbatim -- use it as a safety net.",
      "EFF6FF", NAVY
    ),
    spacer(240),
  );

  // ── SETUP ──────────────────────────────────────────────────────────────────
  children.push(
    h1("PRE-DEMO SETUP"),
    para("Complete these steps before the interviewer enters the room or the screen share begins."),
    spacer(60),
  );

  children.push(
    callout("CHECKLIST:", "Browser open to localhost:3000  |  npm run dev running in terminal  |  Terminal hidden or minimized  |  Pitch deck open in separate window/tab  |  This script open on phone or tablet  |  Zoom/notifications OFF", LGRAY, NAVY),
    spacer(120),
  );

  children.push(
    h3("Optimal Browser Setup"),
    bullet("Chrome or Safari -- full screen, 100% zoom"),
    bullet("Open tabs in this order: localhost:3000, pitch deck (if presenting separately)"),
    bullet("DevTools closed -- no console visible"),
    bullet("Have localhost:3000/resident and localhost:3000/dashboard bookmarked for quick nav"),
    spacer(120),
  );

  children.push(
    tip("If anything looks broken on load, do a hard refresh (Cmd+Shift+R) before the call. If the dev server is not running, open terminal, cd to mccs-demo, run npm run dev, wait for 'Ready', then reload."),
    spacer(240),
  );

  // ── OPENING ────────────────────────────────────────────────────────────────
  children.push(
    h1("STEP 1 -- OPENING (2 min)"),
    para("Start on the pitch deck, not the app. Establish the strategic context before you show anything on screen.", { italic: true, color: DGRAY }),
    spacer(60),
    h2("The Setup"),
    scriptTable([
      [
        "Before I show you the demo, I want to give you 60 seconds of context on why I picked this problem.",
        "Stay on pitch deck, slide 2.",
        "Don't open the app yet. Let them lean in first.",
      ],
      [
        "MCCS serves over 180,000 Marines and family members across 15+ installations. At Camp Pendleton alone, that's 100,000 potential patrons and $38.7 million in annual service revenue.",
        "Point to the 180,000+ stat on slide.",
        "Let the number land. Pause after you say it.",
      ],
      [
        "Right now, if a Marine spouse needs childcare, she googles it, finds the MCCS website, navigates to the CDC page, finds no availability info, and calls during business hours. If she also wants to book a fitness class -- that's a different website, different login.",
        "Pause. Let them feel the friction.",
        "This is the empathy moment. Slow down here.",
      ],
      [
        "Kaizen already knows how to solve this. Recreation, reservations, permitting, payments -- that's your core. MCCS is that same problem at national military scale. And Operation StormBreaker means there's already a certified deployment path. No new ATO. No new contract vehicle.",
        "Advance to slide 3 -- The Solution.",
        "This is your thesis. One breath. Confident.",
      ],
      [
        "Let me show you what that looks like built.",
        "Navigate to localhost:3000.",
        "This is your pivot to the demo. Clean transition.",
      ],
    ]),
    spacer(120),
  );

  // ── LANDING PAGE ───────────────────────────────────────────────────────────
  children.push(
    h1("STEP 2 -- LANDING PAGE (1 min)"),
    para("The landing page sets the stage. Two audiences, one platform.", { italic: true, color: DGRAY }),
    spacer(60),
    h2("localhost:3000 -- Role Selector"),
    scriptTable([
      [
        "This is the entry point. Two surfaces -- one for Marines and families on base, one for MCCS leadership. Same platform, same data, different lens.",
        "Show the landing page. Let them look for 5 seconds.",
        "Point out the StormBreaker badge at the bottom.",
      ],
      [
        "You'll notice the StormBreaker badge here. Everything you're about to see is architected to deploy into MCCS's existing AWS landing zone. ATO compliant, zero trust, FedRAMP ready.",
        "Point to the StormBreaker badge.",
        "This signals you know the deployment context -- not just the product.",
      ],
      [
        "Let's start where a Marine would start.",
        "Click 'Enter Resident Portal'.",
        "",
      ],
    ]),
    spacer(120),
  );

  // ── RESIDENT PORTAL ────────────────────────────────────────────────────────
  children.push(
    h1("STEP 3 -- RESIDENT PORTAL (4 min)"),
    para("This is your empathy play. Make them feel the before-and-after.", { italic: true, color: DGRAY }),
    spacer(60),
    h2("Resident Home -- localhost:3000/resident"),
    scriptTable([
      [
        "Meet SSgt Martinez's spouse. She's got two kids and just arrived at Pendleton. She needs childcare, wants to find a fitness class, and isn't sure what else is available on base.",
        "Show the resident home page.",
        "Use a real persona -- it makes the demo human, not abstract.",
      ],
      [
        "This is what she sees instead of five different websites. One search bar. Quick actions. All MCCS programs in one place.",
        "Point to the search bar and quick action tiles.",
        "",
      ],
      [
        "She's heard there's a waitlist for childcare. Let's check.",
        "Click 'Find Childcare' quick action tile.",
        "Childcare is your most powerful moment -- don't rush past it.",
      ],
    ]),
    spacer(80),

    h2("Childcare Page -- localhost:3000/resident/childcare"),
    scriptTable([
      [
        "This is the childcare page. Three Child Development Centers on base. And you can see immediately -- CDC-1 Mainside has 187 families on the waitlist. CDC-2 has 43.",
        "Show the childcare page. Let the waitlist numbers register.",
        "Let them read the numbers. Don't talk over the visual.",
      ],
      [
        "Right now, you'd find this out by calling. The person who answers might not even know the exact number. Here it's live, it's visible, and it automatically surfaces to leadership as a critical alert -- which we'll see in a moment.",
        "Point to the waitlist badges on each CDC card.",
        "This is the data-driven leadership angle. Plant the seed now.",
      ],
      [
        "She can join the waitlist right here. She doesn't need to call, she doesn't need to navigate anywhere else. Now let's show her the fitness center.",
        "Click 'Fitness & Recreation' in the nav or tab bar.",
        "",
      ],
    ]),
    spacer(80),

    h2("Fitness Page -- localhost:3000/resident/fitness"),
    scriptTable([
      [
        "Pendleton has 12 fitness centers across the base, plus Paige Field House as the flagship. She can filter by 24/7 access, free programs, or what's available right now.",
        "Show fitness page. Point to filter toggles.",
        "",
      ],
      [
        "She wants to book a group exercise class. Three taps.",
        "Click 'Book Now' on the Group Exercise Classes card.",
        "Make sure the booking modal opens cleanly.",
      ],
    ]),
    spacer(80),

    h2("Booking Modal -- 3-Step Flow"),
    scriptTable([
      [
        "Step one -- pick a day and a time slot. She picks tomorrow morning.",
        "Select a date, select a time slot. Click 'Continue'.",
        "If any slots show as Full -- good, that's intentional realism.",
      ],
      [
        "Step two -- confirm. Her service record is already in the system. Payment goes through MCCS Pay.",
        "Show the confirmation screen. Point to name and MCCS Pay.",
        "Don't linger here -- it's a confirmation page, not a feature.",
      ],
      [
        "Step three -- done. Booking reference, add to calendar, all in under 30 seconds. That's the experience every Marine family member deserves.",
        "Show the confirmation screen with booking reference.",
        "Pause after 'deserves.' Let it land emotionally.",
      ],
      [
        "Now let's flip to the other side of this platform -- what MCCS leadership sees.",
        "Click 'Leadership Dashboard' in the role switcher in the nav bar.",
        "The role switcher is in the top right of the nav bar.",
      ],
    ]),
    spacer(120),
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  children.push(
    h1("STEP 4 -- LEADERSHIP DASHBOARD (5 min)"),
    para("This is your money shot. Leadership sees the enterprise. Walk it confidently.", { italic: true, color: DGRAY }),
    spacer(60),
    h2("Dashboard Overview -- localhost:3000/dashboard"),
    scriptTable([
      [
        "Same platform, different lens. This is what the MCCS Director at Camp Pendleton sees when they open their dashboard.",
        "Show the dashboard overview. Let the KPI bar load.",
        "Give it 2-3 seconds to fully render before speaking.",
      ],
      [
        "In one glance: $4.2 million in monthly revenue, up 8.3% versus last month. Average patron satisfaction of 4.3 out of 5. Facility utilization at 78%. 22,400 active patrons this month -- that's 22% of the eligible population on base.",
        "Walk across the KPI cards left to right.",
        "Go slow. These are real numbers -- let them absorb.",
      ],
      [
        "Revenue is up 8.3% year-over-year. On track against a $42 million annual target. And 16% of that revenue -- $6.2 million -- flows directly back into quality-of-life programs for Marines and their families. That's the StormBreaker mission in dollar form.",
        "Click 'Revenue' in the sidebar.",
        "The reinvestment figure is powerful -- it ties revenue to mission.",
      ],
    ]),
    spacer(80),

    h2("Revenue Page -- localhost:3000/dashboard/revenue"),
    scriptTable([
      [
        "Monthly revenue trend for 2025. You can see the seasonality -- summer months spike as families use beach cottages, recreation programs, outdoor adventures. That's real pattern matching from the data.",
        "Show the monthly line chart. Toggle to 'By Category'.",
        "",
      ],
      [
        "By category, fitness is the top revenue driver at $1.1 million a month -- 12 facilities running 24/7. Childcare is second at $980,000. Dining, recreation, retail follow.",
        "Show the category bar chart.",
        "Fitness being number one will resonate -- it's counterintuitive.",
      ],
      [
        "Now let's go where the alerts are.",
        "Click 'Overview' in the sidebar to return to the main dashboard.",
        "",
      ],
    ]),
    spacer(80),

    h2("Alerts Feed -- Dashboard Overview"),
    scriptTable([
      [
        "The alerts feed on the right is automatically generated from the data. The platform doesn't wait for a director to notice a problem -- it surfaces them.",
        "Point to the alerts feed panel.",
        "",
      ],
      [
        "Two critical alerts at the top: CDC-1 Mainside waitlist at 187 families -- immediate action required. CDC-2 at 43 families. The same waitlist a family member saw on the resident side -- leadership sees it here, flagged red, the moment it crosses threshold.",
        "Point to the red critical alerts.",
        "This connects resident UX to leadership visibility. Make that explicit.",
      ],
      [
        "Further down -- Group Exercise revenue is up 18% month over month. The new class schedule is working. And ITT Latitudes Travel is the highest-rated program on base, CSAT of 4.8.",
        "Point to the green success alerts.",
        "Green alerts matter too -- show them the wins alongside the warnings.",
      ],
      [
        "Let's look at utilization.",
        "Click 'Utilization' in the sidebar.",
        "",
      ],
    ]),
    spacer(80),

    h2("Utilization Page -- localhost:3000/dashboard/utilization"),
    scriptTable([
      [
        "Facility utilization across the installation. Paige Field House at 94% -- that's the flagship gym, consistently packed at 6am. The CDCs are at 99% and 97% -- which is exactly why the waitlist alerts fired.",
        "Show the utilization grid. Point to the red/amber high-utilization cards.",
        "",
      ],
      [
        "And here at the bottom -- MCAS Fitness Center at 39%, 53 Area Fitness at 44%. These are flags. The platform is telling leadership: something's off here. Is it staffing? Programming? Equipment? Go look.",
        "Scroll down or point to the underperforming cards.",
        "Underperformers are as important as top performers. Show both.",
      ],
    ]),
    spacer(80),

    h2("Satisfaction Page -- localhost:3000/dashboard/satisfaction"),
    scriptTable([
      [
        "Customer satisfaction. Overall CSAT of 4.3, NPS of plus 42. ITT Latitudes Travel at the top -- 4.8, NPS plus 71. At the bottom, 21 Area Pool has dropped to 3.7 and it's trending down. Equipment complaints. That's a maintenance conversation that needs to happen this week.",
        "Show satisfaction table. Point to top and bottom entries.",
        "CSAT color coding does the work here -- let them see red vs green.",
      ],
    ]),
    spacer(120),
  );

  // ── ENTERPRISE VISION ──────────────────────────────────────────────────────
  children.push(
    h1("STEP 5 -- ENTERPRISE VISION (2 min)"),
    para("This is your scale moment. Pendleton is the proof of concept. The pitch is the platform.", { italic: true, color: DGRAY }),
    spacer(60),
    h2("Installation Table -- Dashboard Overview"),
    scriptTable([
      [
        "Scroll down to the installation table. Pendleton is live. Everything else -- Camp Lejeune, MCB Hawaii, Quantico, 29 Palms, Okinawa -- is coming soon.",
        "Scroll to the InstallationTable at the bottom of the overview page.",
        "The blurred rows are intentional. They signal scale, not absence.",
      ],
      [
        "Camp Lejeune has 155,000 Marines and family members -- the largest MCCS installation in the world. That's one contract to expand. Same platform, same architecture, same StormBreaker deployment path.",
        "Point to the Camp Lejeune row.",
        "Lejeune is Kaizen's obvious next move. Name it explicitly.",
      ],
      [
        "518,000 Marines and family members across all 15 installations. That's the total addressable patron base. Pendleton at 22% penetration -- that's the benchmark. What does 22% look like at Lejeune? At Okinawa? That's the business case.",
        "Point to the 518,000 stat or summarize from memory.",
        "Don't need to show a slide for this -- just say it with conviction.",
      ],
    ]),
    spacer(120),
  );

  // ── STORMBREAKER CLOSE ─────────────────────────────────────────────────────
  children.push(
    h1("STEP 6 -- THE STORMBREAKER CLOSE (1 min)"),
    para("This is how you close. Confident, specific, no hedging.", { italic: true, color: DGRAY }),
    spacer(60),
    h2("The Closing Statement"),
    scriptTable([
      [
        "The last thing I want to leave you with is the deployment story -- because in federal, the deployment story is the deal story.",
        "You can stay on the dashboard or return to the landing page.",
        "Eye contact here. Slow down.",
      ],
      [
        "Operation StormBreaker took MCCS from an 18-month ATO process to 30 days. Same-day authorization for containerized workloads. It's built on a Navy-certified AWS landing zone, zero trust by default, FedRAMP ready.",
        "",
        "No need to show a slide. This is from memory.",
      ],
      [
        "Kaizen doesn't need a new ATO to deploy here. It deploys into infrastructure MCCS already certified. It's fundable via FS Form 7600A -- no new contract vehicle, no 12-month acquisition delay.",
        "",
        "Pause after 'delay.' Let that sink in.",
      ],
      [
        "What you just saw -- the resident portal, the booking flow, the leadership dashboard, the alerts, the enterprise view -- that's a Day 1 deployable. Built on infrastructure MCCS already owns. Sold through a funding path they already use. This is how Kaizen enters federal.",
        "Let the screen sit. Don't click anything.",
        "This is your close. Stop talking after this sentence.",
      ],
    ]),
    spacer(120),
  );

  // ── Q&A PREP ───────────────────────────────────────────────────────────────
  children.push(
    h1("ANTICIPATED QUESTIONS & ANSWERS"),
    para("Likely questions and how to handle them. Read these before the interview, not during.", { italic: true, color: DGRAY }),
    spacer(60),
  );

  const qas = [
    {
      q: "Is this real data or synthetic?",
      a: "The program names, facility names, and service categories are all real -- scraped directly from pendleton.usmc-mccs.org. The metrics are synthetic but internally consistent. Every number is defensible: revenue divided by transactions gives a plausible average ticket, utilization rates match CSAT scores, patron count is 22% of actual base population. In a real engagement, you'd wire this to MCCS's existing operational data -- likely their RecTrac or point-of-sale systems.",
    },
    {
      q: "How long would this actually take to build?",
      a: "The demo was built in under 5 days using Claude Code and a modular Next.js architecture. A production version scoped to a single installation would be a 90-day sprint: 30 days for discovery and data integration, 30 days for core build, 30 days for testing, security review, and StormBreaker deployment. Kaizen's existing modules -- reservations, payments, permitting -- collapse the timeline significantly versus building from scratch.",
    },
    {
      q: "Why MCCS and not another DoD market?",
      a: "Three reasons. First, Kaizen already has the product -- MCCS is recreation, reservations, and community services, which is exactly what Kaizen does at the state and local level. Second, StormBreaker gives us a deployment path no other vendor has -- we can be in production before a competitor has finished their ATO paperwork. Third, MCCS operates like a private business -- revenue funds programs, so there's a clear ROI story, which makes the procurement conversation easier than a pure appropriations play.",
    },
    {
      q: "What about the other services -- Army MWR, Navy NEX?",
      a: "MCCS is the right beachhead because of StormBreaker. Once Kaizen has a live reference installation and a proven deployment path, Army MWR and Navy MWR are natural expansions. The platform architecture is branch-agnostic -- the data model, the API layer, the component library all generalize. Pendleton is the proof of concept. The playbook is the product.",
    },
    {
      q: "How does this compare to what MCCS already has?",
      a: "MCCS's current digital footprint is installation-by-installation -- each base has its own website, often built on different CMS platforms. There's no unified booking layer, no enterprise leadership view, no patron data that aggregates across programs. Operation StormBreaker consolidated 17 installation websites into one -- that's the consolidation thesis Kaizen extends to the transactional layer.",
    },
    {
      q: "What's your role in this as Head of Federal?",
      a: "Three things: pipeline development, deal structuring, and platform strategy. On pipeline -- identifying which MCCS installations are most ready for modernization and building relationships at the right level, which at MCCS is typically the Deputy Director of Business Operations. On deals -- structuring the FS Form 7600A pathway so procurement isn't a bottleneck. On platform -- owning the federal product roadmap so what we build for MCCS generalizes to Army MWR and beyond.",
    },
  ];

  qas.forEach(({ q, a }) => {
    children.push(
      h3("Q: " + q),
      new Paragraph({
        children: [new TextRun({ text: a, size: 21, font: "Calibri", color: "27272A" })],
        spacing: { before: 40, after: 120 },
      }),
    );
  });

  children.push(
    spacer(60),
    warning("If they ask something you do not know: 'That's a great question -- I'd want to validate that before I give you a number I'd stand behind. I'll follow up in writing today.' Never speculate on procurement timelines, ATO specifics, or pricing without research."),
    spacer(240),
  );

  // ── TIMING GUIDE ───────────────────────────────────────────────────────────
  children.push(
    h1("TIMING GUIDE"),
    spacer(60),
  );

  const border = { style: BorderStyle.SINGLE, size: 1, color: MGRAY };
  const borders = { top: border, bottom: border, left: border, right: border };

  const timingRows = [
    ["Step", "Section", "Target Time", "Cumulative"],
    ["1", "Opening -- Context & Thesis", "2 min", "2 min"],
    ["2", "Landing Page", "1 min", "3 min"],
    ["3", "Resident Portal + Booking Flow", "4 min", "7 min"],
    ["4", "Leadership Dashboard + Alerts", "5 min", "12 min"],
    ["5", "Enterprise Vision", "2 min", "14 min"],
    ["6", "StormBreaker Close", "1 min", "15 min"],
    ["--", "Q&A Buffer", "5-10 min", "20-25 min"],
  ];

  children.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [900, 4200, 2000, 2260],
    rows: timingRows.map((row, ri) =>
      new TableRow({
        tableHeader: ri === 0,
        children: row.map((text, ci) =>
          new TableCell({
            borders,
            width: { size: [900, 4200, 2000, 2260][ci], type: WidthType.DXA },
            shading: { fill: ri === 0 ? NAVY : (ri % 2 === 0 ? LGRAY : "FFFFFF"), type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({
              children: [new TextRun({
                text,
                size: 20,
                font: "Calibri",
                bold: ri === 0,
                color: ri === 0 ? "FFFFFF" : (ci === 2 && ri > 0 ? RED : "27272A"),
              })],
              spacing: { before: 0, after: 0 },
            })],
          })
        ),
      })
    ),
  }));

  children.push(
    spacer(120),
    tip("If you are running long, cut Step 5 (Enterprise Vision) -- you can describe the installation table verbally. Never cut the StormBreaker close. It is the most differentiated moment in the demo."),
    spacer(240),
  );

  // ── EMERGENCY RECOVERY ─────────────────────────────────────────────────────
  children.push(
    h1("EMERGENCY RECOVERY"),
    para("If something breaks during the demo:", { italic: true, color: DGRAY }),
    spacer(60),
    bullet("App not loading: 'Let me restart the dev server -- one moment.' Open terminal, npm run dev, reload. Stay calm."),
    bullet("Wrong page: Use the role switcher in the nav bar or type the URL directly. Don't apologize -- just navigate."),
    bullet("Booking modal won't open: Click a different program card. If still broken: 'I'll walk you through the flow verbally -- it's a 3-step modal: select time, confirm details, confirmation screen.'"),
    bullet("Data looks wrong: 'This is synthetic data built for the demo -- in production this connects to MCCS's live operational systems.'"),
    bullet("Complete crash: Switch to the pitch deck. Walk slides 7 and 8 (Dashboard and Resident Portal) and describe what they would have seen. The story is more important than the demo."),
    spacer(120),
    warning("Never say 'I don't know why that's happening' or 'It was working earlier.' Say: 'Let me show you this a different way' and pivot cleanly. Composure under technical failure is itself a Head of Federal skill."),
    spacer(240),
  );

  // ── CLOSING ────────────────────────────────────────────────────────────────
  children.push(
    h1("THE ONE SENTENCE"),
    para("If you remember nothing else, remember this. Say it at the end of the demo, make eye contact, and stop talking.", { italic: true, color: DGRAY }),
    spacer(60),
    new Paragraph({
      children: [
        new TextRun({
          text: "\"Kaizen already knows how to do this -- recreation, reservations, permitting, payments. MCCS is that same problem at national military scale. StormBreaker means no new ATO, no new contract vehicle. This is a Day 1 deployable.\"",
          size: 26,
          bold: true,
          color: NAVY,
          font: "Calibri",
          italics: true,
        }),
      ],
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.LEFT,
    }),
    spacer(60),
    ruled(),
    new Paragraph({
      children: [new TextRun({ text: "Good luck. You built this. Go get it.", size: 22, color: DGRAY, font: "Calibri", italic: true })],
      spacing: { before: 120, after: 0 },
    }),
  );

  // ── BUILD DOCUMENT ─────────────────────────────────────────────────────────
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          }, {
            level: 1,
            format: LevelFormat.BULLET,
            text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
          }],
        },
      ],
    },
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
      paragraphStyles: [
        {
          id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Calibri", color: NAVY },
          paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 },
        },
        {
          id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: "Calibri", color: RED },
          paragraph: { spacing: { before: 280, after: 80 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "MCCS Camp Pendleton  |  Demo Script  |  Kaizen Labs", size: 16, color: DGRAY, font: "Calibri" }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MGRAY, space: 1 } },
              spacing: { before: 0, after: 120 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "CONFIDENTIAL -- INTERVIEW USE ONLY  |  Page ", size: 16, color: DGRAY, font: "Calibri" }),
                new TextRun({ children: [new PageNumber()], size: 16, color: DGRAY, font: "Calibri" }),
              ],
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: MGRAY, space: 1 } },
              spacing: { before: 120, after: 0 },
            }),
          ],
        }),
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("MCCS-Demo-Script.docx", buffer);
  console.log("Done: MCCS-Demo-Script.docx");
}

buildScript().catch(err => { console.error("Error:", err); process.exit(1); });
