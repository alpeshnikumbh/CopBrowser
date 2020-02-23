/**
 * Create Task Panel All Functions
 */

/**
 * Check for valid Task
 */
const validTask = () => {
  if ($("#url").val() == "" || $("#url").val() == null) {
    toast("<span style='color:#dc3545;'>Url Required</span>");
    return false;
  }

  if (parseInt($("#amount").val()) < 1) {
    toast("<span style='color:#dc3545;'>Amount atleast 1</span>");
    return false;
  }

  let totalProxy = JSON.parse($("#allFetchedProxy").val());

  if (
    totalProxy.length < parseInt($("#amount").val()) &&
    $("#use_proxy_pool").prop("checked")
  ) {
    toast(
      `<span style='color:#dc3545;'>There is only ${totalProxy.length}</span>`
    );
    return false;
  }

  return true;
};

/**
 * Reset Create Task Form
 * @param string flag
 */
const resetCreateTaskForm = () => {
  $("#site").val("Browser Spoofer");
  $("#url").val("");
  $("#region").val("");
  $("#region").attr("disabled", "disabled");

  $("#amount").val("1");
  $("#profile").val("");
  $("#proxy_pool").val("");
  $("#proxy").val("");
  $("#profile_autofill").prop("checked") && $("#profile_autofill").click();
  $("#use_proxy_pool").prop("checked") && $("#use_proxy_pool").click();
  $("#run_localhost").prop("checked") && $("#run_localhost").click();
  $("#use_nike_account").prop("checked") && $("#use_nike_account").click();
};

const getRandomNikeAccount = () => {
  return new Promise(async (resolve, reject) => {
    await db.getRows(
      "nikeAccounts",
      dbPath,
      {
        deleted_at: null
      },
      async (succ, data) => {
        let index = getRandomIndex(0, data.length - 1);
        let nike_account = `${data[index].username.trim()}:${data[
          index
        ].password.trim()}`;
        resolve(nike_account);
      }
    );
  });
};
/**
 * Get All Task Field Values
 */
const getTaskValues = () => {
  let obj = {
    site: $("#site").val(),
    url: $("#url").val(),
    region: $("#region").val(),
    amount: $("#amount").val(),
    profile: $("#profile").val() != "" ? JSON.parse($("#profile").val()) : "",
    proxy: $("#proxy").val(),
    profile_autofill: $("#profile_autofill").prop("checked"),
    use_proxy_pool: $("#use_proxy_pool").prop("checked"),
    run_localhost: $("#run_localhost").prop("checked"),
    use_nike_account: $("#use_nike_account").prop("checked")
  };

  return getDatabaseDates(obj, "taskId");
};

/**
 * Save New Task
 */
const saveCreateTasks = async () => {
  let repeat = parseInt($("#amount").val());
  let proxies = await getProxies($("#proxy_pool").val());
  $("#allFetchedProxy").val(JSON.stringify(proxies));

  if (!validTask()) {
    return;
  }

  let status = await new Promise(async (resolve, reject) => {
    for (let i = 0; i < repeat; i++) {
      const task = getTaskValues();

      if (task.use_nike_account) {
        task.nike_account = await getRandomNikeAccount();
      }

      if (proxies.length > 0) {
        task.proxy = await prepareProxy(proxies[i]);
        await db.deleteRow(
          "proxies",
          dbPath,
          { proxyId: proxies[i].proxyId },
          (succ, msg) => {}
        );
      }

      await db.insertTableContent("tasks", dbPath, task, (succ, msg) => {
        if (succ) {
        } else {
          toast("Something went wrong");
        }
      });
    }
    resolve("done");
  });

  if (status == "done") {
    toast(`${repeat} Tasks have been created`);
    // resetCreateTaskForm();
  }
};

/**
 * Get All Profiles
 */
const fillProfiles = (selector = "#profile") => {
  db.getRows(
    "profiles",
    dbPath,
    {
      deleted_at: null
    },
    async (succ, data) => {
      let Profiles = `<option value="" selected>Select Profile</option>`;
      if (data.length > 0) {
        data.forEach(profile => {
          Profiles += `<option id='${
            profile.profileId
          }' value='${JSON.stringify(
            profile
          )}'>${profile.profileName.trim()}</option>`;
        });
      }
      $(`${selector}`).html(Profiles);
    }
  );
};

/**
 * Get Random Index For Proxy/Nike Account
 * @param int min
 * @param int max
 */
const getRandomIndex = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const prepareProxy = data => {
  let proxy = "";
  proxy += data.ip != null ? data.ip : "";
  proxy += data.port != null ? ":" + data.port : "";
  proxy += data.username != null ? ":" + data.username : "";
  proxy += data.password != null ? ":" + data.password : "";

  return proxy;
};

/**
 * Select Randomly Profy From Pool
 * @param string type
 */
