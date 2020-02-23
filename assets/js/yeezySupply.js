/**
 * Check For Queue
 * @param object page
 * @param object task
 */
const checkForQueue = async (page, task) => {
  try {
    let status = await new Promise(async resolve => {
      let mainStatus = [];

      let interval = setInterval(async () => {
        if (page._closed) {
          clearInterval(interval);
          resolve(mainStatus);
        }

        mainStatus = await page.evaluate(async () => {
          var queue_strings = [
            "don't refresh the page",
            "do not refresh the page",
            "you are in the waiting room",
            "you're in the waiting room",
            "sale started"
          ];

          var passed_strings = ["purchase"];
          var sold_strings = ["sold out"];
          var forbidden_strings = ["http 403 - forbidden"];

          var all_text = document.body.innerText.toLowerCase();

          var taskStatus = "none";
          let color = "";
          let msg = "";

          if (
            forbidden_strings.some(function(v) {
              return all_text.indexOf(v) >= 0;
            })
          ) {
            taskStatus = "PROXY BANNED";
            color = "red";
            msg = "Proxy has been banned!";
          }

          if (
            queue_strings.some(function(v) {
              return all_text.indexOf(v) >= 0;
            })
          ) {
            taskStatus = "IN SPLASH";
            color = "blue";
            msg = "Browser still in Splash queue!";
          }

          if (
            passed_strings.some(function(v) {
              return all_text.indexOf(v) >= 0;
            })
          ) {
            taskStatus = "PASSED SPLASH";
            color = "red";
            msg = "Browser is ready for checkout!";
          }

          if (
            sold_strings.some(function(v) {
              return all_text.indexOf(v) >= 0;
            })
          ) {
            taskStatus = "ITEM SOLD";
            color = "blue";
            msg = "Product item sold out!";
          }
          return [taskStatus, color, msg];
        });

        if (mainStatus[0] == "PASSED SPLASH") {
          clearInterval(interval);
          resolve(mainStatus);
        }

        if (!page._closed) {
          $(`.${task.taskId}-status`)
            .text(mainStatus[0])
            .removeClass("blue")
            .removeClass("green")
            .removeClass("red")
            .addClass(mainStatus[1]);
        }
      }, 3000);
    });
  } catch (err) {
    $(`.${task.taskId}-status`)
      .text("CLOSED")
      .removeClass("blue")
      .removeClass("green")
      .removeClass("red")
      .addClass("red");
  }
  return status;
};

/**
 * Auto Fill Yeezy Supply
 * @param object page
 * @param object task
 * @param string imgg
 */
const autoFillProfile = async (page, task, imgg) => {
  await page.waitForSelector("#firstName", {
    // 1 hour
    timeout: 3600000
  });

  StatusManager[task.taskId] = "CHECKED OUT!:green";

  let profile = task.profile;

  await page.type("#firstName", profile.firstName, { delay: 30 });
  await page.type("#lastName", profile.lastName, { delay: 30 });
  await page.type("#address1", profile.address, { delay: 30 });
  await page.type("#city", profile.city, { delay: 30 });

  await page.evaluate(async state => {
    var element = document.getElementsByTagName("select")[0];
    if (element) {
      let event = document.createEvent("HTMLEvents");
      event.initEvent("change", true, false);
      element.value = state;
      element.dispatchEvent(event);
    }
  }, profile.state);

  await page.type("#zipcode", profile.postalCode, { delay: 30 });
  await page.type("#phoneNumber", profile.phoneNumber, { delay: 30 });
  await page.type("#emailAddress", profile.email, { delay: 30 });

  await page.waitFor(3000);

  await page.click(
    "#app > div.container___3PPPZ > div.main___2aRHM > div > div > main > div.col-m-12.col-s-12.gl-vspace-bpall-medium.col-l-12.offset-l-6.row > button"
  );

  let status;
  try {
    await page.waitForSelector(".gl-form-hint--error", {
      timeout: 3000
    });
    status = await page.evaluate(async () => {
      return new Promise(async (resolve, reject) => {
        let keyword = [
          "please enter your first name.",
          "please enter your last name.",
          "please enter your delivery address.",
          "please enter your town or city.",
          "please select state.",
          "please enter your zip code.",
          "please enter your telephone number.",
          "please enter your email address.",
          "please check your zip code."
        ];

        var all_text = document.body.innerText.toLowerCase();
        console.log("all_text : ", all_text);
        console.log(
          "Matchaed : ",
          keyword.some(function(v) {
            return all_text.indexOf(v) >= 0;
          })
        );

        if (
          keyword.some(function(v) {
            return all_text.indexOf(v) >= 0;
          })
        ) {
          resolve("Failed");
        } else {
          resolve("Success");
        }
      });
    });
  } catch (e) {
    console.log("element probably not exists");
    status == "Success";
  }

  if (status == "Success") {
    eventEmitter.emit(
      "change-task-status",
      task,
      "PAYMENT FILL",
      "green",
      "Profile filled successfully!",
      "YEEZY SUPPLY",
      imgg
    );
    StatusManager[task.taskId] = "PAYMENT FILL:green";
  } else if (status == "Failed") {
    eventEmitter.emit(
      "change-task-status",
      task,
      "PAYMENT FILL",
      "red",
      "Profile filled failed!",
      "YEEZY SUPPLY",
      imgg
    );
    StatusManager[task.taskId] = "PAYMENT FILL:red";
  }
};

/**
 * Auto Fill Payment Info
 * @param object page
 * @param object task
 * @param string imgg
 */
const autoFillPaymentInfo = async (page, task, imgg) => {
  await page.waitForSelector("#card-number", {
    // 1 hour
    timeout: 3600000
  });

  let profile = task.profile;

  await page.type("#card-number", profile.creditCardNumber, { delay: 30 });
  await page.type("#name", profile.firstName + " " + profile.lastName, {
    delay: 30
  });
  await page.type("#expiryDate", profile.expireTime, { delay: 30 });
  await page.type("#security-number-field", profile.ccv, { delay: 30 });

  await page.waitFor(3000);

  await page.click(
    "#app > div.container___3PPPZ > div.main___2aRHM > div > div > main > div.order-button-wrapper___2qrPL.gl-vspace-bpall-small > button"
  );

  await page.waitForSelector(
    "#app > div.container___3PPPZ > div.main___2aRHM > div > div > main > div:nth-child(1) > div > div",
    {
      timeout: 10000
    }
  );

  let status = await page.evaluate(async () => {
    return new Promise(async (resolve, reject) => {
      let keyword = ["payment failed"];

      var all_text = document.body.innerText.toLowerCase();

      if (
        keyword.some(function(v) {
          return all_text.indexOf(v) >= 0;
        })
      ) {
        resolve("Failed");
      } else {
        resolve("Success");
      }
    });
  });

  console.log("status : ", status);

  if (status == "Failed") {
    eventEmitter.emit(
      "change-task-status",
      task,
      "IN PAYMENT!",
      "red",
      "Payment Failed",
      "YEEZY SUPPLY",
      imgg
    );
    StatusManager[task.taskId] = "IN PAYMENT!:red";
  } else if (status == "Success") {
    eventEmitter.emit(
      "change-task-status",
      task,
      "CHECKED OUT!",
      "green",
      "You successfully checked out a product!",
      "YEEZY SUPPLY",
      imgg
    );
  }
};

/**
 * Main Function
 */
const main = () => {};

module.exports = {
  checkForQueue: checkForQueue,
  autoFillProfile: autoFillProfile,
  autoFillPaymentInfo: autoFillPaymentInfo,
  main: main
};
