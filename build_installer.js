// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require("electron-wix-msi");
const path = require("path");

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64",
const APP_DIR = path.resolve(__dirname, "./CopBrowser-win32-x64");
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
const OUT_DIR = path.resolve(__dirname, "./windows_installer");

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,

  // Configure metadata
  description: "CopBrowser App For Shopify Task Manage",
  exe: "CopBrowser",
  name: "CopBrowser",
  manufacturer: "CopBrowser Inc",
  version: "2.0.0",

  // Configure installer User Interface
  ui: {
    chooseDirectory: false
    // images : {
    //     background : path.join(__dirname,'/build/welcome.bmp'),
    //     banner  : path.join(__dirname,'/build/banner.bmp'),
    //     background : path.join(__dirname,'/build/welcome.bmp'),
    // }
  }
});

// 4. Create a .wxs template file
msiCreator.create().then(function() {
  // Step 5: Compile the template to a .msi file
  msiCreator.compile();
});
