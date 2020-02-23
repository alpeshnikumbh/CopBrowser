/**
 * Check Queue For Adidas
 * @param object page
 * @param string lang
 */
const checkForAdidasQueue = async (page, task, lang = "") => {
  try {
    let status = await new Promise(async resolve => {
      let mainStatus = [];

      let interval = setInterval(async () => {
        if (page._closed) {
          $(`.${task.taskId}-status`)
            .text("CLOSED")
            .removeClass("blue")
            .removeClass("green")
            .removeClass("red")
            .addClass("red");
          clearInterval(interval);
        }

        mainStatus = await page.evaluate(async lang => {
          let queue_strings = [];
          let passed_strings = [];
          let img = null;

          if (lang == "" || lang == "us") {
            queue_strings = [
              "you are in waiting room",
              "sold out",
              "available in select stores"
            ];

            passed_strings = [
              "almost there",
              "youre almost there",
              "you're almost there",
              "add to bag"
            ];
          } else if (lang == "da") {
            queue_strings = ["du bist in der warteschleife"];
            passed_strings = ["glückwunsch, du hast es fast geschafft"];
          }

          let all_text = document.body.innerText.toLowerCase();

          let taskStatus = "none";
          let color = "";
          let msg = "";

          if (
            queue_strings.some(function(v) {
              return all_text.indexOf(v) >= 0;
            })
          ) {
            taskStatus = "IN SPLASH";
            color = "red";
            msg = "Product is unavailable!";
          }

          if (
            passed_strings.some(function(v) {
              return all_text.indexOf(v) >= 0;
            })
          ) {
            taskStatus = "PASSED SPLASH";
            color = "red";
            msg = "Browser is ready for checkout!";
            img = document.querySelector("#thumbnail_0").src;
          }

          return [taskStatus, color, msg, img];
        }, lang);

        if (mainStatus[0] == "PASSED SPLASH") {
          clearInterval(interval);
          resolve(mainStatus);
        }

        if (!page._closed && mainStatus[0] != "none") {
          $(`.${task.taskId}-status`)
            .text(mainStatus[0])
            .removeClass("blue")
            .removeClass("green")
            .removeClass("red")
            .addClass(mainStatus[1]);
        }
      }, 3000);
    });
    return status;
  } catch (err) {
    clearInterval(interval);
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
 *
 * @param object page
 * @param object task
 * @param string imgg
 */
const autoFillAdidasProfile = async (page, task, imgg) => {
  try {
    let profile = task.profile;

    await page.waitForSelector("#firstName", {
      // 1 hour
      timeout: 3600000
    });

    StatusManager[task.taskId] = "CHECKED OUT!:green";

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
      "#app > div > div > div > div > div.checkout_page___2Rq6-.delivery-page > div > main > div.col-m-12.col-s-12.gl-vspace-bpall-medium > button"
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
        "red",
        "Profile filled successfully!",
        "ADIDAS",
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
        "ADIDAS",
        imgg
      );
      StatusManager[task.taskId] = "PAYMENT FILL:red";
    }
  } catch (err) {
    console.log("Errrror : ", err);
  }
};

/**
 *
 * @param Object page
 * @param Object task
 * @param string imgg
 */
