/**
 * Tasks Panel All Functions
 */

const isValidEditTask = () => {
  if ($("#linkChange").val() == "") {
    toast("Link Change Is Required");
    return false;
  }

  return true;
};

/**
 * Action Functions
 */

const updateTask = (obj, taskId) => {
  let where = {
    taskId: taskId
  };

  db.updateRow("tasks", dbPath, where, obj, async (succ, msg) => {
    if (succ) {
      toast("Task has been updated");
      $("#editModal").modal("hide");
      await fillAllTasks();
    }
  });
};

const startTask = async taskId => {
  db.getRows(
    "tasks",
    dbPath,
    {
      deleted_at: null,
      taskId: taskId
    },
    async (succ, data) => {
      if (data.length > 0) {
        if (data[0].url != "" && data[0].url != null) {
          let tab = $("#current_tab").val();
          if (tab == "Browser Spoofer") {
            await BrowserLaunch.openBrowserSpoof(data[0]);
          } else if (tab == "Adidas") {
            await BrowserLaunch.openAdidasLink(data[0]);
          } else if (tab == "Yeezy Supply") {
            await BrowserLaunch.openLink(data[0]);
          }
        } else {
          toast("<span style='color:#dc3545;'>Url not found</span>");
        }
      }
    }
  );
};

const editTask = async taskId => {
  await CreateTasks.fillProfiles("#profileChange");

  db.getRows(
    "tasks",
    dbPath,
    {
      deleted_at: null,
      taskId: taskId
    },
    async (succ, data) => {
      if (data.length > 0) {
        $("#proxyChange").val(data[0].proxy);
        $("#linkChange").val(data[0].url);
        $("#profileChange").val(
          data[0].profile == "" ? "" : JSON.stringify(data[0].profile)
        );
        $("#editNikeAccount").val(data[0].nike_account);
      }
    }
  );

  $("#editModal").modal("show");

  $("#saveEditTask").click(() => {
    let obj = {
      proxy: $("#proxyChange").val(),
      url: $("#linkChange").val(),
      profile:
        $("#profileChange").val() != ""
          ? JSON.parse($("#profileChange").val())
          : ""
    };

    if ($("#editNikeAccount").val() !== "") {
      obj["nike_account"] = $("#editNikeAccount").val();
    }

    updateTask(obj, taskId);
  });
};

const stopTask = taskId => {
  eventEmitter.emit("close_browser_" + taskId);
};

const deleteTask = taskId => {
  let where = {
    taskId: taskId
  };

  db.deleteRow("tasks", dbPath, where, async (succ, msg) => {
    if (succ) {
      toast("<span style='color:#dc3545;'>Task has been deleted</span>");
      await fillAllTasks();
    }
  });
};

/**
 * Bind Task Action Method
 */
const bindActionClasses = () => {
  $(".focusBrowser")
    .unbind()
    .click(e => {
      eventEmitter.emit(`browserFocus_${$(e.target).data("id")}`);
    });

  $(".startTaskAction")
    .unbind()
    .click(e => {
      if (
        eventEmitter
          .eventNames()
          .includes(`close_browser_${$(e.target).data("id")}`)
      ) {
        toast("<span style='color:#dc3545;'>Task already running</span>");
      } else {
        startTask($(e.target).data("id"));
      }
    });

  $(".editTaskAction")
    .unbind()
    .click(e => {
      editTask($(e.target).data("id"));
    });

  $(".stopTaskAction")
    .unbind()
    .click(e => {
      stopTask($(e.target).data("id"));
    });

  $(".deleteTaskAction")
    .unbind()
    .click(e => {
      deleteTask($(e.target).data("id"));
    });
};

/**
 * Prepare Proxy For Display
 * @param string proxy
 */
const prepareProxy = proxy => {
  let arr = proxy.split(":");
  return arr[0] + ":" + arr[1];
};

const preparePID = taskUrl => {
  let url = taskUrl.split("/");
  return url[url.length - 1];
};

/**
 * Get All Tasks
 */
