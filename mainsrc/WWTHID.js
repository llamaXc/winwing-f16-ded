const WWTHID_JSAPI = require('../WWTHID_JSAPI');
// const WWTHID_JSAPI = require('../../../c/build/Debug/WWTHID_JSAPI');
// const WWTHID_JSAPI = require('../../../WWTHID_JSAPI/build/Release/WWTHID_JSAPI');
const ipcMain = require('electron').ipcMain;
var execFile = require('child_process').execFile;
var Store = require('electron-store');
const log = require('electron-log');
const path = require('path');

var exec = require('child_process').exec;
log.info('WWTHID_JSAPI Load Ok!');

var store = new Store({});

var ActivateVirtualDevice = store.get('ActivateVirtualDevice');
if (ActivateVirtualDevice == true) {
  // console.log(WWTHID_JSAPI.DefaultSettingUp(__dirname.replace('app.asar', 'app.asar.unpacked') + '/../Events/vJoyCfg.bat'));
}

var HIDLog = store.get('HIDLog');
if (HIDLog == true) {
  WWTHID_JSAPI.SetLogEnable(true);
} else if (HIDLog === undefined) {
  store.set('HIDLog', false);
}

WWTHID_JSAPI.nodeprintf(function (agr) {
  console.log(agr);
});

ipcMain.on('WWTHID_Request_CB_Data', function (event, arg) {
  WWTHID_JSAPI.Request_CB_Data(arg);
  // event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('WWTHID_SetLedState', function (event, arg) {
  WWTHID_JSAPI.SetLedState(arg.handle, arg.Index, Number(arg.Brightness));
});

ipcMain.on('WWTHID_SetLedStateBySerialNumber', function (event, arg) {
  WWTHID_JSAPI.SetLedStateBySerialNumber(arg.SerialNumber, arg.Index, Number(arg.Brightness));
});

ipcMain.on('WWTHID_StartUpdate', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.StartUpdate(arg.SerialNumber, arg.FilePath);
});

ipcMain.on('WWTHID_StopUpdate', function (event, arg) {
  WWTHID_JSAPI.StopUpdate(arg);
});

ipcMain.on('WWTHID_StartCalibration', function (event, arg) {
  WWTHID_JSAPI.StartCalibration(arg.handle, arg.Index);
});

ipcMain.on('WWTHID_FinishCalibration', function (event, arg) {
  WWTHID_JSAPI.FinishCalibration(arg.handle, arg.Index);
});

ipcMain.on('WWTHID_StartCalibrationBySerialNumber', function (event, arg) {
  WWTHID_JSAPI.StartCalibrationBySerialNumber(arg.SerialNumber, arg.Index);
});

ipcMain.on('WWTHID_FinishCalibrationBySerialNumber', function (event, arg) {
  WWTHID_JSAPI.FinishCalibrationBySerialNumber(arg.SerialNumber, arg.Index);
});

ipcMain.on('WWTHID_WriteIsQualified', function (event, arg) {
  WWTHID_JSAPI.WriteIsQualified(arg.serial_number, arg.state);
});

ipcMain.on('WWTHID_ReadIsQualified', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ReadIsQualified(arg.serial_number);
});

ipcMain.on('WWTHID_ReadMapConfig', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ReadMapConfig(arg);
});

ipcMain.on('WWTHID_WriteMapConfig', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.WriteMapConfig(arg.Path, arg.Data);
});

ipcMain.on('WWTHID_ReadFlash', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ReadFlash(arg.SerialNumber, arg.Offset);
});

ipcMain.on('WWTHID_WriteFlash', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.WriteFlash(arg.SerialNumber, arg.Offset, arg.Data);
});

ipcMain.on('WWTHID_DrawCurve', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.DrawCurve(arg.Data, arg.W, arg.H);
});

ipcMain.on('WWTHID_ReadEvents', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ReadEvents(arg);
});

ipcMain.on('WWTHID_AddExportFile', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.AddExportFile(arg);
});

