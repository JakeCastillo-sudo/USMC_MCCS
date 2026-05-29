/**
 * MCCS Camp Pendleton — Kaizen Labs Interview Pitch Deck
 * Run: node generate-deck.js
 * Output: MCCS-Kaizen-PitchDeck.pptx
 *
 * Setup (run once in your mccs-demo directory):
 *   npm install pptxgenjs react react-dom react-icons sharp
 */

const pptxgen = require("pptxgenjs");

// ─── COLOR SYSTEM ───────────────────────────────────────────────────────────
const C = {
  red:       "C8102E",   // MCCS Red
  navy:      "003087",   // MCCS Navy
  gold:      "C9A84C",   // Gold (muted for slides)
  white:     "FFFFFF",
  offwhite:  "F8F9FB",
  zinc100:   "F4F4F5",
  zinc400:   "A1A1AA",
  zinc600:   "52525B",
  zinc800:   "27272A",
  emerald:   "059669",
  amber:     "D97706",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const makeShadow = () => ({
  type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.10
});

function addSlideHeader(slide, title, subtitle) {
  // Left red accent bar
  slide.addShape("rect", {
    x: 0.4, y: 0.28, w: 0.06, h: 0.55,
    fill: { color: C.red }, line: { color: C.red }
  });
  slide.addText(title, {
    x: 0.58, y: 0.22, w: 8.5, h: 0.45,
    fontSize: 22, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.58, y: 0.66, w: 8.5, h: 0.28,
      fontSize: 11, color: C.zinc400, fontFace: "Calibri", margin: 0
    });
  }
  // Footer bar
  slide.addShape("rect", {
    x: 0, y: 5.35, w: 10, h: 0.275,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  slide.addText("MCCS Camp Pendleton  ·  Platform by Kaizen Labs  ·  Operation StormBreaker", {
    x: 0.3, y: 5.35, w: 9.4, h: 0.275,
    fontSize: 8, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });
}

function statCard(slide, x, y, w, h, value, label, sub, color) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: "E4E4E7", width: 0.75 },
    shadow: makeShadow()
  });
  slide.addShape("rect", {
    x, y, w: w, h: 0.055,
    fill: { color: color || C.red }, line: { color: color || C.red }
  });
  slide.addText(value, {
    x: x + 0.18, y: y + 0.12, w: w - 0.36, h: 0.55,
    fontSize: 26, bold: true, color: C.navy, fontFace: "Consolas",
    align: "center", margin: 0
  });
  slide.addText(label, {
    x: x + 0.1, y: y + 0.64, w: w - 0.2, h: 0.22,
    fontSize: 9, bold: true, color: C.zinc600, fontFace: "Calibri",
    align: "center", margin: 0
  });
  if (sub) {
    slide.addText(sub, {
      x: x + 0.1, y: y + 0.85, w: w - 0.2, h: 0.18,
      fontSize: 8, color: C.zinc400, fontFace: "Calibri",
      align: "center", margin: 0
    });
  }
}

function iconRow(slide, x, y, icon, heading, body, color) {
  // Icon circle
  slide.addShape("ellipse", {
    x, y: y - 0.02, w: 0.38, h: 0.38,
    fill: { color: color || C.red, transparency: 88 },
    line: { color: color || C.red, width: 0.5 }
  });
  slide.addText(icon, {
    x, y: y - 0.02, w: 0.38, h: 0.38,
    fontSize: 14, align: "center", valign: "middle", margin: 0
  });
  slide.addText(heading, {
    x: x + 0.48, y: y - 0.01, w: 8.5, h: 0.22,
    fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
  });
  slide.addText(body, {
    x: x + 0.48, y: y + 0.2, w: 8.5, h: 0.28,
    fontSize: 10, color: C.zinc600, fontFace: "Calibri", margin: 0
  });
}