const getAllTasks = async (type, selector) => {
  let Tasks = ``;

  let data = await new Promise((resolve, reject) => {
    db.getRows(
      "tasks",
      dbPath,
      {
        deleted_at: null,
        site: type
      },
      async (succ, data) => {
        if (data.length > 0) {
          data.forEach(async (task, index) => {
            Tasks += `<div class="card-body">
               <div class="row">
               <div class="col-lg-1">
                 <span class="task-img">
                     <img src="./images/${type}.png" />
                 </span>
               </div>
               <div class="col-lg-1 ${task.taskId}-counter">${index + 1}</div>
               <div class="col-lg-2 site-url" data-toggle="tooltip" data-placement="top" title="${
                 task.url
               }" >${
              task.url == ""
                ? "-"
                : type != "Browser Spoofer"
                ? preparePID(task.url)
                : task.url
            }</div>
               <div class="col-lg-3">${
                 task.proxy == "" ? "-" : prepareProxy(task.proxy)
               }</div>
               <div class="col-lg-2">${
                 task.profile == "" ? "-" : task.profile.profileName
               }</div>`;
            let status = [];
            if (
              eventEmitter.eventNames().includes(`close_browser_${task.taskId}`)
            ) {
              status = StatusManager[task.taskId].split(":");
              Tasks += `<div class='task-status col-lg-1 ${task.taskId}-status ${status[1]}'>${status[0]}</div>`;
            } else {
              Tasks += `<div class='task-status col-lg-1 ${task.taskId}-status red'>CLOSED</div>`;
            }
            let visableStatus = [
              "PASSED SPLASH",
              "CHECKED OUT!",
              "IN BILLING",
              "PAYMENT FILL!",
              "IN PAYMENT!"
            ];

            Tasks += `<div class="col-lg-2 config-action">
                      <img style="display:${
                        visableStatus.includes(status[0]) ? "unset" : "none"
                      };" src="./images/visableTask.png" data-id="${
              task.taskId
            }"
                      class="task-action focusBrowser visable-${task.taskId}" />
                      <img src="./images/startTask.png" data-id="${
                        task.taskId
                      }" class="task-action startTaskAction" />
                      <img src="./images/editTask.png" data-id="${
                        task.taskId
                      }" class="task-action editTaskAction" />
                      <img src="./images/stopTask.png" data-id="${
                        task.taskId
                      }" class="task-action stopTaskAction" />
                      <img src="./images/deleteTask.png" data-id="${
                        task.taskId
                      }" class="task-action deleteTaskAction" />
                  </div>
                  </div>
              </div>`;
          });

          $(`${selector} .task-list-panel > .card`).html(Tasks);
        } else {
          $(`${selector} .task-list-panel > .card`).html(
            `<div class="card-body">
               <div class="row">
                 <div class="col-lg-12 col-md-12 col-sm-12 text-center">
                   No Data Found
                 </div>
               </div>
             </div>`
          );
        }

        $(".total-task > .total-val").text(data.length);

        resolve(data);
      }
    );
  });

  if (data) {
    return data;
  }
};

/**
 * Manage Footer Buttons
 * @param String type
 */
const manageFooterButtons = (type = "none") => {
  if (type == "Browser Spoofer") {
    $(".spoofer-type").removeClass("hide-ele");
    $(".other-type").addClass("hide-ele");
  } else if (type == "none") {
    $(".other-type").removeClass("hide-ele");
    $(".spoofer-type").addClass("hide-ele");
  }
};

const editMassLinks = () => {
  let obj = {};
  if ($("#massLinkChange").val() != "" && $("#massLinkChange").val() != null) {
    obj.url = $("#massLinkChange").val();
  }

  if (
    $("#massProfileChange").val() != "" &&
    $("#massProfileChange").val() != null
  ) {
    obj.profile = JSON.parse($("#massProfileChange").val());
  }

  obj.deleted_at = null;

  db.getRows(
    "tasks",
    dbPath,
    {
      deleted_at: null,
      site: $("#current_tab").val()
    },
    async (succ, data) => {
      if (data.length > 0) {
        await data.forEach(ele => {
          db.updateRow(
            "tasks",
            dbPath,
            {
              taskId: ele.taskId
            },
            obj,
            async (succ, msg) => {
              if (succ) {
              } else {
                toast("something went wrong");
              }
            }
          );
        });
      }
      $("#editAllModal").modal("hide");
      fillAllTasks();
    }
  );
};

