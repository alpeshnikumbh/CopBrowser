/**
 * Proxies Panel All Functions
 */

let active_proxy_panel = "Browser Spoofer";
/**
 * Get All Proxies
 */
const getAllProxies = type => {
  db.getRows(
    "proxies",
    dbPath,
    {
      deleted_at: null,
      type: type
    },
    async (succ, data) => {
      if (succ) {
        let Proxies = ``;
        if (data.length > 0) {
          data.forEach(proxy => {
            Proxies += `<div class="card-body proxy-field" id="${proxy.proxyId}">`;
            Proxies += `${proxy.id}:${proxy.port}`;
            if (proxy.username != null && proxy.password != null) {
              Proxies += `${proxy.username}:${proxy.password}`;
            }
            Proxies += `</div>`;
          });
        }

        $(`.proxy-list-panel`)
          .html(Proxies)
          .parent()
          .parent()
          .parent()
          .hide()
          .fadeIn();
      }
    }
  );
};

/**
 * Save All Proxies
 * @param string proxies
 */
const saveProxies = async (proxies, type = null) => {
  await proxies.forEach(async (ele, index) => {
    let prox = ele.split(":");

    if (prox[0] && prox[1]) {
      let proxy = getDatabaseDates(
        {
          ip: prox[0],
          port: prox[1],
          username: prox[2] ? prox[2] : null,
          password: prox[3] ? prox[3] : null,
          type: type == null ? active_proxy_panel : type
        },
        "proxyId"
      );

      await db.insertTableContent("proxies", dbPath, proxy, (succ, msg) => {});
      await toast(`All ${active_proxy_panel} Proxies have been saved`);
      $("#proxies").val("");
      await getAllProxies(active_proxy_panel);
    } else {
      toast(`Proxie ${ele} is invalid format`);
    }
  });
};

const deleteProxyById = async id => {
  await db.deleteRow(
    "proxies",
    dbPath,
    {
      id: id
    },
    (succ, msg) => {
      if (succ) {
        toast("<span style='color:#dc3545;'>Proxy has been deleted</span>");
        getAllProxies(active_proxy_panel);
      }
    }
  );
};

const manageTab = selector => {
  $("#proxyPanel ul div").each((index, element) => {
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

/**
 * Default Main Function
 */
const main = () => {
  /**
   * Get All Browser Spoofer
   */
  $(`#browserSpooferProxyTab`)
    .unbind()
    .click(e => {
      manageTab(e.target);
      active_proxy_panel = "Browser Spoofer";
      getAllProxies(active_proxy_panel);
    });

  /**
   * Get All Yeezy Supply
   */
  $(`#yeezySupplyProxyTab`)
    .unbind()
    .click(e => {
      manageTab(e.target);
      active_proxy_panel = "Yeezy Supply";
      getAllProxies(active_proxy_panel);
    });

  /**
   * Get All Adidas
   */
  $(`#adidasProxyTab`)
    .unbind()
    .click(e => {
      manageTab(e.target);
      active_proxy_panel = "Adidas";
      getAllProxies(active_proxy_panel);
    });

  /**
   * Add Proxy Modal Open
   */
  $(`#add_proxy`).click(() => {
    $("#addProxyModal").modal("show");

    $("#saveProxy")
      .unbind()
      .click(() => {
        let proxies = $("textarea#proxies")
          .val()
          .split("\n");
        saveProxies(proxies);
      });
  });

  $("#delete_all_proxy")
    .unbind()
    .click(async () => {
      // console.log("active_proxy_panel : ", active_proxy_panel);
      db.getRows(
        "proxies",
        dbPath,
        {
          deleted_at: null,
          type: active_proxy_panel
        },
        async (succ, data) => {
          data.forEach(async (proxy, i) => {
            await deleteProxyById(proxy.id);
          });
        }
      );
    });

  /**
   * Import Account File On File Select
   */
  $("#proxyImport")
    .unbind()
    .on("change", () => {
      let file = document.querySelector("#proxyImport").files[0];
      if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async function(evt) {
          let proxies = evt.target.result.split("\n");
          await saveProxies(proxies);
          $("#proxyImport").val("");
        };
        reader.onerror = function(evt) {
          toast("error reading file");
        };
      }
    });

  $("#import_proxy")
    .unbind()
    .click(() => {
      $("#proxyImport")
        .unbind()
        .click();
    });

  getAllProxies("Browser Spoofer");
};

module.exports = {
  getAllProxies: getAllProxies,
  main: main,
  saveProxies: saveProxies
};
