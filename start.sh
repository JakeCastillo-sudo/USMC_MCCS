#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# MCCS Camp Pendleton — Unified Platform Demo
# Kaizen Labs · Operation StormBreaker
# ─────────────────────────────────────────────────────────────────────────────
set -e

RED='\033[0;31m'
NAVY='\033[0;34m'
GREEN='\033[0;32m'
RESET='\033[0m'
BOLD='\033[1m'

echo ""
echo -e "${NAVY}${BOLD}  ██╗  ██╗ ██████╗ ██████╗███████╗${RESET}"
echo -e "${NAVY}${BOLD}  ████╗████║██╔════╝██╔════╝██╔════╝${RESET}"
echo -e "${RED}${BOLD}  ██╔████╔██║██║     ██║     ███████╗${RESET}"
echo -e "${RED}${BOLD}  ██║╚██╔╝██║██║     ██║     ╚════██║${RESET}"
echo -e "${NAVY}${BOLD}  ██║ ╚═╝ ██║╚██████╗╚██████╗███████║${RESET}"
echo -e "${NAVY}${BOLD}  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝╚══════╝${RESET}"
echo ""
echo -e "  ${BOLD}Marine Corps Community Services${RESET}"
echo -e "  Camp Pendleton · Powered by Kaizen Labs"
echo -e "  Operation StormBreaker · AWS Landing Zone"
echo ""
echo -e "  ⚡ ATO Compliant  ·  Zero Trust  ·  FedRAMP Ready"
echo ""
echo "─────────────────────────────────────────────────────────────"

# ── Resolve Node ──────────────────────────────────────────────────────────────
for candidate in \
  "$(command -v node 2>/dev/null)" \
  "/opt/homebrew/bin/node" \
  "/usr/local/bin/node" \
  "/usr/bin/node"; do
  if [ -x "$candidate" ]; then
    NODE="$candidate"
    NPM="$(dirname "$candidate")/npm"
    break
  fi
done

if [ -z "$NODE" ]; then
  echo -e "${RED}✗ Node.js not found. Install it from https://nodejs.org${RESET}"
  exit 1
fi

NODE_VERSION=$("$NODE" --version)
echo -e "  ${GREEN}✓${RESET} Node.js $NODE_VERSION"

# ── Install dependencies if needed ───────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d "node_modules" ]; then
  echo ""
  echo "  Installing dependencies..."
  "$NPM" install --silent
  echo -e "  ${GREEN}✓${RESET} Dependencies installed"
else
  echo -e "  ${GREEN}✓${RESET} Dependencies ready"
fi

# ── Pick port ────────────────────────────────────────────────────────────────
PORT=3000
if lsof -i ":$PORT" &>/dev/null 2>&1; then
  PORT=3001
  echo -e "  ℹ Port 3000 in use — using ${BOLD}3001${RESET}"
fi

# ── Launch dev server ────────────────────────────────────────────────────────
echo ""
echo -e "  ${BOLD}Starting MCCS demo on http://localhost:$PORT${RESET}"
echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# Open browser after a short delay (macOS)
(sleep 3 && open "http://localhost:$PORT" 2>/dev/null || \
            xdg-open "http://localhost:$PORT" 2>/dev/null || true) &

PORT=$PORT "$NPM" run dev
