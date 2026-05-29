/**
 * Post-build asset copy for Electron packaging.
 *
 * `next build` with output: "standalone" creates:
 *   .next/standalone/   ← minimal server + node_modules
 *   .next/static/       ← compiled CSS/JS chunks (NOT copied automatically)
 *   public/             ← static files (NOT copied automatically)
 *
 * Both must be present inside standalone/ for the server to serve them.
 * This script does the two required copies.
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠  Source not found, skipping: ${src}`);
    return;
  }
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`  ✓  Copied ${path.relative(root, src)} → ${path.relative(root, dest)}`);
}

console.log("\n[MCCS] Copying static assets into standalone build...\n");

// 1. .next/static → .next/standalone/.next/static
copyDir(
  path.join(root, ".next", "static"),
  path.join(root, ".next", "standalone", ".next", "static")
);

// 2. public/ → .next/standalone/public/
copyDir(
  path.join(root, "public"),
  path.join(root, ".next", "standalone", "public")
);

console.log("\n[MCCS] Standalone is ready for Electron packaging.\n");
