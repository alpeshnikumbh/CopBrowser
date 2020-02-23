/**
 * Profiles Panel All Functions
 */

let profileForm = [
  "profileName",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "address",
  "postalCode",
  "city",
  "state",
  "creditCardNumber",
  "expireTime",
  "ccv"
];

/**
 * Check Profile is valid or not
 * @param string flag
 */
const profileValid = async (flag = "") => {
  for (let i = 0; i < profileForm.length; i++) {
    let ele = profileForm[i];
    if ($(`#${flag + ele}`).val() == "" || $(`#${flag + ele}`).val() == null) {
      return true;
    }

    return false;
  }
};

/**
 * Get Profile Input Values
 * @param string flag
 */
const getProfileValues = (flag = "") => {
  let obj = new Object();
  for (let i = 0; i < profileForm.length; i++) {
    let ele = profileForm[i];
    obj[ele] = $(`#${flag + ele}`).val();
  }

  return getDatabaseDates(obj, "profileId");
};

/**
 * Reset Profile Form
 * @param string flag
 */
const resetProfileForm = (flag = "") => {
  for (let i = 0; i < profileForm.length; i++) {
    const element = profileForm[i];
    $(`#${flag + element}`).val("");
  }
};

/**
 * Save Profile
 */
const saveProfile = () => {
  const profile = getProfileValues();

  db.insertTableContent("profiles", dbPath, profile, (succ, msg) => {
    if (succ) {
      toast("Profile has been saved");
      resetProfileForm();
    } else {
      toast("Something went wrong");
    }
  });
};

/**
 * Update Existing Profile
 */
const updateProfile = () => {
  const existingProfile = getProfileValues("up_");

  let where = {
    profileId: $("#profileId").val()
  };

  db.updateRow("profiles", dbPath, where, existingProfile, (succ, msg) => {
    if (succ) {
      toast("Profile has been updated");
      resetProfileForm("up_");
      getAllProfiles();
    }
  });
};

/**
 * Delete Profiles
 * @param string profileId
 */

const deleteProfile = async profileId => {
  let where = {
    profileId: profileId
  };

  db.deleteRow("profiles", dbPath, where, async (succ, msg) => {
    if (succ) {
      toast("<span style='color:#dc3545;'>Profile has been deleted</span>");
      await resetProfileForm("up_");
      await getAllProfiles();
    }
  });
};

/**
 * Fill Profile Update For Update Operation
 * @param String profileId
 */
const fillProfileForUpdate = profileId => {
  // Set Profile Id For Update
  $("#profileId").val(profileId);

  db.getRows(
    "profiles",
    dbPath,
    {
      profileId: profileId,
      deleted_at: null
    },
    async (succ, data) => {
      if (data.length > 0) {
        data.forEach(profile => {
          for (let i = 0; i < profileForm.length; i++) {
            const ele = profileForm[i];
            $(`#up_${ele}`).val(profile[ele]);
          }
        });
      }
    }
  );
};

/**
 * Get All Profiles
 */
const getAllProfiles = (selector = ".profiles-panel-records") => {
  db.getRows(
    "profiles",
    dbPath,
    {
      deleted_at: null
    },
    async (succ, data) => {
      let Profiles = ``;
      if (data.length > 0) {
        data.forEach(profile => {
          Profiles += `<div class="card-body profile-field" id="${profile.profileId}">
                    ${profile.profileName}
                </div>`;
        });
      }
      $(`${selector}`).html(Profiles);
    }
  );

  $(".profile-field").click(e => {
    fillProfileForUpdate(e.target.id);
  });
};

/**
 * Get All Nike Accounts
 */
const getAllNikeAccounts = () => {
  db.getRows(
    "nikeAccounts",
    dbPath,
    {
      deleted_at: null
    },
    async (succ, data) => {
      let Accounts = ``;
      if (data.length > 0) {
        data.forEach(account => {
          Accounts += `<div class="card-body account-field" id="${account.nikeAccountId}">
                    ${account.username}:${account.password}
                </div>`;
        });
      }
      $(`.account-list-panel`).html(Accounts);
    }
  );
};

/**
 * Save Nike Accounts
 * @param string accounts
 */
const saveNikeAccounts = async accounts => {
  await accounts.forEach(async (ele, index) => {
    let acc = ele.split(":");

    if (acc[0] && acc[1]) {
      let account = getDatabaseDates(
        {
          username: acc[0],
          password: acc[1]
        },
        "nikeAccountId"
      );

      await db.insertTableContent(
        "nikeAccounts",
        dbPath,
        account,
        (succ, msg) => {}
      );
      await toast("All Accounts have been saved");
      $("#accounts").val("");
      await getAllNikeAccounts();
    } else {
      toast(`Account ${ele} is invalid format`);
    }
  });
};