const getProxies = async type => {
  return await new Promise((resolve, reject) => {
    if (type != "" && type != null) {
      db.getRows(
        "proxies",
        dbPath,
        {
          deleted_at: null,
          type: type
        },
        async (succ, data) => {
          resolve(data);
        }
      );
    } else {
      resolve([]);
    }
  });
};

/**
 * Fill Proxy Pool Types
 */
const fillProxyPool = () => {
  if ($("#use_proxy_pool").prop("checked")) {
    $("#proxy_pool").removeAttr("disabled");
    let proxies = `<option value="" selected>Select Proxy Pool</option>`;
    let types = ["Browser Spoofer", "Yeezy Supply", "Adidas"];

    types.forEach(ele => {
      proxies += `<option value="${ele}">${ele}</option>`;
    });

    $("#proxy_pool").html(proxies);
    $("#proxy").attr("disabled", "disabled");
  } else {
    $("#proxy_pool").attr("disabled", "disabled");
    $("#proxy_pool").html(
      `<option value="" selected>Select Proxy Pool</option>`
    );
    $("#proxy").val("");
    $("#proxy").removeAttr("disabled");
  }
};

/**
 * Default Main Function
 */
const main = async () => {
  /**
   * Auto Fill Profile On Change
   */
  $("#profile_autofill")
    .unbind()
    .on("change", () => {
      if ($("#profile_autofill").prop("checked")) {
        $("#profile").removeAttr("disabled");
        fillProfiles();
      } else {
        $("#profile").attr("disabled", "disabled");
        $("#profile").html(`<option value="" selected>Select Profile</option>`);
      }
    });

  /**
   * Proxy Pull Change Event
   */
  $("#use_proxy_pool")
    .unbind()
    .on("change", () => {
      fillProxyPool();
    });

  /**
   * Region Change Event
   */
  $("#region").on("change", () => {
    let val = $("#region").val();
    if (val == "us") {
      $("#url").val(`https://www.adidas.com/${val}/yeezy`);
    } else if (val == "sg" || val == "ph" || val == "au") {
      $("#url").val(`https://www.adidas.com.${val}/yeezy`);
    } else if (val == "uk" || val == "th") {
      $("#url").val(`https://www.adidas.co.${val}/yeezy`);
    } else {
      $("#url").val(`https://www.adidas.${val}/yeezy`);
    }
  });

  /**
   * Select Proxy From Specified Pool
   */
  $("#proxy_pool")
    .unbind()
    .on("change", async () => {
      let proxyData = await getProxies($("#proxy_pool").val());
      $("#allFetchedProxy").val(JSON.stringify(proxyData));

      console.log("Proxy Data : ", proxyData);
    });

  /**
   * Run Localhost Change Event
   */
  $("#run_localhost")
    .unbind()
    .on("change", () => {
      if ($("#run_localhost").prop("checked")) {
        if ($("#use_proxy_pool").prop("checked")) {
          $("#use_proxy_pool").click();
        }
        fillProxyPool();
        $("#use_proxy_pool").attr("disabled", "disabled");
        $("#proxy").attr("disabled", "disabled");
      } else {
        $("#use_proxy_pool").removeAttr("disabled");
        $("#proxy").removeAttr("disabled");
      }
    });

  /**
   * Site DropDown Change Event Adidas
   */
  $("#site")
    .unbind()
    .on("change", () => {
      if ($("#site").val() == "Adidas") {
        $("#region").removeAttr("disabled");
        $("#url").attr("disabled", "disabled");
        $("#region").val(defaultRegion);
        $("#region").change();
      } else {
        $("#url")
          .removeAttr("disabled")
          .val("");
        $("#region").attr("disabled", "disabled");
        $("#region").val("");
      }

      if ($("#site").val() == "Browser Spoofer") {
        $("#use_nike_account").removeAttr("disabled");
      } else {
        $("#use_nike_account").attr("disabled", "disabled");
      }
    });

  /**
   * Account Plus For Add Amount By 1
   */
  $("#accountPlus")
    .unbind()
    .click(() => {
      $("#amount").val(parseInt($("#amount").val()) + 1);
    });

  /**
   * Account Plus For Deduct Amount By 1
   */
  $("#accountMinus")
    .unbind()
    .click(() => {
      if (parseInt($("#amount").val()) > 0) {
        $("#amount").val(parseInt($("#amount").val()) - 1);
      }
    });

  /**
   * Save Tasks
   */
  $("#saveCreateTask")
    .unbind()
    .click(async e => {
      e.preventDefault();

      saveCreateTasks();
    });

  $("#clearTaskForm")
    .unbind()
    .click(() => {
      resetCreateTaskForm();
    });

  await Settings.getAllSettings();
  /**
   * Reset Create Task Form
   */
  resetCreateTaskForm();
};

module.exports = {
  main: main,
  fillProfiles: fillProfiles
};