// ─── PRESENTATION ─────────────────────────────────────────────────────────────
async function buildDeck() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Jacob Castillo";
  pres.title = "MCCS Camp Pendleton — Kaizen Labs";

  // ── SLIDE 1 — TITLE ─────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    // Full navy background
    s.background = { color: C.navy };

    // Large red accent block left
    s.addShape("rect", {
      x: 0, y: 0, w: 0.5, h: 5.625,
      fill: { color: C.red }, line: { color: C.red }
    });

    // Gold top accent
    s.addShape("rect", {
      x: 0.5, y: 0, w: 9.5, h: 0.08,
      fill: { color: C.gold }, line: { color: C.gold }
    });

    s.addText("MCCS", {
      x: 0.85, y: 0.7, w: 8.5, h: 1.1,
      fontSize: 72, bold: true, color: C.white, fontFace: "Calibri", margin: 0
    });
    s.addText("CAMP PENDLETON", {
      x: 0.85, y: 1.72, w: 8.5, h: 0.5,
      fontSize: 22, bold: false, color: C.gold, fontFace: "Calibri",
      charSpacing: 6, margin: 0
    });

    // Divider
    s.addShape("rect", {
      x: 0.85, y: 2.42, w: 2.2, h: 0.05,
      fill: { color: C.red }, line: { color: C.red }
    });

    s.addText("Unified Digital Platform", {
      x: 0.85, y: 2.65, w: 8.5, h: 0.42,
      fontSize: 20, color: C.white, fontFace: "Calibri", margin: 0
    });
    s.addText("Marine Corps Community Services  ·  Powered by Kaizen Labs", {
      x: 0.85, y: 3.12, w: 8.5, h: 0.3,
      fontSize: 13, color: "A0AEC0", fontFace: "Calibri", margin: 0
    });

    // StormBreaker badge
    s.addShape("rect", {
      x: 0.85, y: 3.72, w: 3.4, h: 0.62,
      fill: { color: "FFFFFF", transparency: 92 },
      line: { color: C.gold, width: 0.75 }
    });
    s.addText("⚡  Built on Operation StormBreaker", {
      x: 0.9, y: 3.72, w: 3.3, h: 0.35,
      fontSize: 9.5, bold: true, color: C.gold, fontFace: "Calibri",
      valign: "bottom", margin: 0
    });
    s.addText("MCCS AWS Landing Zone  ·  ATO Compliant  ·  Zero Trust", {
      x: 0.9, y: 4.04, w: 3.3, h: 0.26,
      fontSize: 8, color: "A0AEC0", fontFace: "Calibri", margin: 0
    });

    // Candidate info bottom right
    s.addText("Jacob Castillo  ·  Head of Federal — Candidate", {
      x: 5.5, y: 5.1, w: 4.2, h: 0.3,
      fontSize: 9, color: "6B7280", fontFace: "Calibri",
      align: "right", margin: 0
    });
  }

  // ── SLIDE 2 — THE PROBLEM ───────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "The Problem", "Why MCCS digital infrastructure needs modernization");

    // Two-column layout
    // Left: problem statement
    s.addShape("rect", {
      x: 0.4, y: 1.05, w: 4.5, h: 3.9,
      fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
      shadow: makeShadow()
    });
    s.addText("MCCS serves", {
      x: 0.6, y: 1.2, w: 4.1, h: 0.3,
      fontSize: 11, color: C.zinc600, fontFace: "Calibri", margin: 0
    });
    s.addText("180,000+", {
      x: 0.6, y: 1.46, w: 4.1, h: 0.65,
      fontSize: 40, bold: true, color: C.red, fontFace: "Consolas", margin: 0
    });
    s.addText("Marines & family members\nacross 15+ installations worldwide", {
      x: 0.6, y: 2.05, w: 4.1, h: 0.5,
      fontSize: 11, color: C.zinc600, fontFace: "Calibri", margin: 0
    });

    // Divider
    s.addShape("rect", {
      x: 0.6, y: 2.68, w: 3.8, h: 0.03,
      fill: { color: "E4E4E7" }, line: { color: "E4E4E7" }
    });

    s.addText("Today a Marine spouse needs:", {
      x: 0.6, y: 2.82, w: 4.1, h: 0.25,
      fontSize: 10, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });

    const problems = [
      "5 different websites for 5 different services",
      "Phone calls to check childcare availability",
      "No unified booking — paper forms still common",
      "Zero visibility into waitlist status",
      "Leadership has no enterprise data view",
    ];
    problems.forEach((p, i) => {
      s.addShape("ellipse", {
        x: 0.62, y: 3.15 + i * 0.32, w: 0.16, h: 0.16,
        fill: { color: C.red }, line: { color: C.red }
      });
      s.addText(p, {
        x: 0.86, y: 3.11 + i * 0.32, w: 3.8, h: 0.24,
        fontSize: 9.5, color: C.zinc600, fontFace: "Calibri", margin: 0
      });
    });

    // Right: the opportunity
    s.addShape("rect", {
      x: 5.2, y: 1.05, w: 4.5, h: 3.9,
      fill: { color: C.navy }, line: { color: C.navy },
      shadow: makeShadow()
    });
    s.addText("The Opportunity", {
      x: 5.4, y: 1.2, w: 4.1, h: 0.3,
      fontSize: 12, bold: true, color: C.gold, fontFace: "Calibri", margin: 0
    });

    const opps = [
      ["$38.7M", "Annual service revenue\nat Camp Pendleton alone"],
      ["2,250+", "MCCS facilities nationwide\nawait modernization"],
      ["30 days", "StormBreaker ATO timeline\nvs. 18-month legacy process"],
      ["Day 1", "Kaizen deployable — no new\nATO, no new contract vehicle"],
    ];
    opps.forEach(([val, label], i) => {
      s.addText(val, {
        x: 5.4, y: 1.62 + i * 0.82, w: 1.5, h: 0.42,
        fontSize: 22, bold: true, color: C.white, fontFace: "Consolas", margin: 0
      });
      s.addText(label, {
        x: 6.95, y: 1.64 + i * 0.82, w: 2.55, h: 0.42,
        fontSize: 9, color: "A0AEC0", fontFace: "Calibri", margin: 0
      });
      if (i < 3) {
        s.addShape("rect", {
          x: 5.4, y: 2.02 + i * 0.82, w: 3.9, h: 0.02,
          fill: { color: "FFFFFF", transparency: 85 }, line: { color: "FFFFFF", transparency: 85 }
        });
      }
    });
  }

  // ── SLIDE 3 — THE SOLUTION ──────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "The Solution", "A Kaizen Labs modular platform, deployed on Operation StormBreaker");

    // Center architecture diagram — three boxes with arrows
    const boxes = [
      { x: 0.4,  label: "Resident Portal", sub: "Marines & Families", color: C.red,   icon: "🏠" },
      { x: 3.65, label: "Kaizen Platform", sub: "Modular Core Services", color: C.navy, icon: "⚙️" },
      { x: 6.9,  label: "Leadership Dashboard", sub: "MCCS HQ & Commanders", color: C.gold, icon: "📊" },
    ];

    boxes.forEach(({ x, label, sub, color, icon }) => {
      s.addShape("rect", {
        x, y: 1.2, w: 2.9, h: 2.6,
        fill: { color: C.white }, line: { color, width: 1.5 },
        shadow: makeShadow()
      });
      // Top color bar
      s.addShape("rect", {
        x, y: 1.2, w: 2.9, h: 0.08,
        fill: { color }, line: { color }
      });
      s.addText(icon, {
        x, y: 1.45, w: 2.9, h: 0.55,
        fontSize: 28, align: "center", valign: "middle", margin: 0
      });
      s.addText(label, {
        x: x + 0.1, y: 2.06, w: 2.7, h: 0.35,
        fontSize: 12, bold: true, color: C.navy, fontFace: "Calibri",
        align: "center", margin: 0
      });
      s.addText(sub, {
        x: x + 0.1, y: 2.38, w: 2.7, h: 0.24,
        fontSize: 9, color: C.zinc400, fontFace: "Calibri",
        align: "center", margin: 0
      });
    });

    // Arrows between boxes
    [3.32, 6.57].forEach(ax => {
      s.addShape("rect", {
        x: ax, y: 2.38, w: 0.3, h: 0.06,
        fill: { color: C.zinc400 }, line: { color: C.zinc400 }
      });
      s.addText("▶", {
        x: ax + 0.18, y: 2.3, w: 0.25, h: 0.22,
        fontSize: 10, color: C.zinc400, align: "center", margin: 0
      });
    });

    // StormBreaker foundation bar
    s.addShape("rect", {
      x: 0.4, y: 4.02, w: 9.4, h: 0.72,
      fill: { color: C.navy }, line: { color: C.navy },
      shadow: makeShadow()
    });
    s.addText("⚡  Operation StormBreaker  —  MCCS AWS Landing Zone  ·  Zero Trust  ·  ATO Compliant  ·  FedRAMP Ready  ·  FS Form 7600A Fundable", {
      x: 0.5, y: 4.02, w: 9.2, h: 0.72,
      fontSize: 10, color: C.gold, fontFace: "Calibri",
      align: "center", valign: "middle", bold: true, margin: 0
    });

    // "Foundation" label
    s.addText("Deployment Infrastructure", {
      x: 0.4, y: 3.88, w: 9.4, h: 0.2,
      fontSize: 8, color: C.zinc400, fontFace: "Calibri",
      align: "center", margin: 0
    });
  }

  // ── SLIDE 4 — MARKET EXPERTISE ──────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "Market Expertise Required", "Why this concept demanded deep domain knowledge across four disciplines");

    const cards = [
      {
        x: 0.4, y: 1.05, color: C.red,
        icon: "🎯", title: "Federal Procurement",
        points: [
          "Identified FS Form 7600A as the no-contract funding path",
          "Recognized StormBreaker as the deployment accelerant",
          "Understood RAISE framework & Navy ATO authorization",
          "Knew 18-month ATO problem — and the 30-day solution",
        ]
      },
      {
        x: 5.15, y: 1.05, color: C.navy,
        icon: "🪖", title: "Military Community Knowledge",
        points: [
          "MCCS operates like a private business — revenue funds QoL",
          "Camp Pendleton: 40K Marines + 60K families = 100K patrons",
          "CDC waitlists are a known, chronic pain point for families",
          "Single Marine Program, EFMP, LINKS — real program names matter",
        ]
      },
      {
        x: 0.4, y: 3.18, color: C.emerald,
        icon: "🏗️", title: "Civic Tech Landscape",
        points: [
          "Positioned Kaizen's existing modules as the right fit",
          "Knew USDS/Ad Hoc had modernized VA.gov — chose MCCS instead",
          "Recreation, reservations, permitting = Kaizen's core competency",
          "Modular platform = faster deployment, lower risk for federal buyer",
        ]
      },
      {
        x: 5.15, y: 3.18, color: C.amber,
        icon: "📐", title: "Product & Technical Depth",
        points: [
          "Designed two surfaces: resident UX + leadership dashboard",
          "Scoped synthetic data with internal consistency rules",
          "Built Next.js 16 + TypeScript + Recharts full-stack in 5 days",
          "Embedded Demo Guide — 9-step interview narrative in the app",
        ]
      },
    ];

    cards.forEach(({ x, y, color, icon, title, points }) => {
      s.addShape("rect", {
        x, y, w: 4.55, h: 2.0,
        fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
        shadow: makeShadow()
      });
      s.addShape("rect", {
        x, y, w: 0.07, h: 2.0,
        fill: { color }, line: { color }
      });
      s.addText(`${icon}  ${title}`, {
        x: x + 0.18, y: y + 0.1, w: 4.2, h: 0.3,
        fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
      });
      points.forEach((pt, i) => {
        s.addShape("rect", {
          x: x + 0.18, y: y + 0.52 + i * 0.34, w: 0.07, h: 0.12,
          fill: { color }, line: { color }
        });
        s.addText(pt, {
          x: x + 0.34, y: y + 0.48 + i * 0.34, w: 4.0, h: 0.28,
          fontSize: 9, color: C.zinc600, fontFace: "Calibri", margin: 0
        });
      });
    });
  }

  // ── SLIDE 5 — HOW WE BUILT IT ───────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "How It Was Built", "Front to back — from concept to production-ready demo in 5 days");

    const steps = [
      {
        num: "01", color: C.red,
        title: "Strategic Framing",
        lines: ["Identified MCCS as the Kaizen beachhead", "Chose Camp Pendleton — largest Marine base", "Anchored to StormBreaker infrastructure"],
      },
      {
        num: "02", color: C.navy,
        title: "Real Data Scraping",
        lines: ["Scraped pendleton.usmc-mccs.org", "12 fitness centers, real facility names", "15 installations for enterprise teaser"],
      },
      {
        num: "03", color: C.emerald,
        title: "Technical Spec",
        lines: ["SPEC.md — 11-section north star doc", "Full data model, component map, API schema", "Synthetic data consistency rules"],
      },
      {
        num: "04", color: C.amber,
        title: "Data Fixtures",
        lines: ["7 JSON fixture files, 144 revenue entries", "Internally consistent: revenue × utilization × CSAT", "Self-audited and corrected by Claude Code"],
      },
      {
        num: "05", color: "7C3AED",
        title: "API Layer",
        lines: ["8 Next.js API routes", "Filtering, sorting, computed alerts", "TypeScript types across full stack"],
      },
      {
        num: "06", color: "0891B2",
        title: "Dashboard & Portal",
        lines: ["8 dashboard components + 5 pages", "6 resident components + 5 pages", "Booking modal, sparklines, utilization grid"],
      },
    ];

    steps.forEach(({ num, color, title, lines }, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.4 + col * 3.2;
      const y = 1.1 + row * 2.05;

      s.addShape("rect", {
        x, y, w: 3.0, h: 1.82,
        fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
        shadow: makeShadow()
      });
      // Number badge
      s.addShape("rect", {
        x, y, w: 0.52, h: 0.52,
        fill: { color }, line: { color }
      });
      s.addText(num, {
        x, y, w: 0.52, h: 0.52,
        fontSize: 14, bold: true, color: C.white, fontFace: "Consolas",
        align: "center", valign: "middle", margin: 0
      });
      s.addText(title, {
        x: x + 0.62, y: y + 0.1, w: 2.28, h: 0.32,
        fontSize: 10.5, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
      });
      lines.forEach((line, li) => {
        s.addText(`· ${line}`, {
          x: x + 0.14, y: y + 0.58 + li * 0.36, w: 2.72, h: 0.3,
          fontSize: 8.5, color: C.zinc600, fontFace: "Calibri", margin: 0
        });
      });
    });
  }

  // ── SLIDE 6 — TECH STACK ────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "Technical Architecture", "Production-grade stack — deployable into StormBreaker on Day 1");

    // Left column — stack breakdown
    const stack = [
      { layer: "Framework",   tech: "Next.js 16 (App Router)",      why: "React + API routes in one project" },
      { layer: "Language",    tech: "TypeScript",                     why: "Full type safety across all layers" },
      { layer: "Styling",     tech: "Tailwind CSS + shadcn/ui Nova",  why: "Production-grade, accessible components" },
      { layer: "Charts",      tech: "Recharts",                       why: "React-native, responsive dashboards" },
      { layer: "Data",        tech: "JSON fixtures → API routes",     why: "No DB needed — swap in real APIs later" },
      { layer: "Deployment",  tech: "Operation StormBreaker (AWS)",   why: "ATO already certified — no 18-month wait" },
    ];

    s.addShape("rect", {
      x: 0.4, y: 1.05, w: 5.8, h: 4.0,
      fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
      shadow: makeShadow()
    });

    // Table header
    s.addShape("rect", {
      x: 0.4, y: 1.05, w: 5.8, h: 0.38,
      fill: { color: C.navy }, line: { color: C.navy }
    });
    ["Layer", "Technology", "Why It Fits"].forEach((h, i) => {
      s.addText(h, {
        x: 0.55 + [0, 1.2, 3.2][i], y: 1.08, w: [1.1, 1.9, 2.6][i], h: 0.3,
        fontSize: 9, bold: true, color: C.white, fontFace: "Calibri", margin: 0
      });
    });

    stack.forEach(({ layer, tech, why }, i) => {
      const rowY = 1.48 + i * 0.52;
      if (i % 2 === 0) {
        s.addShape("rect", {
          x: 0.4, y: rowY, w: 5.8, h: 0.5,
          fill: { color: C.zinc100 }, line: { color: C.zinc100 }
        });
      }
      s.addText(layer, {
        x: 0.55, y: rowY + 0.1, w: 1.1, h: 0.3,
        fontSize: 8.5, bold: true, color: C.red, fontFace: "Calibri", margin: 0
      });
      s.addText(tech, {
        x: 1.75, y: rowY + 0.1, w: 1.9, h: 0.3,
        fontSize: 8.5, color: C.navy, fontFace: "Consolas", margin: 0
      });
      s.addText(why, {
        x: 3.75, y: rowY + 0.1, w: 2.3, h: 0.3,
        fontSize: 8.5, color: C.zinc600, fontFace: "Calibri", margin: 0
      });
    });

    // Right column — key metrics
    s.addShape("rect", {
      x: 6.45, y: 1.05, w: 3.25, h: 4.0,
      fill: { color: C.navy }, line: { color: C.navy },
      shadow: makeShadow()
    });
    s.addText("By the Numbers", {
      x: 6.6, y: 1.2, w: 2.9, h: 0.3,
      fontSize: 11, bold: true, color: C.gold, fontFace: "Calibri", margin: 0
    });

    const nums = [
      ["5", "prompts to full build"],
      ["7", "JSON fixture files"],
      ["8", "API routes"],
      ["14", "React components"],
      ["10", "pages — 2 surfaces"],
      ["9", "step demo guide"],
    ];
    nums.forEach(([n, label], i) => {
      s.addText(n, {
        x: 6.6, y: 1.65 + i * 0.52, w: 0.65, h: 0.42,
        fontSize: 24, bold: true, color: C.red, fontFace: "Consolas", margin: 0
      });
      s.addText(label, {
        x: 7.3, y: 1.72 + i * 0.52, w: 2.2, h: 0.28,
        fontSize: 9, color: "A0AEC0", fontFace: "Calibri", margin: 0
      });
    });
  }

  // ── SLIDE 7 — DASHBOARD METRICS ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "Leadership Dashboard — Camp Pendleton", "Real-time command view: revenue, utilization, satisfaction, engagement");

    // KPI stat cards — row of 6
    const kpis = [
      { v: "$4.2M",   l: "Monthly Revenue",   sub: "↑ 8.3% vs last month", color: C.red },
      { v: "$38.7M",  l: "YTD Revenue",        sub: "On track vs $42M target", color: C.navy },
      { v: "4.3/5.0", l: "Avg CSAT",           sub: "Across all programs", color: C.emerald },
      { v: "78%",     l: "Utilization",         sub: "Weighted avg, 12 sites", color: C.amber },
      { v: "22,400",  l: "Active Patrons",      sub: "22% of eligible pop.", color: "7C3AED" },
      { v: "14,850",  l: "Bookings / Month",    sub: "↑ 21.7% MoM", color: "0891B2" },
    ];

    kpis.forEach(({ v, l, sub, color }, i) => {
      statCard(s, 0.4 + i * 1.55, 1.05, 1.42, 1.18, v, l, sub, color);
    });

    // Revenue chart (native)
    s.addChart(pres.charts.BAR, [
      {
        name: "2025 Revenue ($M)",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [3.42, 3.55, 3.68, 3.61, 3.82, 4.28, 4.51, 4.38, 4.15, 4.05, 4.18, 4.31]
      }
    ], {
      x: 0.4, y: 2.42, w: 5.8, h: 2.5,
      barDir: "col",
      chartColors: [C.red],
      chartArea: { fill: { color: C.white }, roundedCorners: false },
      catAxisLabelColor: C.zinc600,
      valAxisLabelColor: C.zinc600,
      valGridLine: { color: "E4E4E7", size: 0.5 },
      catGridLine: { style: "none" },
      showLegend: false,
      showTitle: true,
      title: "Monthly Revenue 2025 ($M)",
      titleFontSize: 10,
      titleColor: C.navy,
    });

    // Alerts panel on right
    s.addShape("rect", {
      x: 6.45, y: 2.42, w: 3.25, h: 2.5,
      fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
      shadow: makeShadow()
    });
    s.addText("🔔  Operational Alerts", {
      x: 6.58, y: 2.52, w: 3.0, h: 0.28,
      fontSize: 10, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });

    const alerts = [
      { icon: "🔴", text: "CDC-1 waitlist — 187 families", sub: "Immediate action required" },
      { icon: "🔴", text: "CDC-2 waitlist — 43 families", sub: "Critical capacity" },
      { icon: "🟡", text: "21 Area Pool CSAT → 3.7", sub: "Trending down, review maintenance" },
      { icon: "🟢", text: "Group Exercise ↑ 18% MoM", sub: "New schedule driving growth" },
      { icon: "🟢", text: "ITT Travel — CSAT 4.8", sub: "Top-rated program on base" },
    ];
    alerts.forEach(({ icon, text, sub }, i) => {
      s.addText(`${icon}  ${text}`, {
        x: 6.58, y: 2.92 + i * 0.37, w: 3.0, h: 0.2,
        fontSize: 9, bold: true, color: C.zinc800, fontFace: "Calibri", margin: 0
      });
      s.addText(`    ${sub}`, {
        x: 6.58, y: 3.1 + i * 0.37, w: 3.0, h: 0.18,
        fontSize: 8, color: C.zinc400, fontFace: "Calibri", margin: 0
      });
    });
  }

  // ── SLIDE 8 — RESIDENT PORTAL ───────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "Resident Portal — Marine & Family Experience", "One unified app replacing 5 siloed websites");

    // Left: user journey
    s.addShape("rect", {
      x: 0.4, y: 1.05, w: 4.5, h: 3.9,
      fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
      shadow: makeShadow()
    });
    s.addText("Before Kaizen", {
      x: 0.55, y: 1.15, w: 4.2, h: 0.28,
      fontSize: 10, bold: true, color: C.red, fontFace: "Calibri", margin: 0
    });
    [
      "Google 'Camp Pendleton childcare'",
      "Navigate to pendleton.usmc-mccs.org",
      "Find CDC page — no availability info",
      "Call during business hours to ask",
      "Told to call back — no online booking",
      "Search separately for gym class schedule",
      "Different website, different login",
    ].forEach((step, i) => {
      s.addText(`${i + 1}.  ${step}`, {
        x: 0.55, y: 1.52 + i * 0.44, w: 4.15, h: 0.35,
        fontSize: 9, color: i < 5 ? C.zinc600 : C.zinc400,
        fontFace: "Calibri", margin: 0,
        italic: i >= 5
      });
    });

    // Arrow
    s.addText("→", {
      x: 4.92, y: 2.4, w: 0.35, h: 0.5,
      fontSize: 22, color: C.red, align: "center", margin: 0
    });

    // Right: after
    s.addShape("rect", {
      x: 5.2, y: 1.05, w: 4.5, h: 3.9,
      fill: { color: C.navy }, line: { color: C.navy },
      shadow: makeShadow()
    });
    s.addText("After Kaizen", {
      x: 5.35, y: 1.15, w: 4.2, h: 0.28,
      fontSize: 10, bold: true, color: C.gold, fontFace: "Calibri", margin: 0
    });

    const afters = [
      ["🏠", "One app, one login — all MCCS services"],
      ["🔍", "Search across fitness, childcare, dining"],
      ["👶", "Childcare availability + waitlist — live"],
      ["📅", "Book a fitness class in 3 taps"],
      ["✅", "Instant confirmation + booking reference"],
      ["📊", "Leadership sees all of it in real-time"],
    ];
    afters.forEach(([icon, text], i) => {
      s.addShape("rect", {
        x: 5.35, y: 1.5 + i * 0.52, w: 0.35, h: 0.35,
        fill: { color: C.red }, line: { color: C.red }
      });
      s.addText(icon, {
        x: 5.35, y: 1.5 + i * 0.52, w: 0.35, h: 0.35,
        fontSize: 13, align: "center", valign: "middle", margin: 0
      });
      s.addText(text, {
        x: 5.78, y: 1.55 + i * 0.52, w: 3.75, h: 0.28,
        fontSize: 9.5, color: C.white, fontFace: "Calibri", margin: 0
      });
    });
  }

  // ── SLIDE 9 — STORMBREAKER ──────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Gold top stripe
    s.addShape("rect", {
      x: 0, y: 0, w: 10, h: 0.1,
      fill: { color: C.gold }, line: { color: C.gold }
    });

    s.addText("⚡", {
      x: 0.5, y: 0.55, w: 1.2, h: 1.2,
      fontSize: 56, align: "center", valign: "middle", margin: 0
    });

    s.addText("Operation StormBreaker", {
      x: 1.8, y: 0.62, w: 7.8, h: 0.55,
      fontSize: 28, bold: true, color: C.gold, fontFace: "Calibri", margin: 0
    });
    s.addText("Why this is the deployment story — not just the product story", {
      x: 1.8, y: 1.17, w: 7.8, h: 0.3,
      fontSize: 12, color: "A0AEC0", fontFace: "Calibri", margin: 0
    });

    // Divider
    s.addShape("rect", {
      x: 0.5, y: 1.62, w: 9.0, h: 0.03,
      fill: { color: "FFFFFF", transparency: 80 }, line: { color: "FFFFFF", transparency: 80 }
    });

    const facts = [
      { icon: "⏱️", stat: "18 months → 30 days", desc: "ATO timeline reduction — MCCS's own DevSecOps platform cuts authorization to 30 days, same-day for containerized workloads" },
      { icon: "🔒", stat: "Zero Trust by default", desc: "Navy RAISE framework certified. Kaizen deploys into an environment that already meets federal security requirements" },
      { icon: "💰", stat: "No contract vehicle needed", desc: "Fundable via FS Form 7600A. Terms align to MCCS's budgeting cycle. No new procurement — no 12-month acquisition delay" },
      { icon: "🚀", stat: "Day 1 deployable", desc: "Kaizen's modular platform + StormBreaker's certified AWS landing zone = the fastest path to production in federal gov tech" },
    ];

    facts.forEach(({ icon, stat, desc }, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = 0.5 + col * 4.75;
      const y = 1.82 + row * 1.62;

      s.addShape("rect", {
        x, y, w: 4.45, h: 1.42,
        fill: { color: "FFFFFF", transparency: 92 },
        line: { color: C.gold, width: 0.75 }
      });
      s.addText(`${icon}  ${stat}`, {
        x: x + 0.18, y: y + 0.12, w: 4.1, h: 0.3,
        fontSize: 11, bold: true, color: C.gold, fontFace: "Calibri", margin: 0
      });
      s.addText(desc, {
        x: x + 0.18, y: y + 0.46, w: 4.1, h: 0.82,
        fontSize: 9, color: "D1D5DB", fontFace: "Calibri", margin: 0
      });
    });
  }

  // ── SLIDE 10 — ENTERPRISE VISION ────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offwhite };
    addSlideHeader(s, "Enterprise Vision", "Pendleton is the pilot. The architecture scales to every installation.");

    // Installations table
    s.addShape("rect", {
      x: 0.4, y: 1.05, w: 5.6, h: 3.9,
      fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
      shadow: makeShadow()
    });

    // Table header
    s.addShape("rect", {
      x: 0.4, y: 1.05, w: 5.6, h: 0.36,
      fill: { color: C.navy }, line: { color: C.navy }
    });
    ["Installation", "Population", "Status"].forEach((h, i) => {
      s.addText(h, {
        x: 0.55 + [0, 2.5, 4.5][i], y: 1.1, w: [2.4, 1.9, 1.0][i], h: 0.26,
        fontSize: 9, bold: true, color: C.white, fontFace: "Calibri", margin: 0
      });
    });

    const installs = [
      { name: "Camp Pendleton, CA",     pop: "100,000",  status: "● LIVE",         live: true },
      { name: "Camp Lejeune, NC",        pop: "155,000",  status: "Coming Soon",    live: false },
      { name: "MCB Hawaii",              pop: "18,000",   status: "Coming Soon",    live: false },
      { name: "Quantico, VA (HQ)",       pop: "28,000",   status: "Coming Soon",    live: false },
      { name: "MCAS Miramar, CA",        pop: "24,000",   status: "Coming Soon",    live: false },
      { name: "29 Palms, CA",            pop: "22,000",   status: "Coming Soon",    live: false },
      { name: "Okinawa, Japan",          pop: "19,000",   status: "Coming Soon",    live: false },
      { name: "8 more installations...", pop: "—",        status: "Coming Soon",    live: false },
    ];

    installs.forEach(({ name, pop, status, live }, i) => {
      const rowY = 1.44 + i * 0.42;
      if (live) {
        s.addShape("rect", {
          x: 0.4, y: rowY, w: 5.6, h: 0.4,
          fill: { color: "FEF2F2" }, line: { color: "FEF2F2" }
        });
      } else if (i % 2 === 1) {
        s.addShape("rect", {
          x: 0.4, y: rowY, w: 5.6, h: 0.4,
          fill: { color: C.zinc100 }, line: { color: C.zinc100 }
        });
      }
      s.addText(name, {
        x: 0.55, y: rowY + 0.08, w: 2.4, h: 0.26,
        fontSize: 9, bold: live, color: live ? C.red : C.zinc600,
        fontFace: "Calibri", margin: 0
      });
      s.addText(pop, {
        x: 3.05, y: rowY + 0.08, w: 1.5, h: 0.26,
        fontSize: 9, color: live ? C.navy : C.zinc400, fontFace: "Calibri",
        margin: 0, bold: live
      });
      s.addText(status, {
        x: 4.75, y: rowY + 0.08, w: 1.1, h: 0.26,
        fontSize: 9, bold: live, color: live ? C.emerald : C.zinc400,
        fontFace: "Calibri", margin: 0
      });
    });

    // Right side — market size
    s.addShape("rect", {
      x: 6.2, y: 1.05, w: 3.5, h: 1.75,
      fill: { color: C.red }, line: { color: C.red },
      shadow: makeShadow()
    });
    s.addText("518,000+", {
      x: 6.35, y: 1.15, w: 3.2, h: 0.65,
      fontSize: 34, bold: true, color: C.white, fontFace: "Consolas",
      align: "center", margin: 0
    });
    s.addText("Total Marines & families\nacross all MCCS installations", {
      x: 6.35, y: 1.78, w: 3.2, h: 0.42,
      fontSize: 9, color: "FFAAAA", fontFace: "Calibri",
      align: "center", margin: 0
    });

    s.addShape("rect", {
      x: 6.2, y: 2.97, w: 3.5, h: 1.98,
      fill: { color: C.white }, line: { color: "E4E4E7", width: 0.75 },
      shadow: makeShadow()
    });
    s.addText("The Path Forward", {
      x: 6.35, y: 3.07, w: 3.2, h: 0.28,
      fontSize: 10, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    [
      "Pendleton pilot → validate model",
      "Lejeune + Hawaii → prove scale",
      "Enterprise rollup → HQ dashboard",
      "15 installations → national platform",
    ].forEach((step, i) => {
      s.addText(`${i + 1}.  ${step}`, {
        x: 6.35, y: 3.42 + i * 0.36, w: 3.2, h: 0.3,
        fontSize: 9, color: C.zinc600, fontFace: "Calibri", margin: 0
      });
    });
  }

  // ── SLIDE 11 — THE PITCH CLOSE ──────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addShape("rect", {
      x: 0, y: 0, w: 10, h: 0.1,
      fill: { color: C.red }, line: { color: C.red }
    });
    s.addShape("rect", {
      x: 0, y: 5.525, w: 10, h: 0.1,
      fill: { color: C.gold }, line: { color: C.gold }
    });

    s.addText("The Close", {
      x: 0.6, y: 0.55, w: 8.8, h: 0.45,
      fontSize: 14, color: C.gold, fontFace: "Calibri",
      charSpacing: 4, margin: 0
    });

    s.addText('"Kaizen already knows how to do this."', {
      x: 0.6, y: 1.1, w: 8.8, h: 0.65,
      fontSize: 26, bold: true, color: C.white, fontFace: "Calibri", margin: 0
    });

    const lines = [
      "Recreation, reservations, permitting, payments — that's Kaizen's core.",
      "MCCS is that same problem at national military scale.",
      "StormBreaker means no new ATO. No new contract vehicle.",
      "This is a Day 1 deployable — built on infrastructure MCCS already certified.",
    ];

    lines.forEach((line, i) => {
      s.addShape("rect", {
        x: 0.6, y: 1.92 + i * 0.55, w: 0.06, h: 0.32,
        fill: { color: C.red }, line: { color: C.red }
      });
      s.addText(line, {
        x: 0.78, y: 1.9 + i * 0.55, w: 8.6, h: 0.36,
        fontSize: 13, color: "D1D5DB", fontFace: "Calibri", margin: 0
      });
    });

    // Divider
    s.addShape("rect", {
      x: 0.6, y: 4.18, w: 8.8, h: 0.03,
      fill: { color: "FFFFFF", transparency: 80 }, line: { color: "FFFFFF", transparency: 80 }
    });

    s.addText("Jacob Castillo  ·  Head of Federal Candidate  ·  Kaizen Labs", {
      x: 0.6, y: 4.32, w: 8.8, h: 0.32,
      fontSize: 11, color: C.gold, fontFace: "Calibri", margin: 0
    });
    s.addText("Demo live at localhost:3000  ·  Built in 5 days on Next.js 16 + Operation StormBreaker", {
      x: 0.6, y: 4.68, w: 8.8, h: 0.26,
      fontSize: 9, color: "6B7280", fontFace: "Calibri", margin: 0
    });
  }

  // ─── WRITE FILE ──────────────────────────────────────────────────────────────
  await pres.writeFile({ fileName: "MCCS-Kaizen-PitchDeck.pptx" });
  console.log("✅  MCCS-Kaizen-PitchDeck.pptx created successfully.");
}

buildDeck().catch(err => {
  console.error("❌  Error generating deck:", err);
  process.exit(1);
});
