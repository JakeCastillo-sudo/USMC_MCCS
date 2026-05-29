/**
 * MCCS Camp Pendleton — Electron Main Process
 * Kaizen Labs · Operation StormBreaker
 *
 * Architecture:
 *   1. Locate the Next.js standalone server (dev: .next/standalone, packaged: Resources/server)
 *   2. Require it in-process — starts an HTTP server on PORT 3000
 *   3. Poll until the port is ready, then open a BrowserWindow
 */

const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
const http = require("http");

// ── Config ──────────────────────────────────────────────────────────────────
const PORT = 3000;
const HOST = "127.0.0.1";
const isDev = !app.isPackaged;

let mainWindow = null;

// ── Path resolution ─────────────────────────────────────────────────────────
function getServerPath() {
  if (isDev) {
    // Development: use the local standalone build
    return path.join(__dirname, "..", ".next", "standalone", "server.js");
  }
  // Packaged: electron-builder copies standalone → Resources/server
  return path.join(process.resourcesPath, "server", "server.js");
}

// ── Start Next.js server in-process ─────────────────────────────────────────
function startServer() {
  const serverPath = getServerPath();

  process.env.PORT = String(PORT);
  process.env.HOSTNAME = HOST;
  process.env.NODE_ENV = "production";

  try {
    require(serverPath);
    console.log(`[MCCS] Next.js server starting on http://${HOST}:${PORT}`);
  } catch (err) {
    console.error("[MCCS] Failed to start Next.js server:", err.message);
    console.error(
      "[MCCS] Make sure you ran: npm run build\n       (which creates .next/standalone/)"
    );
    app.quit();
  }
}

// ── Wait for HTTP port to be ready ──────────────────────────────────────────
function waitForServer(retries = 50, delay = 300) {
  return new Promise((resolve, reject) => {
    function attempt() {
      const req = http
        .get(`http://${HOST}:${PORT}`, (res) => {
          res.destroy();
          resolve();
        })
        .on("error", () => {
          if (retries-- > 0) {
            setTimeout(attempt, delay);
          } else {
            reject(
              new Error(
                `Server on port ${PORT} never became available after ${
                  50 * delay
                }ms`
              )
            );
          }
        });
      req.setTimeout(500, () => req.destroy());
    }
    attempt();
  });
}

// ── Create browser window ───────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "MCCS Camp Pendleton",

    // macOS: traffic lights inside the window chrome
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 18 },

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },

    backgroundColor: "#003087", // navy — shows while page loads
  });

  // Load the app
  mainWindow.loadURL(`http://${HOST}:${PORT}`);

  // Open external links in the system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Build a simple native menu
  buildMenu();
}

// ── Native menu ─────────────────────────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "Navigation",
      submenu: [
        {
          label: "Home",
          accelerator: "CmdOrCtrl+H",
          click: () => mainWindow?.loadURL(`http://${HOST}:${PORT}/`),
        },
        {
          label: "Resident Portal",
          accelerator: "CmdOrCtrl+R",
          click: () => mainWindow?.loadURL(`http://${HOST}:${PORT}/resident`),
        },
        {
          label: "Leadership Dashboard",
          accelerator: "CmdOrCtrl+D",
          click: () => mainWindow?.loadURL(`http://${HOST}:${PORT}/dashboard`),
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(isDev ? [{ type: "separator" }, { role: "toggleDevTools" }] : []),
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac ? [{ type: "separator" }, { role: "front" }] : []),
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  // Security: restrict navigation to localhost only
  app.on("web-contents-created", (_, contents) => {
    contents.on("will-navigate", (event, url) => {
      if (!url.startsWith(`http://${HOST}:${PORT}`)) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });
  });

  startServer();

  try {
    await waitForServer();
    createWindow();
  } catch (err) {
    console.error("[MCCS]", err.message);
    app.quit();
  }
});

// macOS: re-create window when dock icon is clicked
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit when all windows are closed (except macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