const manageTab = selector => {
  $("#profilePanel ul div").each((index, element) => {
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
   * Create Profiles
   */
  $(`#createProfilesTab`)
    .unbind()
    .click(e => {
      $("#profileId").val("");
      manageTab(e.target);
    });

  /**
   * Get All Profiles
   */
  $(`#profilesTab`)
    .unbind()
    .click(e => {
      $("#profileId").val("");
      resetProfileForm("up_");
      manageTab(e.target);
      getAllProfiles();
    });

  /**
   * Get All Nike Accounts
   */
  $(`#nikeAccountTab`)
    .unbind()
    .click(e => {
      $("#profileId").val("");
      manageTab(e.target);
      getAllNikeAccounts();
    });

  /**
   * Perform Selection Of Profile
   */
  $(".profiles-panel-records")
    .unbind()
    .click(e => {
      $(".profiles-panel-records .card-body").each((i, e) => {
        $(e).removeClass("selected");
      });
      $(e.target).addClass("selected");
    });

  /**
   *  Import File For Profile
   */
  $("#importFileProfile")
    .unbind()
    .click(() => {
      dialog
        .showOpenDialog({
          title: "Select Profile File For Import",
          properties: ["openFile", "createDirectory"],
          filters: [{ name: "csv", extensions: ["csv"] }]
        })
        .then(result => {
          if (result.canceled) {
            console.log("Canceled");
          } else {
            csvtojsonV2()
              .fromFile(result.filePaths[0])
              .then(async jsonObj => {
                for (let i = 0; i < jsonObj.length; i++) {
                  let obj = getDatabaseDates(jsonObj[i], "profileId");
                  await db.insertTableContent(
                    "profiles",
                    dbPath,
                    obj,
                    (succ, msg) => {}
                  );
                }
                toast(`${jsonObj.length} profiles have been saved`);
                await resetProfileForm();
                await getAllProfiles();
              });
          }
        });
    });

  /**
   *  Export Profiles In File
   */
  $("#exportFileProfile")
    .unbind()
    .click(() => {
      dialog
        .showSaveDialog({
          title: "Save Profiles In File",
          defaultPath: "~/profiles.csv",
          properties: [
            "openFile",
            "createDirectory",
            "showOverwriteConfirmation"
          ],
          filters: [{ name: "csv", extensions: ["csv"] }],
          buttonLabel: "Save",
          nameFieldLabel: "profiles"
        })
        .then(savePath => {
          if (savePath.canceled) {
            console.log("Canceled");
          } else {
            db.getRows(
              "profiles",
              dbPath,
              {
                deleted_at: null
              },
              async (succ, data) => {
                jsoncsv.buffered(
                  data,
                  {
                    fields: [
                      {
                        name: "profileName",
                        label: "profileName"
                      },
                      {
                        name: "firstName",
                        label: "firstName"
                      },
                      {
                        name: "lastName",
                        label: "lastName"
                      },
                      {
                        name: "email",
                        label: "email"
                      },
                      {
                        name: "phoneNumber",
                        label: "phoneNumber"
                      },
                      {
                        name: "address",
                        label: "address"
                      },
                      {
                        name: "postalCode",
                        label: "postalCode"
                      },
                      {
                        name: "city",
                        label: "city"
                      },
                      {
                        name: "state",
                        label: "state"
                      },
                      {
                        name: "creditCardNumber",
                        label: "creditCardNumber"
                      },
                      {
                        name: "expireTime",
                        label: "expireTime"
                      },
                      {
                        name: "ccv",
                        label: "ccv"
                      }
                    ]
                  },
                  async (err, csv) => {
                    fs.writeFile(savePath.filePath, csv, function(err) {
                      if (err) throw err;
                      toast(`${data.length} profiles have been exported`);
                    });
                  }
                );
              }
            );
          }
        });
    });

  /**
   *  Delete All Profiles
   */
  $("#deleteAllProfile")
    .unbind()
    .click(() => {
      db.clearTable("profiles", dbPath, (succ, msg) => {
        if (succ) {
          toast("All profiles have been deleted");
          getAllProfiles();
          resetProfileForm("up_");
        }
      });
    });

  /**
   * Open Add Account Modal
   */
  $("#add_account")
    .unbind()
    .click(() => {
      $("#addAccountModal").modal("show");

      $("#saveAccount")
        .unbind()
        .click(() => {
          let accounts = $("textarea#accounts")
            .val()
            .split("\n");
          saveNikeAccounts(accounts);
        });
    });

  /**
   * Delete all Nike account
   */
  $("#delete_all_account")
    .unbind()
    .click(() => {
      db.clearTable("nikeAccounts", dbPath, (succ, msg) => {
        if (succ) {
          toast("All nike accounts have been deleted");
          getAllNikeAccounts();
        }
      });
    });

  /**
   * Save Profile
   */
  $("#saveProfiles").click(async e => {
    e.preventDefault();

    if (await profileValid()) {
      toast("Fill all field");
      return;
    }

    saveProfile();
  });

  /**
   * Updater Profile
   */
  $("#updateProfiles").click(async e => {
    e.preventDefault();

    if (await profileValid("up_")) {
      toast("Fill all field");
      return;
    }

    updateProfile();
  });

  /**
   * Delete Profile
   */
  $("#deleteProfile").click(async e => {
    e.preventDefault();

    if ($("#profileId").val() == "") {
      toast("<span style='color:#dc3545;'>No profile selected</span>");
      return;
    }

    deleteProfile($("#profileId").val());
  });

  /**
   * Import Account File On File Select
   */
  $("#accountImport").on("change", () => {
    let file = document.querySelector("#accountImport").files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = async function(evt) {
        let accounts = evt.target.result.split("\n");
        await saveNikeAccounts(accounts);
        toast("Account file imported success");
        $("#accountImport").val("");
      };
      reader.onerror = function(evt) {
        toast("error reading file");
      };
    }
  });

  /**
   * Import Nike account file Dialog Open
   */
  $("#import_account").click(() => {
    $("#accountImport").click();
  });
};

module.exports = {
  getAllProfiles: getAllProfiles,
  main: main
};
