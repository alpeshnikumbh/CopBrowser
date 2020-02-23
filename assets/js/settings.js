/**
 * Settings Panel All Functions
 */

/**
 * Get All Settings
 */
const getAllSettings = () => {
  db.getAll("settings", dbPath, async (succ, data) => {
    if (succ) {
      data.forEach(setting => {
        $("#taskInterval").val(setting.browser_spoofer.interval);
        taskInterval = setting.browser_spoofer.interval;

        $("#browserAutoRefresh").prop(
          "checked",
          setting.browser_spoofer.auto_refresh
        );
        $("#browserDisableImage").prop(
          "checked",
          setting.browser_spoofer.disable_image
        );
        bsDisableImg = setting.browser_spoofer.disable_image;
        $("#yazzyProxyBanned").prop(
          "checked",
          setting.yeezy_supply.stop_proxy_banned
        ),
          $("#yazzyAutoRefresh").prop(
            "checked",
            setting.yeezy_supply.auto_refresh
          ),
          $("#yazzyDisableImage").prop(
            "checked",
            setting.yeezy_supply.disable_image
          );
        ysDisableImg = setting.yeezy_supply.disable_image;
        $("#adidasRegion").val(setting.adidas.region);
        defaultRegion = setting.adidas.region;
        $("#adidasDisableImage").prop("checked", setting.adidas.disable_image);
        adidasDisableImg = setting.adidas.disable_image;
        $("#discordWebhook").val(setting.discord);
        webhookUrl = setting.discord;
        $(".overlay").hide();
      });
    }
  });
};

/**
 * Save all settings
 */
const saveSettings = () => {
  let settings = {
    browser_spoofer: {
      interval: $("#taskInterval").val(),
      auto_refresh: $("#browserAutoRefresh").prop("checked"),
      disable_image: $("#browserDisableImage").prop("checked")
    },
    yeezy_supply: {
      stop_proxy_banned: $("#yazzyProxyBanned").prop("checked"),
      auto_refresh: $("#yazzyAutoRefresh").prop("checked"),
      disable_image: $("#yazzyDisableImage").prop("checked")
    },
    adidas: {
      region: $("#adidasRegion").val(),
      disable_image: $("#adidasDisableImage").prop("checked")
    },
    discord: $("#discordWebhook").val()
  };

  db.clearTable("settings", dbPath, (succ, msg) => {
    if (succ) {
      db.insertTableContent("settings", dbPath, settings, (succ, msg) => {
        if (succ) {
          toast("Settings have been updated");
          getAllSettings();
        }
      });
    }
  });
};

/**
 * Check Webhook URL valid or not
 */
const checkWebhookUrl = async () => {
  if ($("#discordWebhook").val() != "" && $("#discordWebhook").val() != null) {
    try {
      let webHookData = $("#discordWebhook")
        .val()
        .split("/");

      const Discord = require("discord.js");

      // Create a new webhook
      const hook = new Discord.WebhookClient(webHookData[5], webHookData[6]);

      // document.querySelector("#app > div > div.src-components-___container__container___Grvi1.src-components-___container__show___28O40 > div > div.src-components-___waiting-room__narrow___3uATe > h1")
      const exampleEmbed = new Discord.RichEmbed()
        .setColor("#1dc4c4")
        .setTitle("Browser is ready for checkout!")
        .setDescription("Task #%counter% passed the Splash")
        .setThumbnail("https://i.imgur.com/wSTFkRM.png")
        .addField("PID", "HDBH545", true)
        .addField("SITE", "YEEZY SUPPLY", true)
        .setTimestamp()
        .setFooter("CopBrowser", "https://i.imgur.com/wSTFkRM.png");

      await hook.send(exampleEmbed).then(
        () => {
          toast("Webhook channel url is valid");
        },
        () => {
          toast(
            "<span style='color:#dc3545;'>Webhook channel url not valid</span>"
          );
        }
      );
    } catch (err) {
      console.log("Err : ", err);
    }
  } else {
    toast("<span style='color:#dc3545;'>Please provide webhook url</span>");
  }
};

/**
 * Default Main Function
 */
const main = () => {
  $("#autoPlus")
    .unbind()
    .click(() => {
      $("#taskInterval").val(parseInt($("#taskInterval").val()) + 1);
    });

  $("#autoMinus")
    .unbind()
    .click(() => {
      if ($("#taskInterval").val() > 0) {
        $("#taskInterval").val(parseInt($("#taskInterval").val()) - 1);
      }
    });

  $("#saveAllSettings").click(() => {
    saveSettings();
  });

  $("#logout_app").click(() => {
    // axios
    //   .post(`https://copbrowser.com/authorize/logout/JOH-S0L-COIK`)
    //   .then(function(response) {})
    //   .catch(function(error) {
    //     console.log(error);
    //   });

    db.getRows("user", dbPath, {}, (succ, data) => {
      if (succ) {
        axios
          .post(`https://copbrowser.com/authorize/logout/${data[0].data.key}`)
          .then(function(response) {
            if (response) {
              if (!response.data.error) {
                db.clearTable("user", dbPath, (succ, msg) => {
                  if (succ) {
                    ipcRenderer.send("event_non_active_redirect");
                  }
                });
              } else {
                toast(
                  `<span style='color:#dc3545;'>${response.data.error_message}</span>`
                );
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
  });

  $("#testWebhookURL")
    .unbind()
    .click(async () => {
      await checkWebhookUrl();
    });

  getAllSettings();
};

module.exports = {
  getAllSettings: getAllSettings,
  main: main
};
