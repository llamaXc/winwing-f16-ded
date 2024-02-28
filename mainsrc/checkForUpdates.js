/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const {
  dialog
} = require('electron')
const {
  autoUpdater
} = require('electron-updater')
const ipcMain = require('electron').ipcMain;
const log = require('electron-log');

log.transports.console.level = false;

autoUpdater.autoDownload = false
var mainWindow;
var store;
var IsHaveUpdatesState = -1;
var WindowALLClose;
var InstallFirstStart;
var ShutdownApplication;

var _AutoClick = false;
var isHint = false;

autoUpdater.on('error', (error) => {
  // dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
  log.error(error == null ? 'unknown' : (error.stack || error).toString());
})

ipcMain.on('WWTHID_IsUpdatesSoftware', function (event, arg) {
  try {
    autoUpdater.downloadUpdate();
    mainWindow.webContents.send('WWTHID_IsHaveUpdates', 2);
    IsHaveUpdatesState = 2;
    store.set('IsHaveUpdatesState', 2);
  } catch (e) {
    console.log(e);
  }
});

autoUpdater.on('update-available', () => {
  if (IsHaveUpdatesState == 2) {
    autoUpdater.downloadUpdate();
    return;
  }
  mainWindow.webContents.send('WWTHID_IsHaveUpdates', 1);
  IsHaveUpdatesState = 1;
  if (_AutoClick) {
    mainWindow.webContents.send('WWTHID_IsUpdatesSoftware', isHint);
  }
})

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('WWTHID_IsHaveUpdates', 0);
  IsHaveUpdatesState = 0;
  /* dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  }) */
  // updater.enabled = true
  // updater = null
})

autoUpdater.on('update-downloaded', () => {
  store.set('IsHaveUpdatesState', -1);

  var _title = 'SimAppPro Install Updates';
  var _message = 'SimAppPro Updates downloaded, SimAppPro will be quit for update...';
  if (store.get('Language') == 'cn') {
    _title = 'SimAppPro安装更新';
    _message = 'SimAppPro已下载更新，SimAppPro将退出，进行更新...';
  }

  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: _title,
    message: _message
  }).then(() => {
    WindowALLClose();
    setImmediate(() => {
      autoUpdater.quitAndInstall();
    })
  });
})

function SetFeedURL () {
  var SelectServer = store.get('SelectServer');
  if (SelectServer == 'US') {
    autoUpdater.setFeedURL('http://download.winwing.cn/download/SimAppPro/');
  } else if (SelectServer == 'China') {
    autoUpdater.setFeedURL('http://cndownload.winwing.cn/download/SimAppPro/');
  }
}

function checkForUpdates () {
  try {
    SetFeedURL();

    autoUpdater.checkForUpdates()
  } catch (error) {
    console.log(error);
  }
}

// export this to MenuItem click callback
ipcMain.on('WWTHID_checkForUpdates', function (event, arg) {
  _AutoClick = arg.autoClick;
  isHint = arg.isHint;
  if (IsHaveUpdatesState == 2) {
    mainWindow.webContents.send('WWTHID_IsHaveUpdates', IsHaveUpdatesState);
  } else {
    checkForUpdates();
  }
});

module.exports = function (_mainWindow, _store, _WindowALLClose, _InstallFirstStart, _ShutdownApplication) {
  mainWindow = _mainWindow;
  store = _store;
  WindowALLClose = _WindowALLClose;
  InstallFirstStart = _InstallFirstStart;
  ShutdownApplication = _ShutdownApplication;

  if (InstallFirstStart) {
    store.delete('IsHaveUpdatesState');
  }

  IsHaveUpdatesState = store.get('IsHaveUpdatesState');
  if (IsHaveUpdatesState == undefined || IsHaveUpdatesState == null) {
    IsHaveUpdatesState = -1;
  } else if (IsHaveUpdatesState == 2) {
    checkForUpdates();
  }
}
