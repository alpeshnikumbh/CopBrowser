/**
 * Auto Fill Browser Spoofer
 * @param object page
 * @param object task
 * @param string imgg
 */

const evaluteFunction = task => {
  let profile = task.profile;
  let nikeAccount = null;

  if (task.nikeAccount !== null) {
    nikeAccount = task.nike_account.split(":");
  }

  //your code here
  let f_name = profile.firstName;
  let l_name = profile.lastName;
  let email = profile.email;
  let address = profile.address;
  let city = profile.city;
  let postal_code = profile.postalCode;
  let phone = profile.phoneNumber;
  let nike_email = null;
  let nike_password = null;

  if (nikeAccount !== null) {
    nike_email = nikeAccount[0];
    nike_password = nikeAccount[1];
  }

  if (
    f_name &&
    l_name &&
    email &&
    address &&
    city &&
    postal_code &&
    // country &&
    phone
  ) {
    document.querySelector("#first_name") !== null
      ? (document.querySelector("#first_name").value = f_name)
      : "";
    document.querySelector("#last_name") !== null
      ? (document.querySelector("#last_name").value = l_name)
      : "";
    document.querySelector("#email") !== null
      ? (document.querySelector("#email").value = email)
      : "";
    document.querySelector("#address") !== null
      ? (document.querySelector("#address").value = address)
      : "";
    document.querySelector("#city") !== null
      ? (document.querySelector("#city").value = city)
      : "";
    document.querySelector("#postal_code") !== null
      ? (document.querySelector("#postal_code").value = postal_code)
      : "";
    // document.querySelector("#country").value = country;
    document.querySelector("#phone") !== null
      ? (document.querySelector("#phone").value = phone)
      : "";

    if (nike_email && nike_password) {
      document.querySelector("#nike_email") !== null
        ? (document.querySelector("#nike_email").value = nike_email)
        : "";
      document.querySelector("#nike_password") !== null
        ? document.querySelector("#nike_password").value(nike_password)
        : "";
    }
  }

  let pathArray = window.location.pathname.split("/");
  let secondLevelLocation = pathArray[2];
  let nike = window.location.host;
  let nike_actual = window.location.href;

  if (secondLevelLocation == "checkouts") {
    let f_name = "";
    let l_name = "";
    let email = "";
    let address = "";
    let city = "";
    let postal_code = "";
    let country = "United States";
    let state = "";
    let phone = "";

    f_name = profile.firstName;
    l_name = profile.lastName;
    email = profile.email;
    address = profile.address;
    city = profile.city;
    postal_code = profile.postalCode;
    phone = profile.phoneNumber;
    nike_email = null;
    state = profile.state;
    nike_password = null;

    if (f_name && l_name) {
      document.querySelector("#checkout_email_or_phone") !== null
        ? (document.querySelector("#checkout_email_or_phone").value = email)
        : "";

      document.querySelector("input[name='checkout[email_or_phone]']") !== null
        ? (document.querySelector(
            "input[name='checkout[email_or_phone]']"
          ).value = email)
        : "";
      document.querySelector("#checkout_email") !== null
        ? (document.querySelector("#checkout_email").value = email)
        : "";

      document.querySelector("#checkout_shipping_address_first_name") !== null
        ? (document.querySelector(
            "#checkout_shipping_address_first_name"
          ).value = f_name)
        : "";
      document.querySelector("#checkout_billing_address_first_name") !== null
        ? (document.querySelector(
            "#checkout_billing_address_first_name"
          ).value = f_name)
        : "";

      document.querySelector("#checkout_shipping_address_last_name") !== null
        ? (document.querySelector(
            "#checkout_shipping_address_last_name"
          ).value = l_name)
        : "";
      document.querySelector("#checkout_billing_address_last_name") !== null
        ? (document.querySelector(
            "#checkout_billing_address_last_name"
          ).value = l_name)
        : "";

      document.querySelector("#checkout_shipping_address_address1") !== null
        ? (document.querySelector(
            "#checkout_shipping_address_address1"
          ).value = address)
        : "";
      document.querySelector("#checkout_billing_address_address1") !== null
        ? (document.querySelector(
            "#checkout_billing_address_address1"
          ).value = address)
        : "";

      document.querySelector("#checkout_shipping_address_city") !== null
        ? (document.querySelector(
            "#checkout_shipping_address_city"
          ).value = city)
        : "";
      document.querySelector("#checkout_billing_address_city") !== null
        ? (document.querySelector(
            "#checkout_billing_address_city"
          ).value = city)
        : "";

      let countryElement1 = document.querySelector(
        "#checkout_shipping_address_country"
      );

      if (countryElement1) {
        let event = document.createEvent("HTMLEvents");
        event.initEvent("change", true, false);
        countryElement1.value = country;
        countryElement1.dispatchEvent(event);
      }

      let countryElement2 = document.querySelector(
        "#checkout_billing_address_country"
      );

      if (countryElement2) {
        let event = document.createEvent("HTMLEvents");
        event.initEvent("change", true, false);
        countryElement2.value = country;
        countryElement2.dispatchEvent(event);
      }

      setTimeout(() => {
        let stateElement = document.querySelector(
          "#checkout_shipping_address_province"
        );

        if (stateElement) {
          for (var i = 0; i < stateElement.options.length; i++) {
            if (stateElement.options[i].text === state) {
              stateElement.selectedIndex = i;
              break;
            }
          }
        }
      }, 2000);

      // document.querySelector("#checkout_shipping_address_country") !== null
      //   ? (document.querySelector(
      //       "#checkout_shipping_address_country"
      //     ).value = country)
      //   : "";
      // document.querySelector("#checkout_billing_address_country") !== null
      //   ? (document.querySelector(
      //       "#checkout_billing_address_country"
      //     ).value = country)
      //   : "";

      // document.querySelector("#checkout_shipping_address_province") !== null
      //   ? (document.querySelector(
      //       "#checkout_shipping_address_province"
      //     ).value = state)
      //   : "";

      document.querySelector("#checkout_shipping_address_zip") !== null
        ? (document.querySelector(
            "#checkout_shipping_address_zip"
          ).value = postal_code)
        : "";
      document.querySelector("#checkout_billing_address_zip") !== null
        ? (document.querySelector(
            "#checkout_billing_address_zip"
          ).value = postal_code)
        : "";

      document.querySelector("#checkout_shipping_address_phone") !== null
        ? (document.querySelector(
            "#checkout_shipping_address_phone"
          ).value = phone)
        : "";
      document.querySelector("#checkout_billing_address_phone") !== null
        ? (document.querySelector(
            "#checkout_billing_address_phone"
          ).value = phone)
        : "";
    }

    if (nike == "checkout.stripe.com") {
      document.querySelector("#email") !== null
        ? (document.querySelector("#email").value = email)
        : "";
      document.querySelector("#billingName") !== null
        ? (document.querySelector("#billingName").value = f_name)
        : "";

      let data = searchCountries("United States");

      document.querySelector("#billingCountry") !== null
        ? (document.querySelector("#billingCountry").value = data)
        : "";
      document.querySelector("#billingName") !== null
        ? (document.querySelector("#billingName").value = f_name)
        : "";
      document.querySelector("#cardNumber") !== null
        ? (document.querySelector("#cardNumber").value = "1334 1934 1284 1674")
        : "";
    }
  }
};

