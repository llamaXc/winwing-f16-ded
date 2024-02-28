var regedit = require('regedit');
// regedit.setExternalVBSLocation('resources/regedit/vbs');

var fs = require('fs');
const {
  app,
  ipcMain
} = require('electron');
var _ = require('lodash');
const path = require('path');
var exec = require('child_process').exec;
const log = require('electron-log');

const regeditFile = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '/../config/regedit/vbs');
regedit.setExternalVBSLocation(regeditFile);

var g_DCS_ALL_Path = {
  steamDCS: {
    EXEPath: undefined,
    SavePath: undefined
  },
  ED_DCS: {
    EXEPath: undefined,
    SavePath: undefined
  },
  ED_DCSOpenbeta: {
    EXEPath: undefined,
    SavePath: undefined
  }
};

var g_P3D_ALL_Path = {
  P3DV3: {
    EXEPath: undefined,
    SavePath: undefined
  },
  P3DV4: {
    EXEPath: undefined,
    SavePath: undefined
  }
};

var g_XPANE_ALL_Path = {
  XPANE11: {
    EXEPath: undefined,
    SavePath: undefined
  },
  XPANE12: {
    EXEPath: undefined,
    SavePath: undefined
  }
};

var g_BMS_ALL_Path = {
  Falcon_BMS: {
    EXEPath: undefined,
    SavePath: undefined
  }
};

var store;

module.exports.Init = function (_store) {
  store = _store;
  var DCS_ALL_Path = store.get('DCS_ALL_Path');
  if (DCS_ALL_Path == undefined) {
    store.set('DCS_ALL_Path', g_DCS_ALL_Path);
  } else {
    g_DCS_ALL_Path = DCS_ALL_Path;
  }

  var P3D_ALL_Path = store.get('P3D_ALL_Path');
  if (P3D_ALL_Path == undefined) {
    store.set('P3D_ALL_Path', g_P3D_ALL_Path);
  } else {
    g_P3D_ALL_Path = P3D_ALL_Path;
  }

  var XPANE_ALL_Path = store.get('XPANE_ALL_Path');
  if (XPANE_ALL_Path == undefined) {
    store.set('XPANE_ALL_Path', g_XPANE_ALL_Path);
  } else {
    // 因为已有的配置文件，只有XPANE11,没有XPANE12信息，所有这里需要追加
    for (const key in g_XPANE_ALL_Path) {
      if (!XPANE_ALL_Path[key]) {
        XPANE_ALL_Path[key] = {}
      }
    }
    g_XPANE_ALL_Path = XPANE_ALL_Path;
    store.set('XPANE_ALL_Path', g_XPANE_ALL_Path);
  }

  var BMS_ALL_Path = store.get('BMS_ALL_Path');
  if (BMS_ALL_Path == undefined) {
    store.set('BMS_ALL_Path', g_BMS_ALL_Path);
  } else {
    g_BMS_ALL_Path = BMS_ALL_Path;
  }

  // 默认开机自动启动打开
  const EXEStartUp = store.get('EXEStartUp');
  if (EXEStartUp === undefined) {
    SetEXEStartUp();
    store.set('EXEStartUp', true);
  }
}

const g_HomePath = app.getPath('home');

var GetRegeditSavedGamesPath = function () {
  return new Promise(function (resolve, reject) {
    regedit.arch.list64('HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders', function (err, result) {
      if (result != undefined) {
        for (var a in result) {
          if (!_.isEmpty(result[a]) && result[a].values != undefined && result[a].values['{4C5C32FF-BB9D-43B0-B5B4-2D72E54EAAA4}'] != undefined && result[a].values['{4C5C32FF-BB9D-43B0-B5B4-2D72E54EAAA4}'].value != undefined) {
            resolve(result[a].values['{4C5C32FF-BB9D-43B0-B5B4-2D72E54EAAA4}'].value);
            return;
          }
        }
      }
      resolve(g_HomePath + '/Saved Games/');
    })
  });
}
module.exports.GetMainPath = () => {
  return path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '/../');
}
module.exports.GetMainAsarPath = () => {
  return path.join(__dirname, '/../');
}