const deleteAllTask = () => {
  db.getRows(
    "tasks",
    dbPath,
    {
      deleted_at: null,
      site: $("#current_tab").val()
    },
    async (succ, data) => {
      let proxyList = [];
      if (data.length > 0) {
        await data.forEach(ele => {
          proxyList.push(ele.proxy);
          db.deleteRow(
            "tasks",
            dbPath,
            {
              taskId: ele.taskId
            },
            async (succ, msg) => {
              if (succ) {
              } else {
                toast("something went wrong");
              }
            }
          );
        });
      }

      await Proxies.saveProxies(proxyList, $("#current_tab").val());
      fillAllTasks();
      toast("All Task has been deleted");
    }
  );
};

const openCustomLink = () => {
  if ($("#customLink").val() == "") {
    toast("Custom link is required");
    return;
  }

  db.getRows(
    "tasks",
    dbPath,
    {
      deleted_at: null,
      site: $("#current_tab").val()
    },
    async (succ, data) => {
      if (data.length > 0) {
        await data.forEach(async ele => {
          await BrowserLaunch.openLink(ele, $("#customLink").val());
        });
      }
    }
  );
};

const fillAllTasks = async () => {
  let selector = "";
  if ($("#current_tab").val() == "Adidas") {
    selector = "#adidas";
    console.log("selector : Adidas");
  } else if ($("#current_tab").val() == "Browser Spoofer") {
    selector = "#browserSpoofer";
    console.log("selector : Browser Spoofer");
  } else if ($("#current_tab").val() == "Yeezy Supply") {
    selector = "#yeezySupply";
    console.log("selector : Yeezy Supply");
  }

  await getAllTasks($("#current_tab").val(), selector);
  await bindActionClasses();
};

const manageTab = selector => {
  $("#taskPanel ul div").each((index, element) => {
    $(element).removeClass("navbar-tab");
  });

  if (selector.tagName == "A") {
    $(selector)
      .find("div")
      .addClass("navbar-tab");
  } else {
    $(selector).addClass("navbar-tab");
  }
};

const browserReadyWebhookMsg = (
  Discord,
  color,
  msg,
  task,
  site,
  status,
  imgg
) => {
  console.log("status ; ", status);
  let richtext = new Discord.RichEmbed().setColor(color).setTitle(msg);
  if (status == null) {
    richtext.setDescription(
      `Task #${$(`.${task.taskId}-counter`).text()} passed the Splash`
    );
  } else if (status == "PROXY BANNED") {
    richtext.setDescription(
      `Proxy has been banned for Task #${$(`.${task.taskId}-counter`).text()}`
    );
  } else if (status == "CHECKED OUT!") {
    richtext.setDescription(`Checkout Success`);
  } else if (
    status == "IN BILLING" ||
    status == "IN PAYMENT!" ||
    status == "PAYMENT FILL!"
  ) {
    richtext.setDescription(`${task.profile.profileName}`);
  } else {
    richtext.setDescription(
      `Task #${$(`.${task.taskId}-counter`).text()} passed the Splash`
    );
  }

  if (imgg != null) {
    richtext.setThumbnail(imgg);
  }

  richtext
    .addField("PID", preparePID(task.url), true)
    .addField("SITE", site, true)
    .setTimestamp()
    .setFooter(
      "CopBrowser",
      "https://cdn.discordapp.com/attachments/661185665530331136/670994163256262666/logo_final.png"
    );
  console.log("richtext : ", richtext);
  return richtext;
};

/**
 * Send Message To Webhook
 */