const autoFillAdidasPaymentInfo = async (page, task, imgg) => {
  let done = new Promise(async (resolve, reject) => {
    let pageUrl = await page.url();
    if (pageUrl.includes("confirmation")) {
      eventEmitter.emit(
        "change-task-status",
        task,
        "CHECKED OUT!",
        "green",
        "You successfully checked out a product!",
        "ADIDAS",
        imgg
      );
      resolve("done");
    }
  });

  console.log("done");

  // await page.waitForSelector(".wpwl-control-cardNumber", {
  //   // 1 hour
  //   timeout: 3600000
  // });
  // const elementHandle = await page.$(".wpwl-control-cardNumber");
  // console.log("elementHandle : ", elementHandle);
  // const frame = await elementHandle.contentFrame();
  // console.log("frame : ", frame);
  // const cardNumber = await frame.$(
  //   "body > form > input[type=tel]:nth-child(1)"
  // );
  // console.log("cardNumber : ", cardNumber);
  // await cardNumber.type("111111111111");
  // await frame.waitForSelector("input[type=tel]:nth-child(1)");
  // const username = await frame.$('[ng-model="vm.username"]');
  // await username.type("foo");
  // document.querySelector(
  //   "#card_422746846332 > form > div.wpwl-group.wpwl-group-cardNumber.wpwl-clearfix.gl-form-item.gl-form-item--error > div.wpwl-wrapper.wpwl-wrapper-cardNumber.gl-input > iframe"
  // );
  // document.querySelector(
  //   "#card_934098383700 > form > div.wpwl-group.wpwl-group-cardNumber.wpwl-clearfix.gl-form-item.gl-form-item--error > div.wpwl-wrapper.wpwl-wrapper-cardNumber.gl-input > iframe"
  // );
  // #card_422746846332 > form > div.wpwl-group.wpwl-group-cardNumber.wpwl-clearfix.gl-form-item.gl-form-item--error > div.wpwl-wrapper.wpwl-wrapper-cardNumber.gl-input > iframe
  // const elementHandle = await page.$("div#disneyid-wrapper iframe");
  // const frame = await elementHandle.contentFrame();
  // await frame.waitForSelector('[ng-model="vm.username"]');
  // const username = await frame.$('[ng-model="vm.username"]');
  // await username.type("foo");
  // await page.waitForSelector("body > form", {
  //   // 1 hour
  //   timeout: 3600000
  // });
  // let profile = task.profile;
  // await page.waitFor(3000);
  // let statusFilling = await page.evaluate(profile => {
  //   return new Promise((resolve, reject) => {
  //     document.querySelector(
  //       "body > form > input[type=tel]:nth-child(1)"
  //     ).value = profile.creditCardNumber;
  //     document.querySelector(
  //       "#card_1360794161983 > form > div.wpwl-group.wpwl-group-expiry.wpwl-clearfix.gl-form-item > div.wpwl-wrapper.wpwl-wrapper-expiry.gl-input > input"
  //     ).value = profile.expireTime;
  //     document.querySelector("body > form > input[type=tel]").value =
  //       profile.ccv;
  //     resolve("Done");
  //   });
  // }, profile);
  // console.log("statusFilling : ", statusFilling);
  // let ele = await page.$("body > form > input[type=tel]:nth-child(1)");
  // console.log("ele : ", ele);
  // await page.type(
  //   "body > form > input[name=card.number]",
  //   profile.creditCardNumber,
  //   { delay: 30 }
  // );
  // let element = await page.type(".wpwl-control-expiry", profile.expireTime, {
  //   delay: 30
  // });
  // await page.type("body > form > input[name=card.cvv]", profile.ccv, {
  //   delay: 30
  // });
  // await page.click(".order-button___oa2MV");
  // let status;
  // try {
  //   await page.waitForSelector(".gl-form-hint--error", {
  //     timeout: 3000
  //   });
  //   status = await page.evaluate(async () => {
  //     return new Promise(async (resolve, reject) => {
  //       let keyword = [
  //         "invalid credit card number",
  //         "please enter card expiry date",
  //         "please enter your security code"
  //       ];
  //       var all_text = document.body.innerText.toLowerCase();
  //       console.log("all_text : ", all_text);
  //       console.log(
  //         "Matchaed : ",
  //         keyword.some(function(v) {
  //           return all_text.indexOf(v) >= 0;
  //         })
  //       );
  //       if (
  //         keyword.some(function(v) {
  //           return all_text.indexOf(v) >= 0;
  //         })
  //       ) {
  //         resolve("Failed");
  //       } else {
  //         resolve("Success");
  //       }
  //     });
  //   });
  // } catch (e) {
  //   console.log("element probably not exists");
  //   status == "Success";
  // }
  // if (status == "Failed") {
  //   eventEmitter.emit(
  //     "change-task-status",
  //     task,
  //     "IN PAYMENT!",
  //     "red",
  //     "Payment Failed",
  //     "ADIDAS"
  //   );
  //   StatusManager[task.taskId] = "IN PAYMENT!:red";
  // } else if (status == "Success") {
  //   eventEmitter.emit(
  //     "change-task-status",
  //     task,
  //     "IN PAYMENT!",
  //     "green",
  //     "Payment Success",
  //     "ADIDAS"
  //   );
  //   StatusManager[task.taskId] = "IN PAYMENT!:green";
  // }
};

module.exports = {
  checkForAdidasQueue: checkForAdidasQueue,
  autoFillAdidasProfile: autoFillAdidasProfile,
  autoFillAdidasPaymentInfo: autoFillAdidasPaymentInfo
};
