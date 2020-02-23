/**
 *  Common Main JS File For Application
 */
const { shell, ipcRenderer, remote } = require("electron");
const path = require("path");
const fs = require("fs");
const db = require("electron-db");
const momment = require("moment");
const uuid = require("uuid");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const csvtojsonV2 = require("csvtojson/v2");
const jsoncsv = require("json-csv");
const Discord = require("discord.js");
let webhookUrl = "";
let defaultRegion = "";
let taskInterval = 0;
let StatusManager = [];

let bsDisableImg = false;
let ysDisableImg = false;
let adidasDisableImg = false;

puppeteer.use(pluginStealth());

const axios = require("axios");

const { app, dialog } = require("electron").remote;
const basePath = app.getAppPath();

const dbPath = path.join(basePath, "db");
const assetPath = path.join(basePath, "assets");
const assetJSPath = path.join(assetPath, "js");

const Tasks = require(`${assetJSPath}/tasks`);
const CreateTasks = require(`${assetJSPath}/createTasks`);
const Proxies = require(`${assetJSPath}/proxies`);
const Profiles = require(`${assetJSPath}/profiles`);
const Settings = require(`${assetJSPath}/settings`);
const Navigation = require(`${assetJSPath}/navigation`);
const Activation = require(`${assetJSPath}/activate`);
const YeezySupply = require(`${assetJSPath}/yeezySupply`);
const Adidas = require(`${assetJSPath}/adidas`);
const BrowserSpoofer = require(`${assetJSPath}/browserSpoofer`);
const BrowserLaunch = require(`${assetJSPath}/browserLaunch`);

require(`${assetJSPath}/preload`)();

// Load Navigation
Navigation();

// Snack Bar Or Toast For Notification
const toast = msg => {
  // Get the snackbar DIV
  let x = document.querySelector("#toast");

  // Add the "show" class to DIV
  x.className = "show";
  x.innerHTML = msg;

  // After 2 seconds, remove the show class from DIV
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 2000);
};

const getDatabaseDates = (obj, id) => {
  obj["created_at"] = newDate();
  obj["updated_at"] = null;
  obj["deleted_at"] = null;
  obj[id] = uuid.v4();

  return obj;
};

const newDate = () => {
  return momment().format("YYYY-MM-DD");
};

$(".share-button img:nth-child(1)")
  .unbind()
  .click(() => {
    shell.openExternal("https://twitter.com/CopBrowser");
  });

$(".share-button img:nth-child(2)")
  .unbind()
  .click(() => {
    shell.openExternal("https://discordapp.com/invite/Cad6xEZ");
  });