ipcMain.on('WWTHID_StartMapping', function (event, arg) {
  execFile(__dirname.replace('app.asar', 'app.asar.unpacked') + '/../WWTMap.exe', function (err, data) {
    console.log(err)
    console.log(data.toString());
  });

  event.returnValue = WWTHID_JSAPI.StartMapping(arg);
});

ipcMain.on('WWTHID_EndMapping', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.EndMapping();
});

ipcMain.on('WWTHID_IsInstallvJoy', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.IsInstallvJoy();
});

ipcMain.on('WWTHID_ReadJ18KeyAxisModeSwitching', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ReadJ18KeyAxisModeSwitching(arg.SerialNumber);
});

ipcMain.on('WWTHID_WriteJ18KeyAxisModeSwitching', function (event, arg) {
  WWTHID_JSAPI.WriteJ18KeyAxisModeSwitching(arg.SerialNumber, arg.Data);
});

ipcMain.on('WWTHID_ReadT18KeyAxisModeSwitching', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ReadT18KeyAxisModeSwitching(arg.SerialNumber);
});

ipcMain.on('WWTHID_WriteT18KeyAxisModeSwitching', function (event, arg) {
  WWTHID_JSAPI.WriteT18KeyAxisModeSwitching(arg.SerialNumber, arg.Data);
});

ipcMain.on('WWTHID_CheckProcessExists', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CheckProcessExists(arg);
});

ipcMain.on('WWTHID_IsWIN10', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.IsWIN10();
});

ipcMain.on('WWTHID_RequestAxisRawData', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.RequestAxisRawData(arg.SerialNumber, arg.index);
});

ipcMain.on('WWTHID_RequestAxisData', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.RequestAxisData(arg.SerialNumber, arg.index);
});

ipcMain.on('WWTHID_RestartDevices', function (event, arg) {
  WWTHID_JSAPI.RestartDevices(arg);
});

ipcMain.on('WWTHID_RestartDevice', function (event, arg) {
  WWTHID_JSAPI.RestartDevice(arg);
});

ipcMain.on('WWTHID_ContinuousModelCals', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ContinuousModelCals(arg.Data, arg.config);
});

ipcMain.on('WWTHID_ContinuousModelInit', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ContinuousModelInit(arg.key, arg.Data, arg.config);
});

ipcMain.on('WWTHID_ContinuousModelDelete', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ContinuousModelDelete(arg.key);
});

ipcMain.on('WWTHID_ContinuousModelOperatoion', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.ContinuousModelOperatoion(arg.key, arg.x, arg.c);
});

ipcMain.on('WWTHID_DeviceReadParam', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.DeviceReadParam(arg.SerialNumber, arg.variableType, arg.Offset);
});

ipcMain.on('WWTHID_DeviceWriteParam', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.DeviceWriteParam(arg.SerialNumber, arg.variableType, arg.Offset, arg.value);
});

ipcMain.on('WWTHID_DeviceSaveParam', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.DeviceSaveParam(arg.SerialNumber);
});

ipcMain.on('WWTHID_SetLcdState', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.SetLcdState(arg.SerialNumber, arg.group, arg.Data);
});

// 20220519 fog

ipcMain.on('WWTHID_CLS_GetChannelEnable', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetChannelEnable(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_GetMode', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetMode(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetMode', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetMode(arg.SerialNumber, arg.Motor, arg.Mode);
});

