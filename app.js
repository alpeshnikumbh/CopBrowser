// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, remote } = require("electron");
const path = require("path");
const isActivated = 0;
let db = require("electron-db");
let basePath = app.getAppPath();
let assetPath = path.join(basePath, "assets");
let dbPath = path.join(basePath, "db");
const { autoUpdater } = require("electron-updater");

let mainWindow;

// require("update-electron-app")({
//   repo: "https://github.com/alpeshnikumbh/CopBrowser.git",
//   updateInterval: "5 minute",
//   logger: require("electron-log"),
//   notifyUser: true
// });

async function createWindow() {
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
  const {
    width,
    height
  } = require("electron").screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // minWidth: 1200,
    // minHeight: 700,
    width: 800,
    height: 500,
    minWidth: 800,
    minHeight: 500,
    maxWidth: width,
    maxHeight: height,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "./build/icon.ico"
  });

  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update_available");
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update_downloaded");
  });

  ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
  });

  // and load the index.html of the app.
  let Login = () => {
    db.getRows("user", dbPath, {}, async (succ, data) => {
      if (data.length > 0) {
        await mainWindow.setSize(1200, 700);
        await mainWindow.setMinimumSize(1200, 700);
        await mainWindow.center();

        mainWindow.loadFile(path.join(assetPath, "/index.html"));
      } else {
        mainWindow.loadFile(path.join(assetPath, `/activatePage.html`));
      }

      // Open the DevTools.
      // mainWindow.webContents.openDevTools()

      mainWindow.on("closed", function() {
        mainWindow = null;
      });

      ipcMain.on("event_non_active_redirect", async (event, arg) => {
        await mainWindow.setMinimumSize(800, 500);
        await mainWindow.setSize(800, 500);
        await mainWindow.center();

        await mainWindow.loadFile(path.join(assetPath, `/activatePage.html`));
      });

      ipcMain.on("event_activated_redirect", async (event, arg) => {
        await mainWindow.setSize(1200, 700);
        await mainWindow.setMinimumSize(1200, 700);
        await mainWindow.center();

        await mainWindow.loadFile(
          path.join(assetPath, `/activationLoading.html`)
        );
        setTimeout(async () => {
          mainWindow.loadFile(path.join(assetPath, "/index.html"));
        }, 2000);
      });
    });
  };

  Login();
}

ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
});

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
