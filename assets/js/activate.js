const { ipcRenderer, remote } = require("electron");
let path = require("path");
let basePath = app.getAppPath();
let dbPath = path.join(basePath, "db");

/**
 * Activation Application Functions
 */

/**
 * Check For Activation
 */
const activate = key => {
  let activationKey = $("#activateKey").val();
  axios
    .post(`https://copbrowser.com/authorize/login/${activationKey}/text/`)
    .then(async function(response) {
      if (response) {
        if (!response.data.error) {
          await db.insertTableContent("user", dbPath, response, (succ, msg) => {
            if (succ) {
              console.log("$ : ", $);
              console.log("Value : ", $(".active-status").text());

              $(".active-status").hide();
              ipcRenderer.send("event_activated_redirect");
            } else {
              console.log("msg : ", msg);
              toast("Something went wrong");
            }
          });
        } else {
          $(".active-status")
            .text(response.data.error_message)
            .css({ color: "red" })
            .show();
        }
      }
    })
    .catch(function(error) {
      $(".active-status").hide();
      console.log(error);
    });
};

/**
 * Default Main Function
 */
const main = () => {
  /**
   * Check For Activation Key
   */
  $(`#checkActivate`).click(() => {
    let key = $("#activateKey").val();
    activate(key);
  });

  $("#activateKey").on("keyup", e => {
    let val = $("#activateKey").val();
    if (val.length > 12) {
      e.preventDefault();
      return false;
    }
    // else {
    //   let position = [3, 7];
    //   if (position.includes(val.length)) {
    //     $("#activateKey").val(`${val}-`);
    //   }
    // }
  });
  $(".overlay").hide();
};

module.exports = {
  activate: activate,
  main: main
};
