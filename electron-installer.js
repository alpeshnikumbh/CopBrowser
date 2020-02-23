const electronInstaller = require("electron-winstaller");

async () => {
  try {
    electronInstaller.createWindowsInstaller({
      appDirectory: "./CopBrowser-win32-x64",
      outputDirectory: "./installer64",
      authors: "Copbrowser@2020",
      exe: "CopBrowser.exe"
    });
    console.log("It worked!");
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
};