ipcMain.on('WWTHID_CLS_StartPositioning', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_StartPositioning(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_IsPositioningFinished', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_IsPositioningFinished(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_GetDampCoef', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetDampCoef(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetDampCoef', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetDampCoef(arg.SerialNumber, arg.Motor, arg.DampCoef);
});

ipcMain.on('WWTHID_CLS_GetInertiaRatio', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetInertiaRatio(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetInertiaRatio', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetInertiaRatio(arg.SerialNumber, arg.Motor, arg.Inertia);
});

ipcMain.on('WWTHID_CLS_GetLowGapRatio', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetLowGapRatio(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetLowGapRatio', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetLowGapRatio(arg.SerialNumber, arg.Motor, arg.LowGapRatio);
});

ipcMain.on('WWTHID_CLS_GetHighGapRatio', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetHighGapRatio(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetHighGapRatio', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetHighGapRatio(arg.SerialNumber, arg.Motor, arg.HighGapRatio);
});

ipcMain.on('WWTHID_CLS_GetTorqueMaxResolution', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetTorqueMaxResolution(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_GetCurrentTorque', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetCurrentTorque(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetTargetTorque', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetTargetTorque(arg.SerialNumber, arg.Motor, arg.TargetTorque);
});

ipcMain.on('WWTHID_CLS_GetPositionMaxResolution', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetPositionMaxResolution(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_GetCurrentPostion', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetCurrentPostion(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_SetTargetPostion', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_SetTargetPostion(arg.SerialNumber, arg.Motor, arg.TargetPostion);
});

ipcMain.on('WWTHID_CLS_GetMotorError', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetMotorError(arg.SerialNumber, arg.Motor);
});

ipcMain.on('WWTHID_CLS_GetLastError', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.CLS_GetLastError();
});

ipcMain.on('WWTHID_TEST_SetSetting', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.TEST_SetSetting(arg.Setting);
});

ipcMain.on('WWTHID_TEST_GetOutput', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.TEST_GetOutput(arg.duration);
});

ipcMain.on('WWTHID_TEST_GetLastError', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.TEST_GetLastError();
});
// 20220922fog
ipcMain.on('WWTHID_Monitor_Open', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_Open();
});
ipcMain.on('WWTHID_Monitor_Close', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_Close();
});
ipcMain.on('WWTHID_Monitor_SaveMonitor', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_SaveMonitor();
});
ipcMain.on('WWTHID_Monitor_SetMonitor', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_SetMonitor(arg.MonitorConfig);
});
ipcMain.on('WWTHID_Monitor_GetMonitor', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_GetMonitor();
});
ipcMain.on('WWTHID_Monitor_IdentifyMonitor', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_IdentifyMonitor();
});
// ipcMain.on('WWTHID_Monitor_CB_MonitorChange', function (event, arg) {
//   event.returnValue = WWTHID_JSAPI.Monitor_CB_MonitorChange(arg.func);
// });
ipcMain.on('WWTHID_Monitor_GetLastErr', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.Monitor_GetLastErr();
});

ipcMain.on('WWTHID_post0xF0', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.post0xF0(arg.SerialNumber, arg.functionId, arg.Data);
});

function BindExEtoDevice(exeName, deviceName, x, y, ratio, diffRatio) {
  var mainPath = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '/../');

  const execRun = `"${mainPath}InjectDll.exe" "${mainPath}DCSHook.dll" ${exeName}`;
  // const execRun = 'powershell.exe Start-Process -FilePath "D:\\xlx_work\\SimAppPro\\SimAppPro\\Hook.bat" -WindowStyle hidden -Verb runAs';
  exec(execRun, function (err, data) {
    console.log(err);
    const errmsg = data.toString();
    log.info(err);
    log.info(errmsg);
  });

  WWTHID_JSAPI.BindExEtoDevice(deviceName, x, y, ratio, diffRatio);
}

ipcMain.on('WWTHID_BindExEtoDevice', function (event, arg) {
  BindExEtoDevice(arg.deviceName, arg.x, arg.y);
});

ipcMain.on('WWTHID_SetWindowsPosByTitle', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.SetWindowsPosByTitle(arg.winTitle, arg.x, arg.y, arg.w, arg.h, arg.isTop);
});

ipcMain.on('WWTHID_IsBmsFlying', function (event) {
  event.returnValue = WWTHID_JSAPI.IsBmsFlying();
});

ipcMain.on('WWTHID_GetWindowsPosByTitle', function (event, arg) {
  event.returnValue = WWTHID_JSAPI.GetWindowsPosByTitle(arg.winTitle);
});

WWTHID_JSAPI.BindExEtoDeviceJS = BindExEtoDevice;

// ----------------------------------------------------

module.exports.WWTHID_JSAPI = WWTHID_JSAPI;