ipcMain.on('WWTHID_MainAsarPath', (event, arg) => {
  event.returnValue = this.GetMainAsarPath();
});
function LoadWinwingExport (_Path) {
  try {
    var _WinwingPath = path.join(_Path, 'Scripts/wwt');
    fs.mkdirSync(_WinwingPath, {
      recursive: true
    });
    fs.copyFile(__dirname.replace('app.asar', 'app.asar.unpacked') + '/../Events/wwt/wwtExport.lua', _WinwingPath + '/wwtExport.lua', (err) => { });
    fs.copyFile(__dirname.replace('app.asar', 'app.asar.unpacked') + '/../Events/wwt/wwtNetwork.lua', _WinwingPath + '/wwtNetwork.lua', (err) => { });

    const TurnoffExport = store.get('TurnoffExport');
    if (TurnoffExport !== true) {
      var _FilePath = path.join(_Path, 'Scripts/Export.lua');
      const _PushData = "local wwtlfs=require('lfs')\r\ndofile(wwtlfs.writedir()..'Scripts/wwt/wwtExport.lua')";
      const _PushData_non = "local wwtlfs=require('lfs')\ndofile(wwtlfs.writedir()..'Scripts/wwt/wwtExport.lua')";
      if (fs.existsSync(_FilePath)) {
        var _FileData = fs.readFileSync(_FilePath, 'utf8');
        // 删除以前的内容
        if (_FileData.search(/WinwingExport.lua/) != -1) {
          _FileData = _FileData.replace("local wwtlfs=require('lfs')\ndofile(wwtlfs.writedir()..'Scripts/Winwing/WinwingExport.lua')", '');
          _FileData = _FileData.replace("local wwtlfs=require('lfs')\r\ndofile(wwtlfs.writedir()..'Scripts/Winwing/WinwingExport.lua')", '');
          fs.writeFileSync(_FilePath, _FileData, 'utf8');
        }
        // 添加新的lua
        if (_FileData.search(/wwtExport.lua/) == -1) {
          _FileData = '\r\n' + _PushData + '\r\n' + _FileData;
          fs.writeFileSync(_FilePath, _FileData, 'utf8');
        } else {
          _FileData = _FileData.replace(_PushData + '\r\n', '');
          _FileData = _FileData.replace(_PushData_non, '');
          _FileData = _PushData + '\r\n' + _FileData;
          fs.writeFileSync(_FilePath, _FileData, 'utf8');
        }
      } else {
        fs.writeFileSync(_FilePath, _PushData, 'utf8');
      }
    }
  } catch (error) { }
}

