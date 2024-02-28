// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,

} = require('electron')
const electron = require('electron')


const WWTHID = require('./mainsrc/WWTHID')
// const store = require('./mainsrc/config_set');
// const GetPath = require('./mainsrc/GetPath');
// GetPath.Init(store);

const path = require('path');
var os = require('os');


const F16ICP = require('./mainsrc/ICP_LCD/F16_ICP.js');

// var Application = require('./mainsrc/Application');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    minWidth: 400,
    minHeight: 400,
    width: 400,
    height: 400,
    backgroundColor: '#252526',
    icon: path.join(__dirname, 'www/logo', 'SimAppPro.png'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    },
    show: true

  })

  mainWindow.show()

  mainWindow.loadFile('view/index.html')

  var OpenDevicesState = false;

  function InitCallBack () {
    WWTHID.WWTHID_JSAPI.CB_Data(function (agr) {
      mainWindow.webContents.send('WWTHID_CB_Data', agr);
    });
    WWTHID.WWTHID_JSAPI.CB_InputData(function (agr) {
      mainWindow.webContents.send('WWTHID_CB_InputData', agr);
    });
    WWTHID.WWTHID_JSAPI.CB_UpdateProgress(function (agr) {
      mainWindow.webContents.send('WWTHID_CB_UpdateProgress', agr);
    });
    WWTHID.WWTHID_JSAPI.CB_Read(function (agr) {
      mainWindow.webContents.send('WWTHID_CB_Read', agr);
    });
  }

  // eslint-disable-next-line camelcase
  var addCB_PartChange = function () {
    if (OpenDevicesState) {
      WWTHID.WWTHID_JSAPI.CB_PartChange(function (agr) {
        F16ICP.Part(agr);
      });
    }
  }

  // eslint-disable-next-line camelcase
  var addCB_DeviceChange = function () {
    if (OpenDevicesState) {
      WWTHID.WWTHID_JSAPI.CB_DeviceChange(function (agr) {
      });
    }
  }

  var OpenDevicesFunc = function (event, arg) {
    var mainPath = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'));
    WWTHID.WWTHID_JSAPI.OpenDevices(mainPath);
    InitCallBack();

    OpenDevicesState = true;

    addCB_PartChange();
    addCB_DeviceChange();

    if (event !== undefined) {
      event.returnValue = true;
    }
  };

  var CloseDevicesFunc = function (event, arg) {
    WWTHID.WWTHID_JSAPI.CloseDevices();

    OpenDevicesState = false;
    if (event !== undefined) {
      event.returnValue = true;
    }
  };


  var OpenCLS_OpenDevices = function (event, arg) {
    CloseDevicesFunc();
    WWTHID.WWTHID_JSAPI.CLS_OpenDevices(arg.ConfigPath, arg.Config);

    OpenDevicesState = true;
    addCB_PartChange();
    addCB_DeviceChange();
  }

  var OpenCLS_CloseDevices = function (event, arg) {
    WWTHID.WWTHID_JSAPI.CLS_CloseDevices();
    OpenDevicesFunc();
  }


  mainWindow.on('close', function (event) {
      // if (Application.Shutdown() === false) {
      //   app.exit();
      // }
  });

  mainWindow.on('closed', function () {
    WWTHID.WWTHID_JSAPI.CB_Data(function (agr) { });
    WWTHID.WWTHID_JSAPI.CB_InputData(function (agr) { });
    WWTHID.WWTHID_JSAPI.CB_UpdateProgress(function (agr) { });
    WWTHID.WWTHID_JSAPI.CB_PartChange(function (agr) { });
    WWTHID.WWTHID_JSAPI.CB_DeviceChange(function (agr) { });

    mainWindow = null;

    app.quit();
  })

  mainWindow.on('minimize', function () {
    mainWindow.hide();
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  OpenDevicesFunc()
  F16ICP.init(WWTHID.WWTHID_JSAPI)
}


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('web-contents-created', function () {
  console.log('web-contents-created');
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

