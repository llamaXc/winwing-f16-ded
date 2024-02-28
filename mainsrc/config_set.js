const Store = require('electron-store');
const ipcMain = require('electron').ipcMain;

var store = new Store({});

var _IsAdvanced = store.get('IsAdvanced');
if (_IsAdvanced == undefined) {
  store.set('IsAdvanced', false);
}

var _IsAdvanced = store.get('IsAdvanced');
if (_IsAdvanced == undefined) {
  store.set('IsAdvanced', false);
}

var mandatoryMinorVersionUpgrade = store.get('mandatoryMinorVersionUpgrade');
if (mandatoryMinorVersionUpgrade == undefined) {
  store.set('mandatoryMinorVersionUpgrade', false);
}

var _LightEnduranceTest = store.get('LightEnduranceTest');
if (_LightEnduranceTest == undefined) {
  store.set('LightEnduranceTest', false);
}

var _DCSPath = store.get('DCSPath');
if (_DCSPath == undefined) {
  store.set('DCSPath', '');
}

var _IsSyncCalibration = store.get('IsSyncCalibration');
if (_IsSyncCalibration == undefined) {
  store.set('IsSyncCalibration', false);
}

var _Application = store.get('Application');
if (_Application == undefined) {
  store.set('Application', {});
}

var _disableUpdateLimit = store.get('disableUpdateLimit');
if (_disableUpdateLimit == undefined) {
  store.set('disableUpdateLimit', false);
}

var dcseventbindconfig = store.get('dcs_event_bind_config');
if (dcseventbindconfig === undefined) {
  store.set('dcs_event_bind_config', { isResetLight: false });
}

var isHintSoftwareUpdate = store.get('isHintSoftwareUpdate');
if (isHintSoftwareUpdate === undefined) {
  store.set('isHintSoftwareUpdate', false);
}

var isHintHardwareUpdate = store.get('isHintHardwareUpdate');
if (isHintHardwareUpdate === undefined) {
  store.set('isHintHardwareUpdate', false);
}

ipcMain.on('WWTHID_Config', function (event, arg) {
  try {
    event.returnValue = store.get();
  } catch (error) {

  }
});

ipcMain.on('WWTHID_ConfigByKey', function (event, arg) {
  try {
    event.returnValue = store.get(arg);
  } catch (error) {

  }
});

ipcMain.on('WWTHID_SetConfig', function (event, arg) {
  try {
    store.set(arg.name, arg.value);
  } catch (error) {

  }
});

module.exports = store;