const passWebhookMsg = async (
  color,
  msg,
  task,
  site,
  status = null,
  imgg = null
) => {
  if (webhookUrl != "" && webhookUrl != null) {
    try {
      let webHookData = webhookUrl.split("/");

      // Create a new webhook
      const hook = new Discord.WebhookClient(webHookData[5], webHookData[6]);

      let exampleEmbed = await browserReadyWebhookMsg(
        Discord,
        color,
        msg,
        task,
        site,
        status,
        imgg
      );

      await hook.send(exampleEmbed).then(
        () => {},
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

const manageWebhook = async (task, status, type, msg, site, imgg) => {
  let htm = "";
  let color = "";

  if (status == "PASSED SPLASH") {
    await passWebhookMsg("#1dc4c4", msg, task, site, status, imgg);
  } else if (status == "CHECKED OUT!") {
    await passWebhookMsg("#00ff0b", msg, task, site, status, imgg);
  } else if (status == "IN BILLING") {
    await passWebhookMsg("#ff0000", msg, task, site, status, imgg);
  } else if (status == "IN PAYMENT!" || status == "PAYMENT FILL!") {
    if (type == "green") {
      await passWebhookMsg("#00ff0b", msg, task, site, status, imgg);
    } else {
      await passWebhookMsg("#ff0000", msg, task, site, status, imgg);
    }
  } else if (status == "OUT OF STOCK" || status == "PROXY BANNED") {
    await passWebhookMsg("#ff0000", msg, task, site, status, imgg);
  }
};

/**
 * Default Main Function
 */
const main = async () => {
  await getAllTasks("Browser Spoofer", "#browserSpoofer");
  await manageFooterButtons("Browser Spoofer");
  await bindActionClasses();

  /**
   * Get All Browser Spoofer
   */
  $(`#browserSpooferTab`)
    .unbind()
    .click(e => {
      manageTab(e.target);
      getAllTasks("Browser Spoofer", "#browserSpoofer");
      manageFooterButtons("Browser Spoofer");
      bindActionClasses();
      $("#current_tab").val("Browser Spoofer");
    });

  $(`#browserSpooferTab`).click();

  /**
   * Get All Yeezy Supply
   */
  $(`#yeezySupplyTab`)
    .unbind()
    .click(e => {
      manageTab(e.target);
      getAllTasks("Yeezy Supply", "#yeezySupply");
      manageFooterButtons();
      bindActionClasses();
      $("#current_tab").val("Yeezy Supply");
    });

  /**
   * Get All Adidas
   */
  $(`#adidasTab`)
    .unbind()
    .click(e => {
      manageTab(e.target);
      getAllTasks("Adidas", "#adidas");
      manageFooterButtons();
      bindActionClasses();
      $("#current_tab").val("Adidas");
    });

  /**
   * Open Edit All Modal
   */
  $("#edit_all")
    .unbind()
    .click(async () => {
      await CreateTasks.fillProfiles("#massProfileChange");
      $("#editAllModal").modal("show");

      $("#saveEditAll")
        .unbind()
        .click(() => {
          editMassLinks();
        });
    });

  /**
   * Open Custom Link Modal
   */
  $("#custom_link")
    .unbind()
    .click(() => {
      $("#customLinkModal").modal("show");
      $("#openCustomLink").click(() => {
        openCustomLink();
      });
    });

  $("#start_all,#open_all")
    .unbind()
    .click(() => {
      $(
        `#${$(".active.tab-pane").prop(
          "id"
        )} > div.task-list-panel img.task-action.startTaskAction`
      ).each(async (index, ele) => {
        setTimeout(() => {
          $(ele).click();
        }, (index + 1) * taskInterval);
      });
    });

  $("#stop_all,#close_all")
    .unbind()
    .click(() => {
      $(
        `#${$(".active.tab-pane").prop(
          "id"
        )} > div.task-list-panel img.task-action.stopTaskAction`
      ).each((index, ele) => {
        $(ele).click();
      });
    });

  $("#clear_all")
    .unbind()
    .click(async () => {
      await deleteAllTask();
    });

  if (!eventEmitter.eventNames().includes("change-task-status")) {
    await eventEmitter.on(
      "change-task-status",
      (task, status, type, msg, site, imgg = null) => {
        if (type == "blue") {
          $(`.${task.taskId}-status`)
            .removeClass("red")
            .removeClass("green")
            .addClass("blue");
        } else if (type == "red") {
          $(`.${task.taskId}-status`)
            .removeClass("blue")
            .removeClass("green")
            .addClass("red");
        } else if (type == "green") {
          $(`.${task.taskId}-status`)
            .removeClass("blue")
            .removeClass("red")
            .addClass("green");
        }

        manageWebhook(task, status, type, msg, site, imgg);
        $(`.${task.taskId}-status`).text(status);
        $(".overlay").hide();
      }
    );
  }
  Settings.getAllSettings();
};

module.exports = {
  getAllTasks: getAllTasks,
  fillAllTasks: fillAllTasks,
  main: main
};
