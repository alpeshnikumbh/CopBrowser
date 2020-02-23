module.exports = async () => {
  if (!fs.existsSync(`${basePath}/db`)) {
    fs.mkdirSync(`${basePath}/db`);
  }

  if (!fs.existsSync(`${dbPath}/tasks.json`)) {
    db.createTable("tasks", dbPath, (succ, msg) => {});
  }

  if (!fs.existsSync(`${dbPath}/user.json`)) {
    db.createTable("user", dbPath, (succ, msg) => {});
  }

  if (!fs.existsSync(`${dbPath}/proxies.json`)) {
    db.createTable("proxies", dbPath, (succ, msg) => {});
  }

  if (!fs.existsSync(`${dbPath}/nikeAccounts.json`)) {
    db.createTable("nikeAccounts", dbPath, (succ, msg) => {});
  }

  if (!fs.existsSync(`${dbPath}/profiles.json`)) {
    db.createTable("profiles", dbPath, (succ, msg) => {});
  }

  if (!fs.existsSync(`${dbPath}/settings.json`)) {
    db.createTable("settings", dbPath, (succ, msg) => {
      if (succ) {
        let settings = {
          browser_spoofer: {
            interval: 0,
            auto_refresh: false,
            disable_image: false
          },
          yeezy_supply: {
            stop_proxy_banned: 0,
            auto_refresh: false,
            disable_image: false
          },
          adidas: {
            region: "us",
            disable_image: false
          },
          discord: null
        };

        db.insertTableContent("settings", dbPath, settings, (succ, msg) => {
          if (succ) {
          } else {
          }
        });
      }
    });
  }
};
