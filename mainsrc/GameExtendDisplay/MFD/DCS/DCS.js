const path = require('path');
const fs = require('fs');
const _ = require('lodash');

/** ********以下是每个子文件都必须要实现的配置和方法***************** **/
const DCS = {
  gameKey: 'DCS', // 1.获取config/GameExtendDisplay/MFD路径下本地配置信息和extra扩展信息; 2.game_config_set获取存储文件DCS_config.json信息;3.MFD遍历任务需要用到的key
  extraConfig: {}, // 游戏强制配置文件，游戏图标从这里面读取
  gameConfig: {}, // 游戏总配置信息DCS.js + DCS_extra.js + DCS_config.json 三个文件总配置信息
  checkObject: {}, // 检查单
  gameRunningStatusChange: false
};
// 检查文件是否存在
DCS.isFileExist = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
};
const checkDefault = {
  parent: '',
  show: true,
  status: '', // process,warning,error,success
  description: '',
  tag: ''
};
// 初始化检查单数据
DCS.checkObjectDefault = {
  gameId: 'DCS',
  dcsPath: {
    ...checkDefault
  },
  dcsInstallPath: {
    ...checkDefault,
    parent: 'dcsPath'
  },
  dcsUserPath: {
    ...checkDefault,
    parent: 'dcsPath'
  },
  gameOptions: {
    ...checkDefault,
    parent: 'dcsPath'
  },
  gameAppSettings: {
    ...checkDefault,
    parent: 'dcsPath',
    show: false
  },
  gameMonitor: {
    ...checkDefault,
    parent: 'dcsPath',
    show: false
  },
  // 设置DCS摄像机模式
  dcsCameraMode: {
    ...checkDefault
  },
  dcsCameraModeChange: {
    ...checkDefault,
    parent: 'dcsCameraMode',
    show: false
  },
  // 游戏画面显示器
  mainMonitor: {
    ...checkDefault
  },
  mainMonitorOnline: {
    ...checkDefault,
    parent: 'mainMonitor',
    show: false,
    monitorIdArray: []
  },
  mainMonitorAtLeastOne: {
    ...checkDefault,
    parent: 'mainMonitor',
    show: false
  },
  // 显示器排布和方向
  monitorLayout: {
    ...checkDefault
  },
  monitorLayoutChange: {
    ...checkDefault,
    parent: 'monitorLayout',
    show: false
  },
  // 设置MFD显示器
  mfdSetting: {
    ...checkDefault
  },
  mfdOnline: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: false,
    instrumentArray: []
  },
  mfdDirection: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: false,
    instrumentArray: []
  },
  mfdPositionAndSize: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: false,
    instrumentArray: []
  },
  optionsConfig: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: true
  },
  appSettingsConfig: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: true
  },
  wwtMonitorConfig: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: true
  },
  // 游戏运行时显示器状态
  monitorStatusWhenGameRunning: {
    ...checkDefault
  }
};
// 获取DCS配置文件路径信息，返回true或者false（true代表所有配置文件均存在）
DCS.getChildFilePath = (getPath) => {
  let getAllPath = true;
  DCS.getPath = getPath;
  DCS.gameExePath = getPath.GetActiveDCSEXEPath();
  if (!DCS.gameExePath) {
    getAllPath = false;
  }
  if (!getPath.GetActiveDCSisExistExE()) {
    DCS.gameExePath = undefined
    getAllPath = false;
  }
  DCS.dcsSavePath = getPath.GetActiveDCSSavePath();
  if (!DCS.dcsSavePath) {
    getAllPath = false;
  }
  if (DCS.gameExePath) {
    DCS.monitorPath = path.join(DCS.gameExePath, '\\Config\\MonitorSetup\\wwtMonitor.lua');
  }
  if (DCS.dcsSavePath) {
    DCS.optionsPath = path.join(DCS.dcsSavePath, '\\Config\\options.lua');
    if (!DCS.isFileExist(DCS.optionsPath)) {
      getAllPath = false;
    }
    DCS.settingsPath = path.join(DCS.dcsSavePath, '\\Config\\appSettings.lua');
  }
  return getAllPath
};
// 校验配置文件地址
DCS.checkoutPath = (checkObject) => {
  // A1:校验DCS安装路径
  DCS.gameExePath = DCS.getPath.GetActiveDCSEXEPath();
  const isExistExe = DCS.getPath.GetActiveDCSisExistExE();
  if (DCS.gameExePath && isExistExe) {
    checkObject.dcsPath.status = 'success'
    checkObject.dcsInstallPath.status = 'success'
  } else {
    checkObject.dcsPath.status = 'error'
    checkObject.dcsInstallPath.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // A2:校验DCS用户保存路径
  DCS.dcsSavePath = DCS.getPath.GetActiveDCSSavePath();
  if (DCS.dcsSavePath) {
    checkObject.dcsPath.status = 'success'
    checkObject.dcsUserPath.status = 'success'
  } else {
    checkObject.dcsPath.status = 'error'
    checkObject.dcsUserPath.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // A5:校验options.lua是否存在
  if (DCS.dcsSavePath) {
    DCS.optionsPath = path.join(DCS.dcsSavePath, '\\Config\\options.lua');
    if (DCS.isFileExist(DCS.optionsPath)) {
      checkObject.dcsPath.status = 'success'
      checkObject.gameOptions.status = 'success'
    } else {
      checkObject.dcsPath.status = 'error'
      checkObject.gameOptions.status = 'error'
      return { checkObject: checkObject, result: false };
    }
  }
  // A6:校验appSettings.lua是否存在
  if (DCS.dcsSavePath) {
    DCS.settingsPath = path.join(DCS.dcsSavePath, '\\Config\\appSettings.lua');
    if (DCS.isFileExist(DCS.settingsPath)) {
      checkObject.dcsPath.status = 'success'
      checkObject.gameAppSettings.status = 'success'
    } else {
      checkObject.gameAppSettings.status = 'error'
    }
  }
  // A4:校验wwtMonitor.lua是否存在
  if (DCS.gameExePath) {
    DCS.monitorPath = path.join(DCS.gameExePath, '\\Config\\MonitorSetup\\wwtMonitor.lua');
    if (DCS.isFileExist(DCS.monitorPath)) {
      checkObject.dcsPath.status = 'success'
      checkObject.gameMonitor.status = 'success'
    } else {
      checkObject.gameMonitor.status = 'error'
    }
  }
  return { checkObject: checkObject, result: true };
};
// 检查当前子模块独有的应用配置信息(校验摄像机模式)
DCS.checkOwnerConfigInfo = (checkObject) => {
  // A1:校验是否点击过应用
  if (DCS.gameConfig.dcsCameraModeApplyStatus > 0) {
    checkObject.dcsCameraMode.status = 'success'
  } else {
    checkObject.dcsCameraMode.status = 'process'
    return { checkObject: checkObject, result: false };
  }
  // A2:校验是否变更过模式
  if (DCS.gameConfig.dcsCameraMode === DCS.gameConfig.dcsCameraModeApply) {
    checkObject.dcsCameraMode.status = 'success'
    checkObject.dcsCameraModeChange.status = 'success'
  } else {
    checkObject.dcsCameraMode.status = 'error'
    checkObject.dcsCameraModeChange.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
// 检查游戏配置是否变更
DCS.checkoutGameInfoChange = (checkObject, templatePath) => {
  // A1:校验options.lua
  const optionsConfig = DCS.gameConfig.gameOptions;
  if (!DCS.isFileExist(DCS.optionsPath)) {
    checkObject.mfdSetting.status = 'error'
    checkObject.optionsConfig.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  const optionsContent = fs.readFileSync(DCS.optionsPath, 'utf-8');
  let isOptionsChange = false;
  for (const key in optionsConfig.graphics) {
    const targetVal = optionsConfig.graphics[key];
    const currentVal = DCS.getOptionVal(optionsContent, key);
    // A2:校验options.lua中各个属性是否变更
    if (targetVal != currentVal) {
      if (typeof (targetVal) == 'number') {
        if (targetVal.toFixed(6) != Number(currentVal).toFixed(6)) {
          isOptionsChange = true;
        }
      } else {
        isOptionsChange = true;
      }
    }
  }
  if (!isOptionsChange) {
    checkObject.mfdSetting.status = 'success'
    checkObject.optionsConfig.status = 'success'
  } else {
    checkObject.mfdSetting.status = 'error'
    checkObject.optionsConfig.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // B1:校验appSettings.lua
  const settingsConfig = DCS.gameConfig.gameAppSettings;
  if (DCS.isFileExist(DCS.settingsPath)) {
    const settingsContent = fs.readFileSync(DCS.settingsPath, 'utf-8');
    let isAppSettingsChange = false;
    for (const key in settingsConfig.windowPlacement) {
      const targetVal = settingsConfig.windowPlacement[key];
      const currentVal = DCS.getOptionVal(settingsContent, key);
      if (targetVal != currentVal) {
        // B2:校验appSettings.lua中各个属性是否变更
        isAppSettingsChange = true;
      }
    }
    if (!isAppSettingsChange) {
      checkObject.mfdSetting.status = 'success'
      checkObject.appSettingsConfig.status = 'success'
    } else {
      checkObject.mfdSetting.status = 'error'
      checkObject.appSettingsConfig.status = 'error'
      return { checkObject: checkObject, result: false };
    }
  }
  // C1:校验wwtMonitor.lua
  if (!_.isEmpty(DCS.gameConfig.currentMod)) {
    if (!DCS.isFileExist(DCS.monitorPath)) {
      checkObject.mfdSetting.status = 'error'
      checkObject.wwtMonitorConfig.status = 'error'
      return { checkObject: checkObject, result: false };
    }
    const currentMonitorContent = fs.readFileSync(DCS.monitorPath, 'utf-8');
    const monitorContent = DCS.toMonitorLuaByConfig(DCS.gameConfig, templatePath);
    if (currentMonitorContent === monitorContent) {
      // C2:校验wwtMonitor.lua内容是否变更
      checkObject.mfdSetting.status = 'success'
      checkObject.wwtMonitorConfig.status = 'success'
    } else {
      checkObject.mfdSetting.status = 'error'
      checkObject.wwtMonitorConfig.status = 'error'
      return { checkObject: checkObject, result: false };
    }
  }
  return { checkObject: checkObject, result: true };
};
// 设置游戏配置文件
DCS.setGameConfig = (gameConfig, templatePath) => {
  DCS.gameConfig = _.cloneDeep(gameConfig);
  // 设置options
  const optionsConfig = gameConfig.gameOptions;
  let optionsContent = fs.readFileSync(DCS.optionsPath, 'utf-8');
  for (const key in optionsConfig.graphics) {
    const val = optionsConfig.graphics[key];
    optionsContent = DCS.replaceOption(optionsContent, key, val);
  }
  fs.writeFileSync(DCS.optionsPath, optionsContent);
  // 设置appSettings
  let settingsContent = '';
  const settingsConfig = gameConfig.gameAppSettings;
  for (const key in settingsConfig) {
    const obj = settingsConfig[key];
    settingsContent = DCS.toAppSettingLua(settingsContent, key, obj);
  }
  fs.writeFileSync(DCS.settingsPath, settingsContent);
  // 设置centerMonitor
  const monitorContent = DCS.toMonitorLuaByConfig(gameConfig, templatePath);
  fs.writeFileSync(DCS.monitorPath, monitorContent);
}
// 游戏运行或者关闭的时候，DCS需要做的设置操作
DCS.gameRuningSetting = (runningStatus, MFDDLL) => {

}

/** ********以下是每个子文件自己处理业务逻辑的方法***************** **/
// 获取Option的字段值
DCS.getOptionVal = (content, key) => {
  var val;
  const reg = new RegExp(`(?<=\\["${key}"\\]\\s*=\\s*)[\\S]+?(?=,)`, 'g');
  const str = content.match(reg);
  if (!str) {
    return val;
  }
  const reg1 = new RegExp('(?<=").*?(?=")', 'g');
  if (str[0].search(reg1) < 0) {
    val = str[0];
  } else {
    var valMatch = str[0].match(reg1);
    if (valMatch) {
      val = valMatch[0];
    }
  }
  return val;
}
DCS.toMonitorLuaByConfig = (gameConfig, templatePath) => {
  const mod = DCS.gameConfig.currentMod;
  let monitorContent = fs.readFileSync(templatePath, 'utf-8');
  monitorContent = DCS.toMonitorLua(monitorContent, gameConfig, gameConfig.gameViewports.Center);
  // 设置monitor
  const modInfo = gameConfig.modsInfo[mod];
  const monitorConfig = modInfo.instruments;
  for (const key in monitorConfig) {
    const instrument = monitorConfig[key];
    if (!_.isEmpty(instrument.id) || instrument.isgameMonitorShow) {
      monitorContent = DCS.toMonitorLua(monitorContent, gameConfig, instrument);
    }
  }
  // }
  return monitorContent;
}
// 将gameMonitor转为lua语句
DCS.toMonitorLua = (content, gameConfig, config) => {
  let t = '';
  // 判断是主显示器还是MFD显示器
  if (['Left', 'Center', 'Right'].includes(config.name)) {
    // 判断摄像机模式
    if (gameConfig.dcsCameraMode === '1Camera') {
      content = content + '\nViewports =\n';
      content = content + '{';
      t = '\t';
      content = content + `\n${t}${config.name} =\n`;
      content = content + `${t}{\n`;
      content = content + `${t}\tx = ${config.gameMonitor.left};\n`;
      content = content + `${t}\ty = ${config.gameMonitor.top};\n`;
      content = content + `${t}\twidth = ${config.gameMonitor.width};\n`;
      content = content + `${t}\theight = ${config.gameMonitor.height};\n`;
      content = content + `${t}\taspect = ${config.gameMonitor.aspect};\n`;
      content = content + `${t}}\n`;
      content = content + '}\n';
      content = content + 'UIMainView = Viewports.Center\n';
      content = content + 'GU_MAIN_VIEWPORT = Viewports.Center\n';
    } else if (gameConfig.dcsCameraMode === '3Camera') {
      content = content + '\nViewports =\n';
      content = content + '{';
      content = DCS.to3CameraLua(content, config);
      content = content + '}\n';
      // Main
      content = content + `\n${t}Main =\n`;
      content = content + `${t}{\n`;
      content = content + `${t}\tx = ${config.gameMonitor.left};\n`;
      content = content + `${t}\ty = ${config.gameMonitor.top};\n`;
      content = content + `${t}\twidth = ${config.gameMonitor.width};\n`;
      content = content + `${t}\theight = ${config.gameMonitor.height};\n`;
      content = content + `${t}\taspect = ${config.gameMonitor.aspect};\n`;
      content = content + `${t}}\n`;
      // 游戏主界面，任务加载界面
      content = content + 'UIMainView = Main\n';
      content = content + 'GU_MAIN_VIEWPORT = Main\n';
    }
  } else {
    content = content + `\n${t}${config.name} =\n`;
    content = content + `${t}{\n`;
    content = content + `${t}\tx = ${config.gameMonitor.left};\n`;
    content = content + `${t}\ty = ${config.gameMonitor.top};\n`;
    content = content + `${t}\twidth = ${config.gameMonitor.width};\n`;
    content = content + `${t}\theight = ${config.gameMonitor.height};\n`;
    content = content + `${t}}\n`;
  }
  return content
}
// 单摄像机模式转三摄像机模式（lua）
DCS.to3CameraLua = (content, config) => {
  // 宽度三等分
  const Left = {
    x: config.gameMonitor.left,
    y: config.gameMonitor.top,
    width: config.gameMonitor.width / 3,
    height: config.gameMonitor.height,
    viewDx: -1,
    viewDy: 0,
    aspect: config.gameMonitor.aspect / 3
  }
  const Center = {
    x: config.gameMonitor.left + config.gameMonitor.width / 3,
    y: config.gameMonitor.top,
    width: config.gameMonitor.width / 3,
    height: config.gameMonitor.height,
    viewDx: 0,
    viewDy: 0,
    aspect: config.gameMonitor.aspect / 3
  }
  const Right = {
    x: config.gameMonitor.left + config.gameMonitor.width * 2 / 3,
    y: config.gameMonitor.top,
    width: config.gameMonitor.width / 3,
    height: config.gameMonitor.height,
    viewDx: 1,
    viewDy: 0,
    aspect: config.gameMonitor.aspect / 3
  }
  const Viewports = {
    Left,
    Center,
    Right
  };
  let t = '';
  for (const viewport in Viewports) {
    const viewportConfig = Viewports[viewport];
    t = '\t';
    content = content + `\n${t}${viewport} =\n`;
    content = content + `${t}{\n`;
    for (const key in viewportConfig) {
      const val = viewportConfig[key];
      content = content + `${t}\t${key} = ${val};\n`;
    }
    content = content + `${t}},\n`;
  }
  return content;
}
// 替换option字段
DCS.replaceOption = (content, key, val) => {
  const reg = new RegExp(`(?<=\\["${key}"\\]\\s*=\\s*)[\\S]+?(?=,)`, 'g');
  const str = content.match(reg);
  if (!str) {
    return content;
  }
  if (str[0].search(/(?<=").*?(?=")/g) < 0) {
    content = content.replace(reg, val)
  } else {
    content = content.replace(reg, '"' + val + '"');
  }
  return content;
}
// 将gameAppSettings转为lua语句
DCS.toAppSettingLua = (content, key, obj) => {
  content = content + `${key} = {\n`;
  content = content + `\t["y"] = ${obj.y},\n`;
  content = content + `\t["x"] = ${obj.x},\n`;
  content = content + `\t["w"] = ${obj.w},\n`;
  content = content + `\t["h"] = ${obj.h},\n`;
  content = content + '}';
  return content
}

module.exports = DCS;
