const { remote, ipcRenderer } = require("electron");

module.exports = () => {
  (async function() {
    const navbarActionIcons = () => {
      const closeWindow = () => {
        var window = remote.BrowserWindow.getFocusedWindow();
        window.close();
      };

      const minimizeWindow = () => {
        var window = remote.BrowserWindow.getFocusedWindow();
        window.minimize();
      };

      const maximizeWindow = () => {
        var window = remote.BrowserWindow.getFocusedWindow();
        window.isMaximized() ? window.unmaximize() : window.maximize();
      };

      $("#close")
        .unbind()
        .click(closeWindow);
      $("#minimize")
        .unbind()
        .click(minimizeWindow);
      $("#maximize")
        .unbind()
        .click(maximizeWindow);
    };

    const navItemsSelector = [
      "#tasks",
      "#createTasks",
      "#proxies",
      "#profiles",
      "#settings"
    ];

    const manageFooter = tab => {
      if (tab == "tasks") {
        $("#navbar-footer")
          .parent()
          .removeClass("hide-ele");
        $(".navbar-footer-share")
          .removeClass("nav-background")
          .addClass("body-background");
      } else {
        $("#navbar-footer")
          .parent()
          .addClass("hide-ele");
        $(".navbar-footer-share")
          .removeClass("body-background")
          .addClass("nav-background");
      }
    };

    const Init = async () => {
      Tasks.main();
      Activation.main();
      navbarActionIcons();

      $("#tasks-edit").load(`${__dirname}/../pages/modals/editModal.html`);
      $("#tasks-editAll").load(
        `${__dirname}/../pages/modals/editAllModal.html`
      );
      $("#tasks-customLink").load(
        `${__dirname}/../pages/modals/customLink.html`
      );

      await manageFooter("tasks");
    };

    $(".navbar-header").load(`${__dirname}/../pages/navbar.html`, response => {
      navbarActionIcons();
      $(
        "#navbar-header a[data-toggle],#navbar-header > ul > li:nth-child(5) > a > div"
      ).on("click", e => {
        $(".overlay").show();
        e.preventDefault();
        let selector = null;

        if ($(e.target).hasClass("nav-link")) {
          selector = $(e.target).data("toggle");
          $(e.target)
            .parent()
            .addClass("active");
        } else {
          selector = $(e.target)
            .parent()
            .data("toggle");
          $(e.target)
            .parent()
            .parent()
            .addClass("active");
        }

        $(".content").hide();
        $(selector).fadeIn();

        navItemsSelector.forEach((ele, index) => {
          $(`#navbar-header a[data-toggle='${ele}']`)
            .parent()
            .removeClass("active");
          $(`#navbar-header a[data-toggle='${ele}']`)
            .find("div")
            .removeClass("navbar-tab");
        });

        if ($(e.target).hasClass("nav-link")) {
          $(e.target)
            .find("div")
            .addClass("navbar-tab");
        } else {
          $(e.target).addClass("navbar-tab");
        }

        switch (selector) {
          case "#tasks":
            Init();
            break;
          case "#createTasks":
            CreateTasks.main();
            manageFooter();
            $(".overlay").hide();
            break;
          case "#proxies":
            $("#proxy-modals").load(
              `${__dirname}/../pages/modals/proxyModal.html`
            );
            Proxies.main();
            manageFooter();
            $(".overlay").hide();
            break;
          case "#profiles":
            $("#profile-modals").load(
              `${__dirname}/../pages/modals/accountModal.html`
            );
            Profiles.main();
            manageFooter();
            $(".overlay").hide();
            break;
          case "#settings":
            Settings.main();
            manageFooter();
            break;
          default:
            manageFooter();
            $(".overlay").hide();
            break;
        }
      });

      $(".overlay").hide();
    });

    $("#tasks").load(`${__dirname}/../pages/tasks.html`, async response => {
      await Init();
    });

    $("#createTasks")
      .load(`${__dirname}/../pages/createTasks.html`)
      .hide();
    $("#proxies")
      .load(`${__dirname}/../pages/proxies.html`)
      .hide();
    $("#profiles")
      .load(`${__dirname}/../pages/profiles.html`)
      .hide();
    $("#settings")
      .load(`${__dirname}/../pages/settings.html`)
      .hide();

    $(".navbar-footer").load(`${__dirname}/../pages/footer.html`, response => {
      manageFooter("tasks");
    });

    $("document").ready(async function() {
      $('[data-toggle="tooltip"]').tooltip();
      Init();
    });
  })();
};
