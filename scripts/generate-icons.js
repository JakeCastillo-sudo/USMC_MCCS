#!/usr/bin/env node
// scripts/generate-icons.js
// Generates PWA icons from SVG using the `sharp` module (bundled with Next.js)
// Run: node scripts/generate-icons.js

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const svgPath = path.join(__dirname, "../public/icons/icon.svg");
const iconsDir = path.join(__dirname, "../public/icons");
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function main() {
  const svgBuffer = fs.readFileSync(svgPath);

  for (const size of sizes) {
    const outPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✓ icon-${size}x${size}.png`);
  }

  // Apple splash screen (390×844 — iPhone 14)
  const splashDir = path.join(__dirname, "../public/splash");
  if (!fs.existsSync(splashDir)) fs.mkdirSync(splashDir, { recursive: true });

  // Build a simple splash SVG
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844">
    <rect width="390" height="844" fill="#0C2340"/>
    <rect width="390" height="33" fill="#C8102E"/>
    <rect y="811" width="390" height="33" fill="#C9A84C"/>
    <text x="195" y="390" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="800"
      fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">MCCS</text>
    <text x="195" y="468" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700"
      fill="#C9A84C" text-anchor="middle" dominant-baseline="middle" letter-spacing="3">CAMP PENDLETON</text>
  </svg>`;

  await sharp(Buffer.from(splashSvg))
    .resize(390, 844)
    .png()
    .toFile(path.join(splashDir, "splash-1170x2532.png"));
  console.log("✓ splash-1170x2532.png");

  console.log("\nAll icons generated successfully.");
}

main().catch((err) => {
  console.error("Icon generation failed:", err.message);
  process.exit(1);
});
