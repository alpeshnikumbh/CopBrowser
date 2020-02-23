/**
 * Tasks Panel All Functions
 */

/**
 * Open Given Link In Yeezy Supply
 * @param Object task
 * @param String link
 */
const openLink = async (task, link = null) => {
  try {
    let arg = [
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=800,700"
    ];

    let authProxy = [];
    if (task.proxy != "" && task.proxy != null) {
      let proxyArr = task.proxy.split(":");
      arg.push(`--proxy-server=${proxyArr[0] + ":" + proxyArr[1]}`);
      authProxy = [];
      authProxy.push(proxyArr[2]);
      authProxy.push(proxyArr[3]);
    }

    //Simple Crawler
    let browser = await puppeteer.launch({
      headless: false,
      args: arg,
      defaultViewport: null,
      ignoreDefaultArgs: true
    });

    let page = (await browser.pages())[0];

    const session = await page.target().createCDPSession();
    const { windowId } = await session.send("Browser.getWindowForTarget");
    await session.send("Browser.setWindowBounds", {
      windowId,
      bounds: { windowState: "minimized" }
    });

    eventEmitter.on(`browserFocus_${task.taskId}`, async () => {
      await page.bringToFront();
    });

    eventEmitter.emit(
      "change-task-status",
      task,
      "OPEN",
      "blue",
      "Browser open successfully!",
      "YEEZY SUPPLY"
    );

    StatusManager[task.taskId] = "OPEN:blue";

    eventEmitter.on("close_browser_" + task.taskId, async () => {
      await page.close();
      await browser.disconnect();
      await browser.close();

      $(`.${task.taskId}-status`)
        .text("CLOSED")
        .removeClass("blue")
        .removeClass("green")
        .addClass("red");

      toast("<span style='color:#dc3545;'>Task has been stopped</span>");
    });

    browser.on("disconnected", async () => {
      console.log("Events : ", eventEmitter.eventNames());
      await eventEmitter.emit("close_browser_" + task.taskId);
      delete StatusManager[task.taskId];
      await eventEmitter.removeAllListeners([`close_browser_${task.taskId}`]);
      await eventEmitter.removeAllListeners([`browserFocus_${task.taskId}`]);
      $(`.visable-${task.taskId}`).hide();
      console.log("Events : ", eventEmitter.eventNames());
    });

    if (authProxy.length == 2) {
      await page.authenticate({
        username: authProxy[0],
        password: authProxy[1]
      });
    }

    // Disable Image
    if (ysDisableImg) {
      await page.setRequestInterception(true);
      page.on("request", request => {
        if (["image"].indexOf(request.resourceType()) !== -1) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }

    if (link == null) {
      await page.goto(task.url, { waitUntil: "networkidle0" });
    } else {
      await page.goto(link, { waitUntil: "networkidle0" });
    }

    let status = await YeezySupply.checkForQueue(page, task);

    let imgg = null;
    $(`.visable-${task.taskId}`).hide();

    if (
      !["IN SPLASH", "ITEM SOLD", "none", "PROXY BANNED"].includes(status[0])
    ) {
      if (!ysDisableImg) {
        imgg = await page.evaluate(() => {
          let img = document.querySelector("#app div > img").src;
          return img;
        });
      }

      $(`.visable-${task.taskId}`).show();
      $(`.visable-${task.taskId}`).click();
    }

    eventEmitter.emit(
      "change-task-status",
      task,
      status[0],
      status[1],
      status[2],
      "YEEZY SUPPLY",
      imgg
    );

    StatusManager[task.taskId] = `${status[0]}:${status[1]}`;
    await YeezySupply.autoFillProfile(page, task, imgg);
    await YeezySupply.autoFillPaymentInfo(page, task, imgg);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Open Adidas Task Link
 * @param Object task
 */
const openAdidasLink = async task => {
  try {
    let arg = [
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=800,700"
    ];

    let authProxy = [];
    if (task.proxy != "" && task.proxy != null) {
      let proxyArr = task.proxy.split(":");
      arg.push(`--proxy-server=${proxyArr[0] + ":" + proxyArr[1]}`);
      authProxy = [];
      authProxy.push(proxyArr[2]);
      authProxy.push(proxyArr[3]);
    }

    //Simple Crawler
    let browser = await puppeteer.launch({
      headless: false,
      args: arg,
      defaultViewport: null,
      ignoreDefaultArgs: true
    });

    eventEmitter.emit(
      "change-task-status",
      task,
      "OPEN",
      "blue",
      "Browser open successfully!",
      "ADIDAS"
    );
    StatusManager[task.taskId] = "OPEN:blue";

    eventEmitter.on("close_browser_" + task.taskId, async () => {
      await page.close();
      await browser.disconnect();
      await browser.close();

      $(`.${task.taskId}-status`)
        .text("CLOSED")
        .removeClass("blue")
        .removeClass("green")
        .removeClass("red")
        .addClass("red");

      toast("<span style='color:#dc3545;'>Task has been stopped</span>");
    });

    browser.on("disconnected", async () => {
      console.log("Events : ", eventEmitter.eventNames());
      await eventEmitter.emit("close_browser_" + task.taskId);
      delete StatusManager[task.taskId];
      await eventEmitter.removeAllListeners([`close_browser_${task.taskId}`]);
      await eventEmitter.removeAllListeners([`browserFocus_${task.taskId}`]);
      $(`.visable-${task.taskId}`).hide();
      console.log("Events : ", eventEmitter.eventNames());
    });

    let page = (await browser.pages())[0];

    const session = await page.target().createCDPSession();
    const { windowId } = await session.send("Browser.getWindowForTarget");
    await session.send("Browser.setWindowBounds", {
      windowId,
      bounds: { windowState: "minimized" }
    });

    eventEmitter.on(`browserFocus_${task.taskId}`, async () => {
      await page.bringToFront();
    });

    if (authProxy.length == 2) {
      await page.authenticate({
        username: authProxy[0],
        password: authProxy[1]
      });
    }

    await page.goto(task.url, { waitUntil: "networkidle0" });

    let status = await Adidas.checkForAdidasQueue(page, task);

    let imgg = null;
    $(`.visable-${task.taskId}`).hide();

    if (!["IN SPLASH", "ITEM SOLD", "none"].includes(status[0])) {
      imgg = status[3];
      $(`.visable-${task.taskId}`).show();
      $(`.visable-${task.taskId}`).click();
    }

    eventEmitter.emit(
      "change-task-status",
      task,
      status[0],
      status[1],
      status[2],
      "ADIDAS",
      imgg
    );

    StatusManager[task.taskId] = `${status[0]}:${status[1]}`;
    await Adidas.autoFillAdidasProfile(page, task, imgg);
    await Adidas.autoFillAdidasPaymentInfo(page, task, imgg);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Open Browser Spoofer Task Link
 * @param Object task
 */
const openBrowserSpoof = async task => {
  try {
    let arg = [
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=800,700"
    ];

    let authProxy = [];
    if (task.proxy != "" && task.proxy != null) {
      let proxyArr = task.proxy.split(":");
      arg.push(`--proxy-server=${proxyArr[0] + ":" + proxyArr[1]}`);
      authProxy = [];
      authProxy.push(proxyArr[2]);
      authProxy.push(proxyArr[3]);
    }

    //Simple Crawler
    let browser = await puppeteer.launch({
      headless: false,
      ignoreDefaultArgs: true,
      args: arg
    });

    let page = (await browser.pages())[0];

    await page.addScriptTag({
      url: "https://code.jquery.com/jquery-3.2.1.min.js"
    });

    eventEmitter.on(`browserFocus_${task.taskId}`, async () => {
      await page.bringToFront();
    });

    eventEmitter.emit(
      "change-task-status",
      task,
      "OPEN",
      "blue",
      "Browser open successfully!",
      "BROWSER SPOOFER"
    );
    StatusManager[task.taskId] = "OPEN:blue";

    eventEmitter.on("close_browser_" + task.taskId, async () => {
      await page.close();
      await browser.disconnect();
      await browser.close();

      toast("<span style='color:#dc3545;'>Task has been stopped</span>");
    });

    browser.on("disconnected", async () => {
      await eventEmitter.emit("close_browser_" + task.taskId);
      delete StatusManager[task.taskId];
      await eventEmitter.removeAllListeners([`close_browser_${task.taskId}`]);
      await eventEmitter.removeAllListeners([`browserFocus_${task.taskId}`]);
      $(`.visable-${task.taskId}`).hide();
      console.log("Events : ", eventEmitter.eventNames());
      $(`.${task.taskId}-status`)
        .text("CLOSED")
        .removeClass("blue")
        .removeClass("green")
        .addClass("red");
    });

    let imgg = null;
    $(`.visable-${task.taskId}`).hide();

    if (!bsDisableImg) {
      imgg = await page.evaluate(() => {
        if (document.querySelector("picture:nth-child(2) > img") !== null) {
          let img = document.querySelector("picture:nth-child(2) > img").src;
          return img;
        }
        return null;
      });
    }

    if (authProxy.length == 2) {
      await page.authenticate({
        username: authProxy[0],
        password: authProxy[1]
      });
    }

    // Disable Image
    if (bsDisableImg) {
      await page.setRequestInterception(true);
      page.on("request", request => {
        if (["image"].indexOf(request.resourceType()) !== -1) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }
    await page.setDefaultNavigationTimeout(90000);

    page.on("domcontentloaded", async res => {
      let domain = page.url().split("/")[2];

      if (domain === "www.nike.com") {
        let bsLogin = await BrowserSpoofer.loginNikeAccount(page, task, imgg, [
          "input[name=emailAddress]",
          "input[name=password]",
          "input[type=button]"
        ]);
        if (bsLogin == "Exit") {
          toast("<span style='color:#dc3545;'>Task stopped</span>");
        } else if (bsLogin == "Success") {
          await BrowserSpoofer.autoFillBSProfile(page, task, imgg);
          await BrowserSpoofer.autoFillBSPaymentInfo(page, task, imgg);
        }
      } else {
        page.evaluate(BrowserSpoofer.evaluteFunction, task);
      }
    });

    await page.goto(task.url, { waitUntil: "networkidle0" });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Default Main Function
 */
const main = () => {};

module.exports = {
  openLink: openLink,
  openAdidasLink: openAdidasLink,
  openBrowserSpoof: openBrowserSpoof,
  main: main
};