const loginNikeAccount = async (page, task, imgg, loginCredintial) => {
  try {
    return await page
      .waitForSelector(loginCredintial[0], {
        visible: true,
        timeout: 100000000
      })
      .then(async () => {
        let nikeAccount = null;
        if (task.use_nike_account) {
          nikeAccount = task.nike_account.split(":");

          let profile = task.profile;

          await page.type(loginCredintial[0], nikeAccount[0], {
            delay: 30
          });

          await page.waitFor(2000);

          await page.type(loginCredintial[1], nikeAccount[1], {
            delay: 30
          });

          await page.waitFor(2000);

          await page.click(loginCredintial[2]);

          let status = "Success";
          try {
            await page.waitFor(3000);
            await page.waitForSelector(".error", {
              timeout: 2000
            });
            status = await page.evaluate(async () => {
              return new Promise(async (resolve, reject) => {
                let keyword = [
                  "please enter a valid email address.",
                  "please enter a password.",
                  "your email or password was entered incorrectly."
                ];

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
          } catch (e) {
            status == "Success";
          }

          return status;
          // if (status == "Failed") {
          //   eventEmitter.emit(
          //     "change-task-status",
          //     task,
          //     "LOGIN FAILED",
          //     "red",
          //     "Login failed",
          //     "BROWSER SPOOFER",
          //     imgg
          //   );
          //   StatusManager[task.taskId] = "LOGIN FAILED:red";
          //   toast("<span style='color:#dc3545;'>Login Failed</span>");
          // } else if (status == "Success") {
          //   eventEmitter.emit(
          //     "change-task-status",
          //     task,
          //     "LOGIN SUCCESS",
          //     "blue",
          //     "Login success",
          //     "BROWSER SPOOFER",
          //     imgg
          //   );
          //   StatusManager[task.taskId] = "LOGIN SUCCESS:green";
          //   toast("Login success");
          //   return "Success";
          // }
        } else {
          toast(
            "<span style='color:#dc3545;'>No Nike Account Available for Login</span>"
          );
          return "Exit";
        }
      });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Auto Fill Browser Spoofer Profile
 * @param Object page
 * @param Object task
 * @param string imgg
 */
const autoFillBSProfile = async (page, task, imgg) => {
  try {
    await page
      .waitForSelector("#firstName", {
        visible: true,
        timeout: 100000000
      })
      .then(async () => {
        let profile = task.profile;
        if (profile === null || profile === "") {
          toast("<span style='color:#dc3545;'>No profile found</span>");
        }

        // await page.type("#Shipping_FirstName", "");
        await page.type("#firstName", profile.firstName, {
          delay: 30
        });

        // await page.type("#Shipping_LastName", "");
        await page.type("#lastName", profile.lastName, { delay: 30 });

        // await page.type("#Shipping_Address1", "");
        await page.type("#address1", profile.address, { delay: 30 });
        // await page.type("#Shipping_Address2", profile.name, { delay: 30 });
        // await page.type("#Shipping_Address3", profile.name, { delay: 30 });

        // await page.type("#Shipping_City", profile.city, { delay: 30 });

        // await page.type("#Shipping_PostCode", "");
        // await page.type("#Shipping_PostCode", profile.postalCode, {
        //   delay: 30
        // });

        // await page.type("#Shipping_Territory", profile.state, { delay: 30 });

        // await page.type("#Shipping_phonenumber", "");

        await page.evaluate(async () => {
          document.querySelector("#email").value = "";
        });

        // await page.type("#shipping_Email", profile.email, { delay: 30 });
        await page.type("#email", profile.email, { delay: 30 });

        await page.type("#phoneNumber", profile.phoneNumber, {
          delay: 30
        });
      });
  } catch (error) {
    toast("<span style='color:#dc3545;'>Task has been stopped</span>");
  }
};

/**
 * Auto Fill Browser Spoofer Payment Info
 * @param object page
 * @param object task
 * @param string imgg
 */
const autoFillBSPaymentInfo = async (page, task, imgg) => {
  try {
    await page
      .waitForSelector(".credit-card-iframe", {
        visible: true,
        timeout: 100000000
      })
      .then(async () => {
        await page.waitFor(4000);
        await page.waitForSelector(".credit-card-iframe");

        const elementHandle = await page.$(".credit-card-iframe");
        const frame = await elementHandle.contentFrame();

        await frame.waitForSelector("#creditCardNumber");

        let profile = task.profile;

        if (profile === null || profile === "") {
          toast("<span style='color:#dc3545;'>No card details found</span>");
        }

        await frame.type("#creditCardNumber", profile.creditCardNumber, {
          delay: 30
        });

        await frame.type("#expirationDate", profile.expireTime, { delay: 30 });
        await frame.type("#cvNumber", profile.ccv, {
          delay: 30
        });
      });
  } catch (error) {
    toast("<span style='color:#dc3545;'>Task has been stopped</span>");
  }
};

/**
 * Main Function
 */
const main = () => {};

module.exports = {
  evaluteFunction: evaluteFunction,
  loginNikeAccount: loginNikeAccount,
  autoFillBSProfile: autoFillBSProfile,
  autoFillBSPaymentInfo: autoFillBSPaymentInfo,
  main: main
};
