const path = require('path');
const ipcMain = require('electron').ipcMain;
var exec = require('child_process').exec;
const log = require("electron-log");

var ApplicationData;

function ShutdownApplication(arg) {
  try {
    var app = ApplicationData[arg];
    if (app.Started === true) {
      app.App.Shutdown();
      delete app.App;
      app.Started = false;
    }

    return true;
  } catch (error) {
    log.error("ShutdownApplication:" + error);
    return false;
  }
}



module.exports.Shutdown = function () {
  var state = true;
  if (ApplicationData !== undefined) {
    for (a in ApplicationData) {
      if (ShutdownApplication(a) === false) {
        state = false;
      }
    }
  }

  return state;
}

module.exports.Init = async function (_Path, Data) {
  function UpdataApplicationData() {
    Data.mainWindow.webContents.send('WWTHID_UpdataApplicationData', ApplicationData);
  }

  var AppInit = Data.store.get("AppInit");
  var IsError = false;
  if (AppInit !== undefined) {
    try {
      if (AppInit.Message === "Install") {
        await InstallApplication(AppInit);
      } else if (AppInit.Message === "UnInstall") {
        Data.WWTHID.WWTHID_JSAPI.DeleteFileFolder(AppInit.Path);
      }

    } catch (error) {
      console.log(error);
      IsError = false;
    }

    Data.store.delete("AppInit");
  }

  ApplicationData = Data.store.get("Application");

  for (var a in ApplicationData) {
    var _app = ApplicationData[a];
    try {
      _app.Path = path.join(_Path, a);
      let _package = require(path.join(_app.Path, "app.asar/package.json"));
      _app.version = _package.version;
      delete _package;
      _app.StartedInit = true;
      if (_app.Disable === true || _app.Disable === undefined) {
        _app.Started = false;
        //_app.StartedInit = false;
      } else {
        _app.App = require(path.join(_app.Path, "app.asar/main.js"));
        _app.App.Init(Data);

        _app.Started = true;
        //_app.StartedInit = true;
      }

    } catch (error) {
      _app.message = error.message;
      _app.Started = false;
      _app.StartedInit = false;
    }
  }

  DebugApp = Data.store.get("DebugApp");
  if (DebugApp !== undefined &&
    DebugApp === true) {
    try {
      var TEST = require('../../VirtualCockpit/main');
      TEST.Init(Data);
      ApplicationData["VirtualCockpit"] = {
        App: TEST,
        Path: path.join(_Path, "VirtualCockpit"),
        version: "1.0.0",
        Disable: false,
        Started: true,
        StartedInit: true
      }
    } catch (error) {
      console.log("No DEBUG VirtualCockpit");
    }
  }

  ipcMain.on('WWTHID_ApplicationData', function (event, arg) {
    event.returnValue = ApplicationData;
  });

  ipcMain.on('WWTHID_StartUpApplication', function (event, arg) {
    try {
      var app = ApplicationData[arg];

      app.App = require(path.join(app.Path, "app.asar/main.js"));
      app.App.Init(Data);

      if (app.StartedInit !== true) {
        app.StartedInit = true;
      }

      app.Started = true;
      event.returnValue = true;
    } catch (error) {
      event.returnValue = false;
    }
    UpdataApplicationData();
  });

  ipcMain.on('WWTHID_ShutdownApplication', function (event, arg) {
    event.returnValue = ShutdownApplication(arg);
    UpdataApplicationData();
  });

  //调用App里面的卸载，卸载里面的驱动等内容
  function UnInstallApp(app) {
    return new Promise(function (resolve, reject) {
      try {
        app.App = require(path.join(app.Path, "app.asar/main.js"));
        app.App.UnInstall(Data, function () {
          delete app.App;
          resolve(true);
        });
      } catch (error) {
        console.log(error);
        resolve(true);
      }
    });
  }

  ipcMain.on('WWTHID_UnInstallApplication', async function (event, arg) {
    app = ApplicationData[arg];
    if (app !== undefined) {
      try {
        try {
          if (app.App !== undefined) {
            app.App.Shutdown();
            delete app.App;
          }
        } catch (error) {}

        await UnInstallApp(app);

        app.StartedInit = true;
      } catch (error) {}

      if (app.StartedInit === true) {
        var AppInit = Data.store.get("AppInit");

        AppInit = {
          Path: app.Path,
          Message: "UnInstall"
        };

        Data.store.set("AppInit", AppInit);
        event.returnValue = false;
      } else {
        try {
          DeleteDir(app.Path);
        } catch (error) {
          console.log(error);
        }
        event.returnValue = true;
      }

      delete ApplicationData[arg];
      Data.store.delete("Application." + arg);
      UpdataApplicationData();
    } else {
      event.returnValue = true;
    }
  });

  function InstallApplication(arg) {
    return new Promise(function (resolve, reject) {
      try {
        var _RunCode = '"' + __dirname.replace("app.asar", "app.asar.unpacked") + '/../Tool/7zr.exe" e ' + arg.Path + " * -o" + path.join(_Path, arg.Name) + " -aoa -spf";
        exec(_RunCode, function (err, data) {
          log.info("Install Unzip error:" + err);
          log.info("Install Unzip toString:" + data.toString());
          try {
            arg.App.App = require(path.join(arg.App.Path, "app.asar/main.js"));
            arg.App.App.Install(Data, function () {
              delete arg.App.App;

              resolve(true);
            });
          } catch (error) {
            resolve(false);
          }
        });
      } catch (error) {
        resolve(false);
      }
    });
  }

  ipcMain.on('WWTHID_InstallApplication', async function (event, arg) {
    arg.App.Path = path.join(_Path, arg.Name);
    delete arg.App["DownloadProgress"];
    arg.App["Disable"] = false;

    Data.store.set("Application." + arg.Name, arg.App);
    var InstalApp = ApplicationData[arg.Name];
    if (InstalApp === undefined) {
      InstalApp = ApplicationData[arg.Name] = {};
    }
    for (var a in arg.App) {
      InstalApp[a] = arg.App[a];
    }
    UpdataApplicationData();

    if (InstalApp.StartedInit === true) {
      try {
        await UnInstallApp(InstalApp);
      } catch (error) {}
      var AppInit = Data.store.get("AppInit");
      AppInit = arg;
      AppInit.Message = "Install";
      Data.store.set("AppInit", AppInit);

      event.returnValue = false;
    } else {
      await InstallApplication(arg);
      event.returnValue = true;
    }
  });

  ipcMain.on('WWTHID_APPClearCache', async function (event, arg) {
    try {
      var InstalApp = ApplicationData[arg];
      if (InstalApp !== undefined) {
        InstalApp.App.ClearCache();

        event.returnValue = true;
      } else {
        event.returnValue = false;
      }
    } catch (error) {
      console.log(error);
      event.returnValue = false;
    }
  });

  function SendAppInitMessage() {
    Data.mainWindow.webContents.send('WWTHID_AppInitMessage', {
      error: IsError,
      AppInit: AppInit
    });
    ipcMain.removeListener("WWTHID_MainGlobalInited", SendAppInitMessage);
  }
  ipcMain.on("WWTHID_MainGlobalInited", SendAppInitMessage);
}