function LoadDCSExePathConfig (_Path) {
  try {
    if (!fs.existsSync(path.join(_Path, 'bin\\DCS.exe'))) {
      return false;
    }

    var defaultPath = path.join(_Path, 'Mods\\aircraft\\FA-18C\\Input\\FA-18C\\joystick\\default.lua');
    if (fs.existsSync(defaultPath)) {
      var FileData = fs.readFileSync(defaultPath, 'utf8');
      var fieldPos = FileData.search("'HOOK BYPASS Switch - FIELD'");
      if (fieldPos == -1) {
        var pos = FileData.search("'HOOK BYPASS Switch - FIELD/CARRIER'");
        if (pos != -1) {
          const instr = "\r\n{	down = cptlights_commands.HookBypass,                                               cockpit_device_id = devices.CPT_LIGHTS,         value_down =  0.5,                  name = _('HOOK BYPASS Switch - FIELD'),	                                    category = {_('Left Vertical Panel')}},"

          pos = FileData.indexOf(',', pos);
          pos = FileData.indexOf(',', pos + 1) + 1; // 第二个,的位置
          var startstr = FileData.substring(0, pos);
          var startend = FileData.substring(pos);
          FileData = startstr + instr + startend;
          fs.writeFileSync(defaultPath, FileData, 'utf8');
        }
      } else {
        const startpos1 = FileData.lastIndexOf('cockpit_device_id', fieldPos);
        const str = FileData.substring(startpos1, fieldPos);
        var startpos = str.indexOf('devices.CPT_LIGTHS');
        if (startpos != -1) {
          startpos += startpos1;
          const endpos = FileData.indexOf(',', startpos);
          const startstr = FileData.substring(0, startpos);
          const startend = FileData.substring(endpos);
          FileData = startstr + 'devices.CPT_LIGHTS' + startend;
          fs.writeFileSync(defaultPath, FileData, 'utf8');
        }
      }
      fieldPos = FileData.search("'HOOK BYPASS Switch - CARRIER'");
      if (fieldPos == -1) {
        var pos = FileData.search("'HOOK BYPASS Switch - FIELD/CARRIER'");
        if (pos != -1) {
          const instr = "\r\n{	down = cptlights_commands.HookBypass,                                               cockpit_device_id = devices.CPT_LIGHTS,         value_down =  -0.5,                 name = _('HOOK BYPASS Switch - CARRIER'),                                   category = {_('Left Vertical Panel')}},"

          pos = FileData.indexOf(',', pos);
          pos = FileData.indexOf(',', pos + 1) + 1; // 第二个,的位置
          var startstr = FileData.substring(0, pos);
          var startend = FileData.substring(pos);
          FileData = startstr + instr + startend;
          fs.writeFileSync(defaultPath, FileData, 'utf8');
        }
      } else {
        const startpos1 = FileData.lastIndexOf('cockpit_device_id', fieldPos);
        const str = FileData.substring(startpos1, fieldPos);
        var startpos = str.indexOf('devices.CPT_LIGTHS');
        if (startpos != -1) {
          startpos += startpos1;
          const endpos = FileData.indexOf(',', startpos);
          const startstr = FileData.substring(0, startpos);
          const startend = FileData.substring(endpos);
          FileData = startstr + 'devices.CPT_LIGHTS' + startend;
          fs.writeFileSync(defaultPath, FileData, 'utf8');
        }
      }
      fieldPos = FileData.search("'Launch Bar Control Switch - EXTEND'");
      if (fieldPos == -1) {
        var pos = FileData.search("'Launch Bar Control Switch - EXTEND/RETRACT'");
        if (pos != -1) {
          const instr = "\r\n{   down = gear_commands.LaunchBarSw,                                                   cockpit_device_id = devices.GEAR_INTERFACE,     value_down =  0.5,                  name = _('Launch Bar Control Switch - EXTEND'),                             category = {_('Left Vertical Panel')}},"

          pos = FileData.indexOf(',', pos);
          pos = FileData.indexOf(',', pos + 1) + 1; // 第二个,的位置
          var startstr = FileData.substring(0, pos);
          var startend = FileData.substring(pos);
          FileData = startstr + instr + startend;
          fs.writeFileSync(defaultPath, FileData, 'utf8');
        }
      }
      fieldPos = FileData.search("'Launch Bar Control Switch - RETRACT'");
      if (fieldPos == -1) {
        var pos = FileData.search("'Launch Bar Control Switch - EXTEND'");
        if (pos != -1) {
          const instr = "\r\n{   down = gear_commands.LaunchBarSw,                                                   cockpit_device_id = devices.GEAR_INTERFACE,     value_down =  -0.5,                 name = _('Launch Bar Control Switch - RETRACT'),                            category = {_('Left Vertical Panel')}},"

          pos = FileData.indexOf(',', pos);
          pos = FileData.indexOf(',', pos + 1) + 1; // 第二个,的位置
          var startstr = FileData.substring(0, pos);
          var startend = FileData.substring(pos);
          FileData = startstr + instr + startend;
          fs.writeFileSync(defaultPath, FileData, 'utf8');
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  return true;
}

// 在数组a中是否存在_Path
/* if (_.indexOf(a, _Path) == -1) {
    a.push(_Path);
} */

var GetPathInitOkFunc = [];

async function GetPath () {
  var g_SavedGames = await GetRegeditSavedGamesPath();

  function SaveDCSEXEPath (version, _Path) {
    g_DCS_ALL_Path[version].EXEPath = _Path;
    g_DCS_ALL_Path[version].isExistExE = LoadDCSExePathConfig(_Path);
  }

  function GetSavedGamesPath (_Path) {
    var _FilePath = path.join(_Path, 'dcs_variant.txt');
    if (fs.existsSync(_FilePath)) {
      var _Data = fs.readFileSync(_FilePath, 'utf8');
      _Data = _Data.replace(/[^a-zA-Z\d]/g, '');
      var _DCS_SG = path.join(g_SavedGames, 'DCS' + (_Data != '' ? '.' + _Data : ''));
      return _DCS_SG;
    } else {
      return path.join(g_SavedGames, 'DCS');
    }
  }

  function SetSaveDCSSavePath (version, _SavedGamesPath) {
    g_DCS_ALL_Path[version].SavePath = _SavedGamesPath;
    LoadWinwingExport(_SavedGamesPath);
  }

  function SaveDCSSavePath (version, _Path) {
    var _SavedGamesPath = GetSavedGamesPath(_Path)
    SetSaveDCSSavePath(version, _SavedGamesPath);
  }

  if (g_DCS_ALL_Path.steamDCS.EXEPath === undefined) {
    regedit.arch.list64('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App 223750', function (err, result) {
      if (result != undefined) {
        for (var a in result) {
          if (!_.isEmpty(result[a]) && result[a].values != undefined && result[a].values.InstallLocation != undefined && result[a].values.InstallLocation.value != undefined) {
            var _Path = result[a].values.InstallLocation.value;

            SaveDCSEXEPath('steamDCS', _Path);
            SaveDCSSavePath('steamDCS', _Path);
            store.set('DCS_ALL_Path', g_DCS_ALL_Path);
            break;
          }
        }
      }
    })
  } else {
    g_DCS_ALL_Path.steamDCS.isExistExE = LoadDCSExePathConfig(g_DCS_ALL_Path.steamDCS.EXEPath);
  }
  if (g_DCS_ALL_Path.steamDCS.SavePath !== undefined) {
    LoadWinwingExport(g_DCS_ALL_Path.steamDCS.SavePath);
  }

  if (g_DCS_ALL_Path.ED_DCS.EXEPath === undefined) {
    regedit.arch.list64('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\DCS World_is1', function (err, result) {
      if (result != undefined) {
        for (var a in result) {
          if (!_.isEmpty(result[a]) && result[a].values != undefined && result[a].values.InstallLocation != undefined && result[a].values.InstallLocation.value != undefined) {
            var _Path = result[a].values.InstallLocation.value;

            SaveDCSEXEPath('ED_DCS', _Path);
            SaveDCSSavePath('ED_DCS', _Path);
            store.set('DCS_ALL_Path', g_DCS_ALL_Path);
            break;
          }
        }
      }
    })
  } else {
    g_DCS_ALL_Path.ED_DCS.isExistExE = LoadDCSExePathConfig(g_DCS_ALL_Path.ED_DCS.EXEPath);
  }
  if (g_DCS_ALL_Path.ED_DCS.SavePath !== undefined) {
    LoadWinwingExport(g_DCS_ALL_Path.ED_DCS.SavePath);
  }

  if (g_DCS_ALL_Path.ED_DCSOpenbeta.EXEPath === undefined) {
    regedit.arch.list64('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\DCS World OpenBeta_is1', function (err, result) {
      if (result != undefined) {
        for (var a in result) {
          if (!_.isEmpty(result[a]) && result[a].values != undefined && result[a].values.InstallLocation != undefined && result[a].values.InstallLocation.value != undefined) {
            var _Path = result[a].values.InstallLocation.value;

            SaveDCSEXEPath('ED_DCSOpenbeta', _Path);
            SaveDCSSavePath('ED_DCSOpenbeta', _Path);
            store.set('DCS_ALL_Path', g_DCS_ALL_Path);
            break;
          }
        }
      }
    })
  } else {
    g_DCS_ALL_Path.ED_DCSOpenbeta.isExistExE = LoadDCSExePathConfig(g_DCS_ALL_Path.ED_DCSOpenbeta.EXEPath);
  }
  if (g_DCS_ALL_Path.ED_DCSOpenbeta.SavePath !== undefined) {
    LoadWinwingExport(g_DCS_ALL_Path.ED_DCSOpenbeta.SavePath);
  }

  ipcMain.on('WWTHID_SetDCSEXEPath', function (event, arg) {
    SaveDCSEXEPath(arg.version, arg.Path);
    SaveDCSSavePath(arg.version, arg.Path);
    store.set('DCS_ALL_Path', g_DCS_ALL_Path);
    event.returnValue = g_DCS_ALL_Path;
  });

  ipcMain.on('WWTHID_SetDCSSavePath', function (event, arg) {
    SetSaveDCSSavePath(arg.version, arg.Path);
    store.set('DCS_ALL_Path', g_DCS_ALL_Path);
    event.returnValue = g_DCS_ALL_Path;
  });

  ipcMain.on('WWTHID_GetDCS_ALL_Path', function (event, arg) {
    event.returnValue = g_DCS_ALL_Path;
  });

  // P3D路径设置--------------------------------------------------------
  function SaveP3DSavePath (key, data) {
    g_P3D_ALL_Path[key].SavePath = data;
    store.set('P3D_ALL_Path', g_P3D_ALL_Path);
  }

  function SaveP3DEXEPath (key, data) {
    g_P3D_ALL_Path[key].EXEPath = data;
    store.set('P3D_ALL_Path', g_P3D_ALL_Path);
  }

  ipcMain.on('WWTHID_GetP3D_ALL_Path', function (event, arg) {
    event.returnValue = g_P3D_ALL_Path;
  });

  ipcMain.on('WWTHID_SetP3D_Save_Path', function (event, arg) {
    SaveP3DSavePath(arg.name, arg.value);
    event.returnValue = g_P3D_ALL_Path;
  });

  ipcMain.on('WWTHID_SetP3D_EXE_Path', function (event, arg) {
    SaveP3DEXEPath(arg.name, arg.value);
    event.returnValue = g_P3D_ALL_Path;
  });

  const appDataPath = app.getPath('appData');
  if (g_P3D_ALL_Path.P3DV3.SavePath === undefined) {
    if (fs.existsSync(appDataPath + '\\Lockheed Martin\\Prepar3D v3')) {
      g_P3D_ALL_Path.P3DV3.SavePath = appDataPath + '\\Lockheed Martin\\Prepar3D v3';
      SaveP3DSavePath('P3DV3', g_P3D_ALL_Path.P3DV3.SavePath);
    }
  }

  if (g_P3D_ALL_Path.P3DV4.SavePath === undefined) {
    if (fs.existsSync(appDataPath + '\\Lockheed Martin\\Prepar3D v4')) {
      g_P3D_ALL_Path.P3DV4.SavePath = appDataPath + '\\Lockheed Martin\\Prepar3D v4';
      SaveP3DSavePath('P3DV4', g_P3D_ALL_Path.P3DV4.SavePath);
    }
  }

  // XPLAN路径-------------------------------------------------------------------------
  function SaveXPANESavePath (key, data) {
    g_XPANE_ALL_Path[key].SavePath = data;
    store.set('XPANE_ALL_Path', g_XPANE_ALL_Path);
  }

  function SaveXPANEEXEPath (key, data) {
    g_XPANE_ALL_Path[key].EXEPath = data;
    store.set('XPANE_ALL_Path', g_XPANE_ALL_Path);
  }

  ipcMain.on('WWTHID_GetXPANE_ALL_Path', function (event, arg) {
    event.returnValue = g_XPANE_ALL_Path;
  });

  ipcMain.on('WWTHID_SetXPANE_Save_Path', function (event, arg) {
    SaveXPANESavePath(arg.name, arg.value);
    event.returnValue = g_XPANE_ALL_Path;
  });

  ipcMain.on('WWTHID_SetXPANE_EXE_Path', function (event, arg) {
    SaveXPANEEXEPath(arg.name, arg.value);
    event.returnValue = g_XPANE_ALL_Path;
  });

  if (g_XPANE_ALL_Path.XPANE11.EXEPath === undefined) {
    regedit.arch.list64('HKCU\\System\\GameConfigStore\\Children\\6e8a388f-23a6-4de3-9869-1b4d188fc6b3', function (err, result) {
      if (result !== undefined) {
        for (var a in result) {
          if (
            result[a].values !== undefined &&
            result[a].values.MatchedExeFullPath !== undefined &&
            result[a].values.MatchedExeFullPath.value !== undefined) {
            var p = result[a].values.MatchedExeFullPath.value;
            p = p.replace('\\X-Plane.exe', '');
            SaveXPANEEXEPath('XPANE11', p);
          }
        }
      }
    })
  }
  if (g_XPANE_ALL_Path.XPANE12.EXEPath === undefined) {
    regedit.arch.list64('HKCU\\System\\GameConfigStore\\Children\\6e8a388f-23a6-4de3-9869-1b4d188fc6b3', function (err, result) {
      if (result !== undefined) {
        for (var a in result) {
          if (
            result[a].values !== undefined &&
            result[a].values.MatchedExeFullPath !== undefined &&
            result[a].values.MatchedExeFullPath.value !== undefined) {
            var p = result[a].values.MatchedExeFullPath.value;
            p = p.replace('\\X-Plane.exe', '');
            SaveXPANEEXEPath('XPANE12', p);
          }
        }
      }
    })
  }

  // BMS路径-------------------------------------------------------------------------
  function SaveBMSEXEPath (key, data) {
    g_BMS_ALL_Path[key].EXEPath = data;
    store.set('BMS_ALL_Path', g_BMS_ALL_Path);
  }

  ipcMain.on('WWTHID_GetBMS_ALL_Path', function (event, arg) {
    event.returnValue = g_BMS_ALL_Path;
  });

  ipcMain.on('WWTHID_SetBMS_EXE_Path', function (event, arg) {
    SaveBMSEXEPath(arg.name, arg.value);
    event.returnValue = g_BMS_ALL_Path;
  });

  if (g_BMS_ALL_Path.Falcon_BMS.EXEPath === undefined) {
    regedit.arch.list64('HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Falcon BMS', function (err, result) {
      if (result) {
        for (const a in result) {
          const tempDict = result[a].values
          if (!_.isEmpty(tempDict)) {
            var exepath = tempDict.UninstallString
            exepath = exepath.replace('\\Uninstall.exe', '');
            SaveBMSEXEPath('Falcon_BMS', exepath)
          }
        }
      }
    })
  }
}

GetPath();

var Windows10Version = '1603'

regedit.arch.list64('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', function (err, result) {
  try {
    if (result != undefined) {
      for (var a in result) {
        if (!_.isEmpty(result[a]) && result[a].values != undefined && result[a].values.ReleaseId != undefined && result[a].values.ReleaseId.value != undefined) {
          var version = result[a].values.ReleaseId.value;
          Windows10Version = version;
          break;
        }
      }
    }
  } catch (error) { }
})

ipcMain.on('WWTHID_GetWin10Version', function (event, arg) {
  event.returnValue = Windows10Version;
});

function GetDCSSavePath () {
  var DCS_Save_Path = [];
  for (var a in g_DCS_ALL_Path) {
    if (g_DCS_ALL_Path[a].SavePath !== undefined) { DCS_Save_Path.push(g_DCS_ALL_Path[a].SavePath); }
  }

  return DCS_Save_Path;
}

ipcMain.on('WWTHID_ResetDefaultEvents', function (event, arg) {
  var DCS_Save_Path = GetDCSSavePath();
  if (DCS_Save_Path.length > 0) {
    for (var a of DCS_Save_Path) {
      for (var b in arg.Data) {
        if (arg.Data[b].File != '') {
          var _SavePath = a + '/Config/Input/' + arg.AircraftName + '/joystick';
          fs.mkdirSync(_SavePath, {
            recursive: true
          });
          fs.copyFile(arg.Data[b].File, _SavePath + '/' + arg.Data[b].Name + ' {' + b + '}.diff.lua', (err) => { });
        }
      }
    }

    event.returnValue = {
      Error: true
    };
  } else {
    event.returnValue = {
      Error: false,
      ErrorMessage: 1
    };
  }
});

var StartUpSimAppProPath = '"' + app.getPath('exe') + '" Hide=true';

function getHK () {
  // const appPath = app.getAppPath();
  // if (appPath.indexOf('Program Files (x86)') != -1) {
  return 'HKLM';
  // } else {
  // return 'HKCU';
  // }
}

ipcMain.on('WWTHID_GetStartUp', function (event, arg) {
  regedit.list(`${getHK()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`,
    function (err, result) {
      log.info(`GetStartUp:${err}`);
      if (result != undefined) {
        for (var b in result) {
          if (
            result[b].values != undefined && result[b].values.SimAppPro != undefined && result[b].values.SimAppPro.value != ''
          /* result[b].values.SimAppPro.value == StartUpSimAppProPath */) {
            event.returnValue = true;
            return;
          }
        }
      }

      event.returnValue = false;
    })
})

async function SetEXEStartUp () {
  regedit.putValue({
    [`${getHK()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`]: {
      SimAppPro: {
        value: StartUpSimAppProPath,
        type: 'REG_SZ'
      }
    }
  }, function (err) {
    console.log(err);
  })
}

ipcMain.on('WWTHID_EXEStartUp', function (event, arg) {
  SetEXEStartUp();
})

ipcMain.on('WWTHID_EXENoStartUp', function (event, arg) {
  regedit.arch.putValue({
    'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run': {
      SimAppPro: {
        value: '',
        type: 'REG_SZ'
      }
    }
  }, function (err) {
    console.log(err);
  })
  regedit.putValue({
    'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run': {
      SimAppPro: {
        value: '',
        type: 'REG_SZ'
      }
    }
  }, function (err) {
    console.log(err);
  })
})
// 设备-修改设备名称
ipcMain.on('WWTHID_ChangeDeviceName', function (event, arg) {
  if (arg.vid && arg.pid) {
    const pathArr = [
      'HKCU\\System\\CurrentControlSet\\Control\\MediaProperties\\PrivateProperties\\Joystick\\OEM\\',
      'HKCU\\System\\CurrentControlSet\\Control\\MediaResources\\Joystick\\DINPUT.DLL\\JoystickSettings\\',
      'HKLM\\SYSTEM\\CurrentControlSet\\Control\\MediaProperties\\PrivateProperties\\Joystick\\OEM\\'
    ]
    for (let i = 0; i < pathArr.length; i++) {
      const tempPath = pathArr[i] + 'VID_' + arg.vid.toUpperCase() + '&PID_' + arg.pid.toUpperCase();
      const regKey = {};
      regKey[tempPath] = {
        OEMName: {
          value: arg.value,
          type: 'REG_SZ'
        }
      };
      // 获取指定路径下的所有键
      regedit.arch.list(tempPath, function (err, result) {
        if (err) {
          log.error('list.err=', err)
        } else {
          const values = result[tempPath].values;
          for (const key in values) {
            if (key === 'OEMName') {
              regedit.arch.putValue(regKey, function (err) {
                log.error('putValue.err=', err)
              })
              regedit.arch.putValue64(regKey, function (err) {
                log.error('putValue64.err=', err)
              })
              break
            }
          }
        }
      });
    }
  }
})

ipcMain.on('WWTHID_UninstallvJoy', function (event, arg) {
  regedit.arch.list64('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{8E31F76F-74C3-47F1-9550-E041EEDC5FBB}_is1', function (err, result) {
    if (result != undefined) {
      for (var a in result) {
        if (!_.isEmpty(result[a]) && result[a].values != undefined && result[a].values.UninstallString != undefined && result[a].values.UninstallString.value != undefined) {
          var _uninstallPath = result[a].values.UninstallString.value;
          event.returnValue = exec(_uninstallPath, function (err, data) {
            console.log(err)
            console.log(data.toString());
          });
          return;
        }
      }
    }
  })
});

ipcMain.on('WWTHID_GetDCSSavePath', function (event, arg) {
  event.returnValue = GetDCSSavePath();
})

ipcMain.on('WWTHID_GetDCSEXEPath', function (event, arg) {
  var DCS_EXE_Path = [];
  for (var a in g_DCS_ALL_Path) {
    if (g_DCS_ALL_Path[a].EXEPath !== undefined) { DCS_EXE_Path.push(g_DCS_ALL_Path[a].EXEPath); }
  }
  event.returnValue = DCS_EXE_Path;
})

function GetDCSActiveVersion () {
  var DCSActiveVersion = store.get('DCSActiveVersion');
  if (DCSActiveVersion === undefined) {
    DCSActiveVersion = 'steamDCS';
    for (var a in g_DCS_ALL_Path) {
      if (g_DCS_ALL_Path[a].EXEPath !== undefined) {
        DCSActiveVersion = a;
      }
    }
  }
  return DCSActiveVersion;
}

ipcMain.on('WWTHID_GetDCSActiveVersion', function (event, arg) {
  event.returnValue = GetDCSActiveVersion();
})

ipcMain.on('WWTHID_GetActiveDCSSavePath', function (event, arg) {
  event.returnValue = g_DCS_ALL_Path[GetDCSActiveVersion()].SavePath;
})

module.exports.GetActiveDCSSavePath = function () {
  return g_DCS_ALL_Path && g_DCS_ALL_Path[GetDCSActiveVersion()].SavePath;
}

ipcMain.on('WWTHID_GetActiveDCSEXEPath', function (event, arg) {
  event.returnValue = g_DCS_ALL_Path[GetDCSActiveVersion()].EXEPath;
})

module.exports.GetActiveDCSisExistExE = function () {
  return g_DCS_ALL_Path && g_DCS_ALL_Path[GetDCSActiveVersion()].isExistExE;
}

ipcMain.on('WWTHID_GetActiveDCSisExistExE', function (event, arg) {
  event.returnValue = g_DCS_ALL_Path[GetDCSActiveVersion()].isExistExE;
})

module.exports.GetActiveDCSEXEPath = function () {
  return g_DCS_ALL_Path && g_DCS_ALL_Path[GetDCSActiveVersion()].EXEPath;
}

/* -----------------P3D----------------------------- */
function GetP3DActiveVersion () {
  var P3DActiveVersion = store.get('P3DActiveVersion');
  if (P3DActiveVersion === undefined) {
    P3DActiveVersion = 'P3DV4';
    for (var a in g_P3D_ALL_Path) {
      if (g_P3D_ALL_Path[a].SavePath !== undefined) {
        P3DActiveVersion = a;
      }
    }
  }
  return P3DActiveVersion;
}

ipcMain.on('WWTHID_GetP3DActiveVersion', function (event, arg) {
  event.returnValue = GetP3DActiveVersion();
})

ipcMain.on('WWTHID_GetActiveP3DSavePath', function (event, arg) {
  event.returnValue = g_P3D_ALL_Path[GetP3DActiveVersion()].SavePath;
})

ipcMain.on('WWTHID_GetActiveP3DEXEPath', function (event, arg) {
  event.returnValue = g_P3D_ALL_Path[GetP3DActiveVersion()].EXEPath;
})

/* -----------------Xplane----------------------------- */
function GetXPLANEActiveVersion (version) {
  if (version) {
    return version
  }
  var XPLANEActiveVersion = store.get('XPLANEActiveVersion');
  if (XPLANEActiveVersion === undefined) {
    XPLANEActiveVersion = 'XPANE11';
    for (var a in g_XPANE_ALL_Path) {
      if (g_XPANE_ALL_Path[a].EXEPath !== undefined) {
        XPLANEActiveVersion = a;
      }
    }
  }
  return XPLANEActiveVersion;
}

ipcMain.on('WWTHID_GetXPLANEActiveVersion', function (event, arg) {
  event.returnValue = GetXPLANEActiveVersion();
})

ipcMain.on('WWTHID_GetActiveXPLANESavePath', function (event, arg) {
  event.returnValue = g_XPANE_ALL_Path[GetXPLANEActiveVersion()].SavePath;
})

ipcMain.on('WWTHID_GetActiveXPLANEEXEPath', function (event, arg) {
  event.returnValue = g_XPANE_ALL_Path[GetXPLANEActiveVersion(arg)].EXEPath;
})

module.exports.GetActiveXPLANEEXEPath = function (arg) {
  return g_XPANE_ALL_Path && g_XPANE_ALL_Path[GetXPLANEActiveVersion(arg)].EXEPath;
}

/* -----------------BMS----------------------------- */
function GetBMSActiveVersion () {
  var BMSActiveVersion = store.get('BMSActiveVersion');
  if (BMSActiveVersion === undefined) {
    BMSActiveVersion = 'Falcon_BMS';
    for (var a in g_BMS_ALL_Path) {
      if (g_BMS_ALL_Path[a].EXEPath !== undefined) {
        BMSActiveVersion = a;
      }
    }
  }
  return BMSActiveVersion;
}

ipcMain.on('WWTHID_GetBMSActiveVersion', function (event, arg) {
  event.returnValue = GetBMSActiveVersion();
})

ipcMain.on('WWTHID_GetActiveBMSEXEPath', function (event, arg) {
  event.returnValue = g_XPANE_ALL_Path[GetBMSActiveVersion()].EXEPath;
})

module.exports.GetActiveBMSEXEPath = function () {
  return g_BMS_ALL_Path && g_BMS_ALL_Path[GetBMSActiveVersion()].EXEPath;
}
