const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const { app, ipcMain } = require('electron');
const TransparentDisplayTag = require('./TransparentDisplayTag');
const { Notification } = require('electron');
const notifierIcon = path.join(__dirname, '../www/logo', 'SimAppPro.png')
const Global = require('../www/js/Global_Electron.js');
const log = require('electron-log');
var iconv = require('iconv-lite');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
exec('NET SESSION')
const MFD = {}

MFD.imgBase = path.join(__dirname, '/../www/LoadImages/MFD/');
MFD.unpackDir = __dirname.replace('app.asar', 'app.asar.unpacked');
MFD.imgLeaderLineBase = path.join(MFD.unpackDir, '/../Events/MFD/img/')

MFD.identifyTimer = undefined;

MFD.init = (dll, store, getPath, win) => {
  // A1:缓存参数
  MFD.win = win
  MFD.dll = dll;
  MFD.store = store;
  MFD.getPath = getPath;
  // A2:监听SimAppPro隐藏和显示事件
  MFD.win.on('show', MFD.sendAppShow);
  MFD.win.on('hide', MFD.sendAppHide);
  // A3:拉取默认配置和强制配置
  const defaultConfig = require(path.join(MFD.unpackDir, '/../Events/MFD/config/default'));
  const extraConfig = require(path.join(MFD.unpackDir, '/../Events/MFD/config/extra'));
  MFD.defaultConfig = defaultConfig.config;
  MFD.extraConfig = extraConfig.config;
  // A4:获取文件路径
  MFD.getFilePath(MFD.getPath)
  // A5:判断是否下载了驱动
  MFD.getDisplayLinkInfo();
  // A5:打开C++库（显示器接口）
  MFD.dll.Monitor_Open();
  // A6:监听显示器变化
  MFD.dll.Monitor_CB_MonitorChange((arg) => {
    MFD.monitorChange(arg)
  });
  // 获取配置
  MFD.getConfig();
  // A7:开始执行主逻辑
  MFD.beg();
  MFD.appShowStatus = true;
  MFD.isInit = true;
  if (MFD.uiShowStatus) {
    MFD.sendInit()
  }
}

// 检查文件是否存在
MFD.isFileExist = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
// 获取文件路径
MFD.getFilePath = (getPath) => {
  let getAllPath = true;
  MFD.userPath = app.getPath('userData');
  MFD.driverDir = path.join(MFD.userPath, 'MFD/Driver');
  fs.mkdir(MFD.userPath + '/MFD', {
    recursive: true
  }, (err) => {});
  fs.mkdir(MFD.userPath + '/MFD/Driver', {
    recursive: true
  }, (err) => {});
  MFD.dcsExePath = getPath.GetActiveDCSEXEPath();
  if (!MFD.dcsExePath) {
    getAllPath = false;
  }
  if (!getPath.GetActiveDCSisExistExE()) {
    MFD.dcsExePath = undefined
    getAllPath = false;
  }
  MFD.dcsSavePath = getPath.GetActiveDCSSavePath();
  if (!MFD.dcsSavePath) {
    getAllPath = false;
  }
  MFD.MainPath = getPath.GetMainPath();
  if (!MFD.MainPath) {
    getAllPath = false;
  }
  if (MFD.dcsExePath) {
    MFD.monitorPath = path.join(MFD.dcsExePath, '\\Config\\MonitorSetup\\wwtMonitor.lua');
    // if (!MFD.isFileExist(MFD.monitorPath)) {
    //   getAllPath = false;
    // }
  }
  if (MFD.dcsSavePath) {
    MFD.optionsPath = path.join(MFD.dcsSavePath, '\\Config\\options.lua');
    if (!MFD.isFileExist(MFD.optionsPath)) {
      getAllPath = false;
    }
    MFD.settingsPath = path.join(MFD.dcsSavePath, '\\Config\\appSettings.lua');
    // if (!MFD.isFileExist(MFD.settingsPath)) {
    //   getAllPath = false;
    // }
  }
  if (MFD.MainPath) {
    MFD.templatePath = path.join(MFD.MainPath, 'Events\\MFD\\wwtMonitor.lua');
    if (!MFD.isFileExist(MFD.templatePath)) {
      getAllPath = false;
    }
    MFD.defaultConfigPath = path.join(MFD.MainPath, 'Events\\MFD\\config\\default.js')
    if (!MFD.isFileExist(MFD.defaultConfigPath)) {
      getAllPath = false;
    }
    MFD.extraConfigPath = path.join(MFD.MainPath, 'Events\\MFD\\config\\extra.js')
    if (!MFD.isFileExist(MFD.extraConfigPath)) {
      getAllPath = false;
    }
  }
  return getAllPath;
}
// 判断是否需要下载DisplayLink
MFD.getDisplayLinkInfo = async () => {
  try {
    const filePrefix = 'DisplayLink USB Graphics Software for Windows';
    let isDownload = false;
    const infoUrl = Global.getDownloadURL(MFD.store) + 'MFD/Driver/UpdateInfo.json';
    var res = await Global.getJSONSync(infoUrl);
    if (_.isEmpty(res)) {
      return
    }
    var newFileName = res.fileName;
    MFD.driverName = newFileName;
    MFD.driverDownloadName = '~' + newFileName;
    MFD.driverPath = path.join(MFD.driverDir, newFileName);
    MFD.driverDownloadPath = path.join(MFD.driverDir, MFD.driverDownloadName);
    var fileArrayByDir = fs.readdirSync(MFD.driverDir);
    for (var fileName of fileArrayByDir) {
      if (fileName.indexOf(filePrefix) == 0 && fileName.indexOf('.exe') >= 0) {
        if (newFileName == fileName) {
          isDownload = true;
        } else {
          var filePath = path.join(MFD.driverDir, fileName);
          fs.unlinkSync(filePath);
        }
      }
    }
    MFD.isDownloadDisplayLink = isDownload;
  } catch (err) {
    return false;
  }
}
// 下载DisplayLink驱动
MFD.downloadDisplayLink = async () => {
  try {
    // 删除旧的文件
    if (MFD.isFileExist(MFD.driverPath)) {
      fs.unlinkSync(MFD.driverPath);
    }
    await Global.DownloadFileSync(Global.getDownloadURL(MFD.store) + 'MFD/Driver/' + MFD.driverName, MFD.driverDir, MFD.driverDownloadName, (err, count, total) => {
      MFD.DriverDownloadInfo = {
        error: err,
        count: count,
        total: total
      }
      MFD.sendDownloadDriverProgress();
      // 下载成功后重命名
      if (err === undefined) {
        fs.renameSync(MFD.driverDownloadPath, MFD.driverPath);
        MFD.intervalCheckout();
      }
    });
  } catch (err) {
    console.log(err);
  }
}
// 监听屏幕信息变化
MFD.monitorChange = (argArray) => {
  // A1:缓存参数,避免因VR出现重复ID
  const idArray = [];
  MFD.monitorInfo = [];
  for (const arg of argArray) {
    if (idArray.includes(arg.id) || arg.width === 0 || arg.height === 0) {
      continue;
    }
    MFD.monitorInfo.push(arg);
    idArray.push(arg.id)
  }
  // A2:将数组转为对象，方便查询
  MFD.getMonitorInfoById();
  // A3:通知渲染进程屏幕变更
  MFD.sendMonitorChange();
}
// 获取屏幕信息
MFD.getMonitorInfo = () => {
  return MFD.monitorInfo;
}
// 更新图标
MFD.updateIcon = () => {
  if (_.isEmpty(MFD.config) || _.isEmpty(MFD.dcsExePath)) {
    return
  }
  for (const mod in MFD.config.modsInfo) {
    try {
      const modInfo = MFD.config.modsInfo[mod];
      const extraModInfo = MFD.extraConfig.modsInfo[mod];
      modInfo.iconPath = path.join(MFD.dcsExePath, extraModInfo.iconPath);
      modInfo.iconActivePath = path.join(MFD.dcsExePath, extraModInfo.iconActivePath);
      modInfo.iconBuyPath = path.join(MFD.dcsExePath, extraModInfo.iconBuyPath);
      modInfo.cockpitImgPath = path.join(MFD.imgBase, extraModInfo.cockpitImgPath);
    } catch (error) {
      log.error(`${error}=======>${MFD}`);
    }
  }
}
// 获取配置文件
MFD.getConfig = () => {
  // A3:获取用户配置
  const config = MFD.store.get('MFD');
  // A4:获取默认配置
  MFD.config = _.merge({}, MFD.defaultConfig, config, MFD.extraConfig);
  // 更新图标
  MFD.updateIcon();
  // 将配置发给渲染线程
  MFD.sendConfig();
  return MFD.config;
}
// 设置配置文件
MFD.setConfig = () => {
  MFD.sendConfig();
  return MFD.store.set('MFD', MFD.config);
}
// 单摄像机模式转三摄像机模式（lua）
MFD.to3CameraLua = (content, config) => {
  // 宽度三等分
  const Left = {
    x: config.dcsMonitor.left,
    y: config.dcsMonitor.top,
    width: config.dcsMonitor.width / 3,
    height: config.dcsMonitor.height,
    viewDx: -1,
    viewDy: 0,
    aspect: config.dcsMonitor.aspect / 3
  }
  const Center = {
    x: config.dcsMonitor.left + config.dcsMonitor.width / 3,
    y: config.dcsMonitor.top,
    width: config.dcsMonitor.width / 3,
    height: config.dcsMonitor.height,
    viewDx: 0,
    viewDy: 0,
    aspect: config.dcsMonitor.aspect / 3
  }
  const Right = {
    x: config.dcsMonitor.left + config.dcsMonitor.width * 2 / 3,
    y: config.dcsMonitor.top,
    width: config.dcsMonitor.width / 3,
    height: config.dcsMonitor.height,
    viewDx: 1,
    viewDy: 0,
    aspect: config.dcsMonitor.aspect / 3
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
// 将dcsMonitor转为lua语句
MFD.toMonitorLua = (content, config) => {
  let t = '';
  // 判断是主显示器还是MFD显示器
  if (['Left', 'Center', 'Right'].includes(config.name)) {
    // 判断摄像机模式
    if (MFD.config.dcsCameraMode === '1Camera') {
      content = content + '\nViewports =\n';
      content = content + '{';
      t = '\t';
      content = content + `\n${t}${config.name} =\n`;
      content = content + `${t}{\n`;
      content = content + `${t}\tx = ${config.dcsMonitor.left};\n`;
      content = content + `${t}\ty = ${config.dcsMonitor.top};\n`;
      content = content + `${t}\twidth = ${config.dcsMonitor.width};\n`;
      content = content + `${t}\theight = ${config.dcsMonitor.height};\n`;
      content = content + `${t}\taspect = ${config.dcsMonitor.aspect};\n`;
      content = content + `${t}}\n`;
      content = content + '}\n';
      content = content + 'UIMainView = Viewports.Center\n';
      content = content + 'GU_MAIN_VIEWPORT = Viewports.Center\n';
    } else if (MFD.config.dcsCameraMode === '3Camera') {
      content = content + '\nViewports =\n';
      content = content + '{';
      content = MFD.to3CameraLua(content, config);
      content = content + '}\n';
      // Main
      content = content + `\n${t}Main =\n`;
      content = content + `${t}{\n`;
      content = content + `${t}\tx = ${config.dcsMonitor.left};\n`;
      content = content + `${t}\ty = ${config.dcsMonitor.top};\n`;
      content = content + `${t}\twidth = ${config.dcsMonitor.width};\n`;
      content = content + `${t}\theight = ${config.dcsMonitor.height};\n`;
      content = content + `${t}\taspect = ${config.dcsMonitor.aspect};\n`;
      content = content + `${t}}\n`;
      // 游戏主界面，任务加载界面
      content = content + 'UIMainView = Main\n';
      content = content + 'GU_MAIN_VIEWPORT = Main\n';
    }
  } else {
    content = content + `\n${t}${config.name} =\n`;
    content = content + `${t}{\n`;
    content = content + `${t}\tx = ${config.dcsMonitor.left};\n`;
    content = content + `${t}\ty = ${config.dcsMonitor.top};\n`;
    content = content + `${t}\twidth = ${config.dcsMonitor.width};\n`;
    content = content + `${t}\theight = ${config.dcsMonitor.height};\n`;
    content = content + `${t}}\n`;
  }
  return content
}
// 将dcsAppSettings转为lua语句
MFD.toAppSettingLua = (content, key, obj) => {
  content = content + `${key} = {\n`;
  content = content + `\t["y"] = ${obj.y},\n`;
  content = content + `\t["x"] = ${obj.x},\n`;
  content = content + `\t["w"] = ${obj.w},\n`;
  content = content + `\t["h"] = ${obj.h},\n`;
  content = content + '}';
  return content
}
// 替换option字段
MFD.replaceOption = (content, key, val) => {
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
MFD.toMonitorLuaByConfig = (mod) => {
  let monitorContent = fs.readFileSync(MFD.templatePath, 'utf-8');
  monitorContent = MFD.toMonitorLua(monitorContent, MFD.config.dcsViewports.Center);
  // 设置monitor
  // for (const mod in MFD.config.modsInfo) {
  const modInfo = MFD.config.modsInfo[mod];
  const monitorConfig = modInfo.instruments;
  for (const key in monitorConfig) {
    const instrument = monitorConfig[key];
    if (!_.isEmpty(instrument.id) || instrument.isDcsMonitorShow) {
      monitorContent = MFD.toMonitorLua(monitorContent, instrument);
    }
  }
  // }
  return monitorContent;
}
// 设置DCS配置文件
MFD.setDCSConfig = (mod) => {
  // 设置options
  const optionsConfig = MFD.config.dcsOptions;
  let optionsContent = fs.readFileSync(MFD.optionsPath, 'utf-8');
  for (const key in optionsConfig.graphics) {
    const val = optionsConfig.graphics[key];
    optionsContent = MFD.replaceOption(optionsContent, key, val);
  }
  fs.writeFileSync(MFD.optionsPath, optionsContent);
  // 设置appSettings
  let settingsContent = '';
  const settingsConfig = MFD.config.dcsAppSettings;
  for (const key in settingsConfig) {
    const obj = settingsConfig[key];
    settingsContent = MFD.toAppSettingLua(settingsContent, key, obj);
  }
  fs.writeFileSync(MFD.settingsPath, settingsContent);
  // 设置centerMonitor
  const monitorContent = MFD.toMonitorLuaByConfig(mod);
  fs.writeFileSync(MFD.monitorPath, monitorContent);
}
// 设置屏幕状态
MFD.setMonitorState = () => {

}
MFD.interval = 3000
MFD.timer = null;
// 开始执行MFD的处理逻辑
MFD.beg = () => {
  MFD.logic();
}
// 结束MFD的处理逻辑
MFD.end = () => {
  clearInterval(MFD.timer);
  MFD.timer = null;
}
// MFD的处理逻辑
MFD.logic = () => {
  // A1:开机检查显示器布局
  MFD.initCheckout();
  // A2:循环检查
  MFD.intervalCheckout();
}
// 应用=================================================================================Beg
// 将数组转为对象，方便查询
MFD.getMonitorInfoById = () => {
  const monitorInfoById = {};
  for (const info of MFD.monitorInfo) {
    monitorInfoById[info.id] = info;
  }
  MFD.monitorInfoById = monitorInfoById;
  return monitorInfoById;
}
// 根据目标对象所拥有的属性更新对象
MFD.updateObject = (target, source) => {
  for (const key in target) {
    target[key] = source[key]
  }
  return target;
}
// 获取mod
MFD.getMod = () => {
  const mod = MFD.dcsRunningStatus ? MFD.config.applyMod : MFD.config.currentMod;
  return mod;
}
// 获取关联屏幕
MFD.getRelationMonitorInfoById = (mod) => {
  const mainMonitorInfoById = {};
  const usbMonitorInfoById = {};
  for (const id in MFD.monitorInfoById) {
    const info = MFD.monitorInfoById[id];
    for (const viewPort in MFD.config.dcsViewports) {
      const viewPortInfo = MFD.config.dcsViewports[viewPort];
      if (viewPortInfo.id && viewPortInfo.id.includes(info.id)) {
        mainMonitorInfoById[info.id] = info;
      }
    }
    const modInfo = MFD.config.modsInfo[mod];
    for (const instrument in modInfo && modInfo.instruments) {
      const instrumentInfo = modInfo.instruments[instrument];
      if (instrumentInfo.id && instrumentInfo.id.includes(info.id)) {
        usbMonitorInfoById[info.id] = info;
      }
    }
  }
  return { mainMonitorInfoById, usbMonitorInfoById };
}
// 计算dcs单个视窗
MFD.calcMonitor = (config) => {
  // A1:初始化变量
  const monitor = {
    left: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
    width: 0,
    height: 0,
    aspect: 0
  };
  // B1:获取关联屏
  const monitorInfo = [];
  for (const id of config.id || []) {
    if (MFD.monitorInfoById && MFD.monitorInfoById[id]) {
      monitorInfo.push(MFD.monitorInfoById[id]);
    }
  }
  // C1:将显示器的分辨率转为DCS内外坐标
  if (monitorInfo.length > 0) {
    // C2.1:计算最大分辨率
    for (const info of monitorInfo) {
      monitor.left = monitor.left !== undefined ? monitor.left : info.left;
      monitor.top = monitor.top !== undefined ? monitor.top : info.top;
      monitor.right = monitor.right !== undefined ? monitor.right : info.right;
      monitor.bottom = monitor.bottom !== undefined ? monitor.bottom : info.bottom;
      if (info.left < monitor.left) {
        monitor.left = info.left;
      }
      if (info.top < monitor.top) {
        monitor.top = info.top;
      }
      if (info.right > monitor.right) {
        monitor.right = info.right;
      }
      if (info.bottom > monitor.bottom) {
        monitor.bottom = info.bottom;
      }
    }
    monitor.width = monitor.right - monitor.left;
    monitor.height = monitor.bottom - monitor.top;
    monitor.aspect = Number(monitor.width) / Number(monitor.height);

    // C2.2:更新displayMonitor
    config.displayMonitor = MFD.updateObject(config.displayMonitor, monitor);
    // C2.3:计算dcsMonitor
    for (const key in config.tailorMonitor) {
      config.dcsMonitor[key] = config.displayMonitor[key] + config.tailorMonitor[key] + MFD.config.dcsOffset[key];
      if (config.isEnableKeyGuideShow && !config.isEnableKeyGuide) {
        config.dcsMonitor[key] = config.displayMonitor[key] + config.overlayerTailorMonitor[key] + MFD.config.dcsOffset[key];
      } else {
        config.dcsMonitor[key] = config.displayMonitor[key] + config.tailorMonitor[key] + MFD.config.dcsOffset[key];
      }
    }
    config.dcsMonitor.width = config.dcsMonitor.right - config.dcsMonitor.left;
    config.dcsMonitor.height = config.dcsMonitor.bottom - config.dcsMonitor.top;
    config.dcsMonitor.aspect = Number(config.dcsMonitor.width) / Number(config.dcsMonitor.height);
  } else {
    // C3.1当对应显示器下线需要给默认值
    monitor.left = 0;
    monitor.top = 0;
    monitor.right = 0;
    monitor.bottom = 0;
    config.displayMonitor = _.cloneDeep(monitor);
    config.dcsMonitor = _.cloneDeep(monitor);
  }
  return config;
}
// 计算DCS所有视窗数据转到配置文件
MFD.calcAllMonitor = () => {
  // A1:获取当前mod
  const mod = MFD.getMod();
  if (mod === '') {
    return
  }
  // A2:初始化变量
  const dcsMonitor = {
    left: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
    width: 0,
    height: 0,
    aspect: 0
  }
  // A3:获取关联的显示器
  const { mainMonitorInfoById, usbMonitorInfoById } = MFD.getRelationMonitorInfoById(mod);
  const monitorInfoById = {
    ...mainMonitorInfoById,
    ...usbMonitorInfoById
  }
  // A4:计算DCS外部坐标大小
  for (const id in monitorInfoById) {
    const info = monitorInfoById[id];
    dcsMonitor.left = dcsMonitor.left !== undefined ? dcsMonitor.left : info.left;
    dcsMonitor.top = dcsMonitor.top !== undefined ? dcsMonitor.top : info.top;
    dcsMonitor.right = dcsMonitor.right !== undefined ? dcsMonitor.right : info.right;
    dcsMonitor.bottom = dcsMonitor.bottom !== undefined ? dcsMonitor.bottom : info.bottom;
    if (info.left < dcsMonitor.left) {
      dcsMonitor.left = info.left;
    }
    if (info.top < dcsMonitor.top) {
      dcsMonitor.top = info.top;
    }
    if (info.right > dcsMonitor.right) {
      dcsMonitor.right = info.right;
    }
    if (info.bottom > dcsMonitor.bottom) {
      dcsMonitor.bottom = info.bottom;
    }
  }
  dcsMonitor.width = dcsMonitor.right - dcsMonitor.left;
  dcsMonitor.height = dcsMonitor.bottom - dcsMonitor.top;
  dcsMonitor.aspect = Number(dcsMonitor.width) / Number(dcsMonitor.height);
  MFD.config.dcsMonitor = dcsMonitor;
  // A5:计算options的值
  for (const key in MFD.config.dcsOptions.graphics) {
    if (dcsMonitor[key] != undefined) {
      MFD.config.dcsOptions.graphics[key] = dcsMonitor[key];
    }
  }
  // A6:计算DCS程序位于显示器的位置和大小
  MFD.config.dcsAppSettings.windowPlacement.x = dcsMonitor.left;
  MFD.config.dcsAppSettings.windowPlacement.y = dcsMonitor.top;
  MFD.config.dcsAppSettings.windowPlacement.w = dcsMonitor.width;
  MFD.config.dcsAppSettings.windowPlacement.h = dcsMonitor.height;
  // A7:计算DCS内外坐标的偏移值
  MFD.config.dcsOffset.left = -MFD.config.dcsAppSettings.windowPlacement.x;
  MFD.config.dcsOffset.top = -MFD.config.dcsAppSettings.windowPlacement.y;
  MFD.config.dcsOffset.right = -MFD.config.dcsAppSettings.windowPlacement.x;
  MFD.config.dcsOffset.bottom = -MFD.config.dcsAppSettings.windowPlacement.y;
  // A8:计算DCS内部主屏的位置和大小
  MFD.config.dcsViewports.Center = MFD.calcMonitor(MFD.config.dcsViewports.Center);
  // A9:计算DCS内部各个MFD的分辨率
  const modInfo = MFD.config.modsInfo[mod];
  const instruments = (modInfo && modInfo.instruments) || [];
  for (const name in instruments) {
    var instrument = instruments[name];
    const result = MFD.calcMonitor(instrument);
    MFD.config.modsInfo[mod].instruments[name] = result;
  }
}
// 保存屏幕信息
MFD.setApplyMonitorInfo = (mod) => {
  const { mainMonitorInfoById, usbMonitorInfoById } = MFD.getRelationMonitorInfoById(mod);
  MFD.config.mainMonitorInfoById = mainMonitorInfoById;
  MFD.config.usbMonitorInfoById = usbMonitorInfoById;
  MFD.config.monitorInfoById = MFD.monitorInfoById;
  MFD.setConfig();
}
MFD.setApplyStatus = (applyName) => {
  const applyStatusArray = ['mainMonitorApplyStatus', 'dcsCameraModeApplyStatus', 'monitorLayoutApplyStatus', 'mfdSettingApplyStatus'];
  let status = 1;
  for (const applyStatus of applyStatusArray) {
    MFD.config[applyStatus] = status;
    if (applyName === applyStatus) {
      status = 0;
    }
  }
}
// 应用游戏画面显示器
MFD.mainMonitorApply = () => {
  // A1:获取已绑定的游戏画面
  const mainMonitorInfoById = {};
  for (const id in MFD.monitorInfoById) {
    const info = MFD.monitorInfoById[id];
    for (const viewPort in MFD.config.dcsViewports) {
      const viewPortInfo = MFD.config.dcsViewports[viewPort];
      if (viewPortInfo.id.includes(info.id)) {
        mainMonitorInfoById[info.id] = info;
      }
    }
  }
  // A2:未变更则跳过
  if (_.isEqual(MFD.config.mainMonitorInfoById, mainMonitorInfoById)) {
    return
  }
  // A3:保存已绑定的屏幕信息
  MFD.config.mainMonitorInfoById = mainMonitorInfoById;
  // A4:设置应用状态
  MFD.setApplyStatus('mainMonitorApplyStatus');
  // 重新计算屏幕数据
  MFD.calcAllMonitor();
  // A5:设置配置
  MFD.setConfig();
}
MFD.dcsCameraModeApply = () => {
  // A1:保存应用
  MFD.config.dcsCameraModeApply = MFD.config.dcsCameraMode;
  // A1:设置应用状态
  MFD.setApplyStatus('dcsCameraModeApplyStatus');
  // A2:设置配置
  MFD.setConfig();
}
MFD.monitorLayoutApply = () => {
  // A1:获取所有MFD显示器信息
  const usbMonitorInfoById = {};
  const mainMonitorInfoById = {};
  for (const id in MFD.monitorInfoById) {
    const info = MFD.monitorInfoById[id];
    for (const viewPort in MFD.config.dcsViewports) {
      const viewPortInfo = MFD.config.dcsViewports[viewPort];
      if (viewPortInfo.id.includes(info.id)) {
        mainMonitorInfoById[info.id] = info;
      }
    }
    if (info.driveName === 'DisplayLink USB Device') {
      usbMonitorInfoById[info.id] = info;
    }
  }
  // A2:未变更则跳过
  // if (_.isEqual(MFD.config.usbMonitorInfoById, usbMonitorInfoById)) {
  //   return
  // }
  // A3:保存MFD显示器信息
  MFD.config.mainMonitorInfoById = mainMonitorInfoById;
  MFD.config.usbMonitorInfoById = usbMonitorInfoById;
  MFD.config.monitorInfoById = MFD.monitorInfoById;
  // A4:设置应用状态
  MFD.setApplyStatus('monitorLayoutApplyStatus');
  // A5:保存显示器配置到注册表
  // MFD.dll.Monitor_SaveMonitor();
  // 重新计算屏幕数据
  MFD.calcAllMonitor();
  // A5:设置配置
  MFD.setConfig();
}
// MFD处理逻辑中的应用
MFD.mfdSettingApply = () => {
  const mod = MFD.config.currentMod;
  // A1:设置应用机模
  MFD.config.applyMod = mod;
  // A2:计算屏幕
  MFD.calcAllMonitor();
  // A3:设置应用状态
  MFD.setApplyStatus('mfdSettingApplyStatus');
  // A4:设置配置
  MFD.setConfig();
  // A5:写入DCS配置
  MFD.setDCSConfig(mod);
}
// DED处理逻辑中位置布局的应用
MFD.dedLayoutApply = ({ mod, instrument, monitorInfo }) => {
  // A1:设置应用的机模
  MFD.config.applyMod = mod;
  // A2:设置DCS显示位置和大小,以及在未绑定显示器ID的情况显示DED
  MFD.config.instruments[instrument].isDcsMonitorShow = true;
  MFD.config.instruments[instrument].dcsMonitor = monitorInfo;
  // A3:设置应用状态
  MFD.config.dedLayoutApplyStatus = 1;
  // A4:设置DCS的显示器lua配置
  MFD.setDCSConfig(mod);
}
// 应用=================================================================================End
// 校验=================================================================================Beg
// 检查单
const checkDefault = {
  parent: '',
  show: true,
  status: '', // process,warning,error,success
  description: '',
  tag: ''
}
MFD.checkObjectDefault = {
  // 驱动
  mfdDriver: {
    ...checkDefault
  },
  mfdDriverDownload: {
    ...checkDefault,
    parent: 'mfdDriver'
  },
  mfdDriverInstall: {
    ...checkDefault,
    parent: 'mfdDriver'
  },
  // 扩展模式
  extendMode: {
    ...checkDefault
  },
  // VR
  // vr: {
  //   ...checkDefault,
  //   show: false
  // },
  // DCS路径
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
  dcsOptions: {
    ...checkDefault,
    parent: 'dcsPath'
  },
  dcsAppSettings: {
    ...checkDefault,
    parent: 'dcsPath',
    show: false
  },
  dcsMonitor: {
    ...checkDefault,
    parent: 'dcsPath',
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
  // 设置DCS摄像机模式
  dcsCameraMode: {
    ...checkDefault
  },
  dcsCameraModeChange: {
    ...checkDefault,
    parent: 'dcsCameraMode',
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
  // DCS运行时显示器状态
  monitorStatusWhenDcsRunning: {
    ...checkDefault
  }
}
MFD.checkObjectInit = () => {
  MFD.checkObject = _.cloneDeep(MFD.checkObjectDefault);
}
// 校验驱动
MFD.checkoutDriver = () => {
  // 是否安装驱动
  if (MFD.dll.IsInstallDisplayLink()) {
    MFD.checkObject.mfdDriver.status = 'success';
    MFD.checkObject.mfdDriverInstall.status = 'success';
    MFD.checkObject.mfdDriverDownload.status = 'success';
    return true
  } else {
    MFD.checkObject.mfdDriver.status = 'error';
    MFD.checkObject.mfdDriverInstall.status = 'error';
  }
  // 是否下载驱动
  MFD.isDownloadDisplayLink = MFD.isFileExist(MFD.driverPath);
  const isDownloadDisplayLink = MFD.isDownloadDisplayLink;
  if (isDownloadDisplayLink) {
    MFD.checkObject.mfdDriver.status = 'success';
    MFD.checkObject.mfdDriverDownload.status = 'success';
  } else {
    MFD.checkObject.mfdDriver.status = 'error';
    MFD.checkObject.mfdDriverDownload.status = 'error';
    return false
  }
  if (MFD.checkObject.mfdDriverInstall.status === 'error') {
    MFD.checkObject.mfdDriver.status = 'error';
    return false
  }
  return true
}
// 校验扩展模式
MFD.checkoutMode = () => {
  let isExtend = true;
  for (const id in MFD.monitorInfoById) {
    const info = MFD.monitorInfoById[id];
    if (info.mode !== 'extend') {
      isExtend = false;
    }
    break;
  }
  if (isExtend) {
    MFD.checkObject.extendMode.status = 'success';
  } else {
    MFD.checkObject.extendMode.status = 'error';
    return false
  }
  return true;
}
// 校验地址
MFD.checkoutPath = () => {
  // A1:校验DCS安装路径
  MFD.dcsExePath = MFD.getPath.GetActiveDCSEXEPath();
  const isExistExe = MFD.getPath.GetActiveDCSisExistExE();
  if (MFD.dcsExePath && isExistExe) {
    MFD.checkObject.dcsPath.status = 'success'
    MFD.checkObject.dcsInstallPath.status = 'success'
  } else {
    MFD.checkObject.dcsPath.status = 'error'
    MFD.checkObject.dcsInstallPath.status = 'error'
    return false;
  }
  // A2:校验DCS用户保存路径
  MFD.dcsSavePath = MFD.getPath.GetActiveDCSSavePath();
  if (MFD.dcsSavePath) {
    MFD.checkObject.dcsPath.status = 'success'
    MFD.checkObject.dcsUserPath.status = 'success'
  } else {
    MFD.checkObject.dcsPath.status = 'error'
    MFD.checkObject.dcsUserPath.status = 'error'
    return false;
  }
  // A5:校验options.lua是否存在
  if (MFD.dcsSavePath) {
    MFD.optionsPath = path.join(MFD.dcsSavePath, '\\Config\\options.lua');
    if (MFD.isFileExist(MFD.optionsPath)) {
      MFD.checkObject.dcsPath.status = 'success'
      MFD.checkObject.dcsOptions.status = 'success'
    } else {
      MFD.checkObject.dcsPath.status = 'error'
      MFD.checkObject.dcsOptions.status = 'error'
      return false;
    }
  }
  // A6:校验appSettings.lua是否存在
  if (MFD.dcsSavePath) {
    MFD.settingsPath = path.join(MFD.dcsSavePath, '\\Config\\appSettings.lua');
    if (MFD.isFileExist(MFD.settingsPath)) {
      MFD.checkObject.dcsPath.status = 'success'
      MFD.checkObject.dcsAppSettings.status = 'success'
    } else {
      // MFD.checkObject.dcsPath.status = 'error'
      MFD.checkObject.dcsAppSettings.status = 'error'
    }
  }
  // A4:校验wwtMonitor.lua是否存在
  if (MFD.dcsExePath) {
    MFD.monitorPath = path.join(MFD.dcsExePath, '\\Config\\MonitorSetup\\wwtMonitor.lua');
    if (MFD.isFileExist(MFD.monitorPath)) {
      MFD.checkObject.dcsPath.status = 'success'
      MFD.checkObject.dcsMonitor.status = 'success'
    } else {
      // MFD.checkObject.dcsPath.status = 'error'
      MFD.checkObject.dcsMonitor.status = 'error'
    }
  }
  return true
}
// 校验游戏画面显示器
MFD.checkoutMainMonitor = () => {
  // A1:校验是否点击过应用
  if (MFD.config.mainMonitorApplyStatus > 0) {
    MFD.checkObject.mainMonitor.status = 'success'
  } else {
    MFD.checkObject.mainMonitor.status = 'process'
    return false;
  }
  // A1:校验游戏主屏是否上线
  MFD.checkObject.mainMonitorOnline.monitorIdArray = [];
  for (const id of MFD.config.dcsViewports.Center.id) {
    if (_.isEmpty(MFD.monitorInfoById[id])) {
      MFD.checkObject.mainMonitorOnline.monitorIdArray.push(id);
    }
  }
  if (_.isEmpty(MFD.checkObject.mainMonitorOnline.monitorIdArray)) {
    MFD.checkObject.mainMonitor.status = 'success'
    MFD.checkObject.mainMonitorOnline.status = 'success'
  } else {
    MFD.checkObject.mainMonitor.status = 'error'
    MFD.checkObject.mainMonitorOnline.status = 'error'
    return false
  }
  // A2:校验游戏主屏至少一个
  if (!_.isEmpty(MFD.config.dcsViewports.Center.id) && !_.isEqual(MFD.config.dcsViewports.Center.id, MFD.checkObject.mainMonitorOnline.monitorIdArray)) {
    MFD.checkObject.mainMonitor.status = 'success'
    MFD.checkObject.mainMonitorAtLeastOne.status = 'success'
  } else {
    MFD.checkObject.mainMonitor.status = 'error'
    MFD.checkObject.mainMonitorAtLeastOne.status = 'error'
    return false;
  }
  return true
}
// 校验DCS摄像机模式
MFD.checkoutDcsCameraMode = () => {
  // A1:校验是否点击过应用
  if (MFD.config.dcsCameraModeApplyStatus > 0) {
    MFD.checkObject.dcsCameraMode.status = 'success'
  } else {
    MFD.checkObject.dcsCameraMode.status = 'process'
    return false;
  }
  // A2:校验是否变更过模式
  if (MFD.config.dcsCameraMode === MFD.config.dcsCameraModeApply) {
    MFD.checkObject.dcsCameraMode.status = 'success'
    MFD.checkObject.dcsCameraModeChange.status = 'success'
  } else {
    MFD.checkObject.dcsCameraMode.status = 'error'
    MFD.checkObject.dcsCameraModeChange.status = 'error'
    return false;
  }
  return true;
}
// 校验屏幕排布与方向
MFD.checkoutMonitor = () => {
  // A1:校验是否点击过应用
  if (MFD.config.monitorLayoutApplyStatus > 0) {
    MFD.checkObject.monitorLayout.status = 'success'
  } else {
    MFD.checkObject.monitorLayout.status = 'process'
    return false;
  }
  // A1:校验屏幕排布与方向是否与激活的配置一致
  const mainMonitorInfoById = MFD.config.mainMonitorInfoById;
  const usbMonitorInfoById = MFD.config.usbMonitorInfoById;
  var isChange = false;
  for (const id in mainMonitorInfoById) {
    const monitor = mainMonitorInfoById[id];
    for (const key in monitor) {
      if (['deviceName'].includes(key)) {
        continue;
      }
      if (MFD.monitorInfoById && MFD.monitorInfoById[id] && monitor[key] !== MFD.monitorInfoById[id][key]) {
        isChange = true;
      }
    }
  }
  for (const id in usbMonitorInfoById) {
    const monitor = usbMonitorInfoById[id];
    for (const key in monitor) {
      if (['deviceName'].includes(key)) {
        continue;
      }
      if (MFD.monitorInfoById && MFD.monitorInfoById[id] && monitor[key] !== MFD.monitorInfoById[id][key]) {
        isChange = true;
      }
    }
  }
  if (!isChange) {
    MFD.checkObject.monitorLayout.status = 'success'
    MFD.checkObject.monitorLayoutChange.status = 'success'
  } else {
    MFD.checkObject.monitorLayout.status = 'error'
    MFD.checkObject.monitorLayoutChange.status = 'error'
    return false;
  }
  return true;
}
// 校验MFD显示器
MFD.checkoutMfdSetting = (mod, isMonitorChange) => {
  // A1:校验是否点击过应用
  if (MFD.config.mfdSettingApplyStatus > 0) {
    MFD.checkObject.mfdSetting.status = 'success'
  } else {
    MFD.checkObject.mfdSetting.status = 'process'
    return false;
  }
  // A4:获取机型
  mod = MFD.getMod();
  // mod = mod || MFD.config.applyMod;
  if (_.isEmpty(mod)) {
    return false
  }
  // A2:遍历当前机模的仪表面板
  MFD.checkObject.mfdOnline.instrumentArray = [];
  MFD.checkObject.mfdDirection.instrumentArray = [];
  MFD.checkObject.mfdPositionAndSize.instrumentArray = [];
  for (const instrumentKey in MFD.config.modsInfo[mod] && MFD.config.modsInfo[mod].instruments) {
    const instrument = MFD.config.modsInfo[mod].instruments[instrumentKey];
    // A3:遍历仪表视窗绑定的显示器
    for (const id of instrument.id) {
      // A4:判断显示器是否在线
      if (MFD.monitorInfoById[id] === undefined) {
        MFD.checkObject.mfdOnline.instrumentArray.push(instrument);
        continue;
      }
      // A5:校验横竖屏
      if (MFD.monitorInfoById[id].direction !== instrument.direction) {
        MFD.checkObject.mfdDirection.instrumentArray.push(instrument);
        continue;
      }
      // A6:屏幕变化时，校验屏幕是否改变位置大小
      if (isMonitorChange) {
        let isChange = false;
        for (const uiMonitorKey in instrument.displayMonitor) {
          if (['left', 'right', 'bottom', 'top', 'direction'].indexOf(uiMonitorKey) < 0) {
            continue
          }
          if (MFD.monitorInfoById[id][uiMonitorKey] !== instrument.displayMonitor[uiMonitorKey]) {
            isChange = true;
          }
        }
        if (isChange) {
          MFD.checkObject.mfdPositionAndSize.instrumentArray.push(instrument);
        }
      }
    }
  }
  // A3:判断是否在线
  if (_.isEmpty(MFD.checkObject.mfdOnline.instrumentArray)) {
    MFD.checkObject.mfdSetting.status = 'success'
    MFD.checkObject.mfdOnline.status = 'success'
  } else {
    MFD.checkObject.mfdSetting.status = 'error'
    MFD.checkObject.mfdOnline.status = 'error'
    return false
  }
  // A4:判断横竖屏
  if (_.isEmpty(MFD.checkObject.mfdDirection.instrumentArray)) {
    MFD.checkObject.mfdSetting.status = 'success'
    MFD.checkObject.mfdDirection.status = 'success'
  } else {
    MFD.checkObject.mfdSetting.status = 'error'
    MFD.checkObject.mfdDirection.status = 'error'
    return false
  }
  // A5:判断位置和大小
  if (_.isEmpty(MFD.checkObject.mfdPositionAndSize.instrumentArray)) {
    MFD.checkObject.mfdSetting.status = 'success'
    MFD.checkObject.mfdPositionAndSize.status = 'success'
  } else {
    MFD.checkObject.mfdSetting.status = 'error'
    MFD.checkObject.mfdPositionAndSize.status = 'error'
    return false
  }
  return true
}
// 获取Option的字段值
MFD.getOptionVal = (content, key) => {
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
// 校验DCS配置是否变更
MFD.checkoutDCSConfig = (mod) => {
  // A4:获取机型
  mod = MFD.getMod();
  // mod = mod || MFD.config.applyMod;
  if (_.isEmpty(mod)) {
    return false
  }
  // A1:校验options.lua
  const optionsConfig = MFD.config.dcsOptions;
  if (!MFD.isFileExist(MFD.optionsPath)) {
    MFD.checkObject.mfdSetting.status = 'error'
    MFD.checkObject.optionsConfig.status = 'error'
    return false;
  }
  const optionsContent = fs.readFileSync(MFD.optionsPath, 'utf-8');
  let isOptionsChange = false;
  for (const key in optionsConfig.graphics) {
    const targetVal = optionsConfig.graphics[key];
    const currentVal = MFD.getOptionVal(optionsContent, key);
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
    MFD.checkObject.mfdSetting.status = 'success'
    MFD.checkObject.optionsConfig.status = 'success'
  } else {
    MFD.checkObject.mfdSetting.status = 'error'
    MFD.checkObject.optionsConfig.status = 'error'
    return false;
  }
  // B1:校验appSettings.lua
  const settingsConfig = MFD.config.dcsAppSettings;
  if (MFD.isFileExist(MFD.settingsPath)) {
    const settingsContent = fs.readFileSync(MFD.settingsPath, 'utf-8');
    let isAppSettingsChange = false;
    for (const key in settingsConfig.windowPlacement) {
      const targetVal = settingsConfig.windowPlacement[key];
      const currentVal = MFD.getOptionVal(settingsContent, key);
      if (targetVal != currentVal) {
      // B2:校验appSettings.lua中各个属性是否变更
        isAppSettingsChange = true;
      }
    }
    if (!isAppSettingsChange) {
      MFD.checkObject.mfdSetting.status = 'success'
      MFD.checkObject.appSettingsConfig.status = 'success'
    } else {
      MFD.checkObject.mfdSetting.status = 'error'
      MFD.checkObject.appSettingsConfig.status = 'error'
      return false;
    }
  }
  // C1:校验wwtMonitor.lua
  if (MFD.config && !_.isEmpty(MFD.config.applyMod)) {
    if (!MFD.isFileExist(MFD.monitorPath)) {
      MFD.checkObject.mfdSetting.status = 'error'
      MFD.checkObject.wwtMonitorConfig.status = 'error'
      return false;
    }
    const currentMonitorContent = fs.readFileSync(MFD.monitorPath, 'utf-8');
    const monitorContent = MFD.toMonitorLuaByConfig(mod);
    if (currentMonitorContent === monitorContent) {
    // C2:校验wwtMonitor.lua内容是否变更
      MFD.checkObject.mfdSetting.status = 'success'
      MFD.checkObject.wwtMonitorConfig.status = 'success'
    } else {
      MFD.checkObject.mfdSetting.status = 'error'
      MFD.checkObject.wwtMonitorConfig.status = 'error'
      return false;
    }
  }
  return true;
}
// 校验DCS是否运行
MFD.checkoutDcsRunning = () => {
  const dcsRunningStatus = MFD.dll.CheckProcessExists('DCS.exe');
  MFD.isDcsRunningStatusChange = false
  if (dcsRunningStatus !== MFD.dcsRunningStatus) {
    MFD.isDcsRunningStatusChange = true
    MFD.dcsRunningStatus = dcsRunningStatus
    MFD.sendDcsRunningStatus();
    MFD.openIdentifyId();
    MFD.openOverlayer();
  }
  return MFD.dcsRunningStatus
}
// 校验DCS运行时显示器状态
MFD.checkoutMonitorStatusWhenDcsRunning = () => {
  if (!MFD.dcsRunningStatus) {
    MFD.checkObject.monitorStatusWhenDcsRunning.status = 'process';
    MFD.monitorInfoByIdBeforeDcsRunning = {
      ...MFD.monitorInfoById
    }
  } else {
    MFD.checkObject.monitorStatusWhenDcsRunning.status = 'success';
    if (_.isEmpty(MFD.monitorInfoByIdBeforeDcsRunning)) {
      MFD.monitorInfoByIdBeforeDcsRunning = {
        ...MFD.monitorInfoById
      }
    }
  }
  let isChange = false;
  for (const id in MFD.monitorInfoByIdBeforeDcsRunning) {
    const monitor = MFD.monitorInfoByIdBeforeDcsRunning[id];
    MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`] = MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`] || {};
    MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`].parent = 'monitorStatusWhenDcsRunning';
    MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`].show = true;
    MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`].monitorId = id;
    if (!MFD.dcsRunningStatus) {
      MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`].status = 'process';
    } else {
      MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`].status = 'success';
    }
    for (const key in monitor) {
      if (!['deviceName'].includes(key)) {
        continue;
      }
      if (MFD.monitorInfoById && MFD.monitorInfoById[id] && monitor[key] !== MFD.monitorInfoById[id][key]) {
        MFD.checkObject.monitorStatusWhenDcsRunning.status = 'error';
        MFD.checkObject[`monitorStatusWhenDcsRunning_${id}`].status = 'error';
        isChange = true;
      }
    }
  }
  if (isChange) {
    return false;
  }
  return true;
}

MFD.checkout = (mod) => {
  // 判断屏幕信息是否已获取
  if (_.isEmpty(MFD.monitorInfoById)) {
    return false
  }
  // 初始化检查单
  MFD.checkObjectInit();
  let ret;
  // A1:校验是否下载驱动，安装驱动
  ret = MFD.checkoutDriver();
  if (!ret) {
    return false
  }
  // A2:校验是否为扩展模式
  ret = MFD.checkoutMode();
  if (!ret) {
    return false
  }
  // A3:校验路径
  ret = MFD.checkoutPath();
  if (!ret) {
    return false
  }
  // A5:校验游戏画面显示器
  ret = MFD.checkoutMainMonitor();
  if (!ret) {
    return false
  }
  // A6:校验DCS摄像机模式
  ret = MFD.checkoutDcsCameraMode();
  if (!ret) {
    return false;
  }
  // A7:校验屏幕排布和方向
  ret = MFD.checkoutMonitor();
  if (!ret) {
    return false
  }
  // A8:校验屏幕是否变更
  ret = MFD.checkoutMfdSetting(mod, true);
  if (!ret) {
    return false
  }
  // A9:校验DCS配置是否变更
  ret = MFD.checkoutDCSConfig(mod);
  if (!ret) {
    return false
  }
  // A10:校验DCS运行时显示器状态
  ret = MFD.checkoutMonitorStatusWhenDcsRunning();
  if (!ret) {
    return false
  }
  return true
}
MFD.initCheckout = () => {
  // A1: 判断用户是否在设置显示器布局和排布中点击过应用，没有则不判断后续逻辑
  if (!MFD.config.monitorLayoutApplyStatus) {
    return;
  }
  // A2: 判断用户是否勾选了启用布局重置功能。
  if (!MFD.config.monitorLayoutReset) {
    return;
  }
  // A3：循环判断，直到显示器数据刷新，并重置一次显示器位置和方向后退出。
  var timer = setInterval(() => {
    // B1:如果显示器为空，则继续循环,等待显示器数据更新
    if (_.isEmpty(MFD.monitorInfoById)) {
      return
    }
    // B2:清除循环，执行完本次逻辑
    clearInterval(timer);
    // B3:检查显示器数量和ID是否一一匹配
    var monitorIdArray = [];
    var configMonitorIdArray = [];
    var monitoInfoArray = [];
    for (const id in MFD.monitorInfoById) {
      monitorIdArray.push(id);
    }
    for (const id in MFD.config.monitorInfoById) {
      configMonitorIdArray.push(id);
      monitoInfoArray.push(MFD.config.monitorInfoById[id]);
    }
    const monitorIdXor = _.xor(monitorIdArray, configMonitorIdArray);
    if (!_.isEmpty(monitorIdXor)) {
      // C1:如果显示器数量和ID不匹配，则放弃重置显示器位置和方向
      return;
    }
    // B4:如果显示器数量和ID匹配，则重置显示器位置和方向。
    MFD.dll.Monitor_SetMonitor(monitoInfoArray);

    // B5:主动调用一次循环检查
    MFD.intervalCheckout();
  }, 2000);
}
// MFD显示器的校验
MFD.intervalCheckout = (mod) => {
  MFD.clearIntervalCheckout();
  const interval = () => {
    MFD.checkoutDcsRunning();
    let isCheckError = !MFD.checkout();
    // A9:判断检查是否全通过
    for (const key in MFD.checkObject) {
      const check = MFD.checkObject[key];
      if (check.status !== 'success') {
        isCheckError = true
      }
    }
    // A10:检查单有变更则通知
    if (JSON.stringify(MFD.checkObject) !== JSON.stringify(MFD.checkObjectOld)) {
      MFD.sendCheckObject();
      if (isCheckError) {
        MFD.notify();
      }
    }
    MFD.checkObjectOld = MFD.checkObject;
  }
  interval();
  MFD.timer = setInterval(() => {
    interval();
  }, MFD.interval);
}
MFD.clearIntervalCheckout = () => {
  if (MFD.timer) {
    clearInterval(MFD.timer);
    MFD.timer = undefined;
  }
}
// 校验=================================================================================End
// 独立功能=============================================================================Beg
// 打开笼罩层
MFD.openOverlayer = () => {
  // A1:跳过
  if (_.isEmpty(MFD.config) || _.isEmpty(MFD.config.currentMod)) {
    return
  }
  // A2:移除旧笼罩层
  if (!_.isEmpty(MFD.tagsOfOverlayerByInstrumentKey) || !_.isEmpty(MFD.tagsOfLeaderLineByInstrumentKey)) {
    MFD.closeOverlayer();
  }
  // 重新计算屏幕
  MFD.calcAllMonitor();
  // A3:新增笼罩层
  MFD.tagsOfOverlayerByInstrumentKey = {};
  MFD.tagsOfLeaderLineByInstrumentKey = {};
  const mod = MFD.getMod();
  if (mod === '') {
    return
  }
  const instruments = MFD.config.modsInfo[mod].instruments;
  if (_.isEmpty(instruments)) {
    return
  }
  for (const instrumentKey in instruments) {
    const instrument = instruments[instrumentKey];
    if (_.isEmpty(instrument.id)) {
      continue;
    }
    if (!_.isEmpty(instrument.overlayerBackColor) || (instrument.isEnableKeyGuide && !_.isEmpty(instrument.overlayerBackImg))) {
      const tag = new TransparentDisplayTag(true);
      const left = instrument.displayMonitor.left + instrument.overlayerTailorMonitor.left;
      const top = instrument.displayMonitor.top + instrument.overlayerTailorMonitor.top;
      const right = instrument.displayMonitor.right + instrument.overlayerTailorMonitor.right;
      const bottom = instrument.displayMonitor.bottom + instrument.overlayerTailorMonitor.bottom;
      const x = left;
      const y = top;
      const w = right - left;
      const h = bottom - top;
      tag.createWindow(x, y, w, h, !MFD.config.isDebug);
      MFD.tagsOfOverlayerByInstrumentKey[instrumentKey] = tag;
    }
    if (!_.isEmpty(instrument.overlayerBackColor)) {
      const style = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: instrument.overlayerOpacity,
        'background-color': instrument.overlayerBackColor
      }
      MFD.tagsOfOverlayerByInstrumentKey[instrumentKey].setStyleOfDiv('greenScreen', style);
    }
    // A5:设置背景图
    if (instrument.isEnableKeyGuide && !_.isEmpty(instrument.overlayerBackImg)) {
      // A5:设置背景图
      var backImg = path.join(MFD.imgLeaderLineBase, instrument.overlayerBackImg).replace(/\\/g, '////');
      const style = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        'background-image': `url(${backImg})`
      }
      MFD.tagsOfOverlayerByInstrumentKey[instrumentKey].setStyleOfDiv('leaderLine', style);
    }
  }
}
// 更新笼罩层
MFD.updateOverlayer = (instrumentKey, opacity) => {
  // 保存透明度
  const mod = MFD.getMod();
  if (mod === '') {
    return
  }
  const instrument = MFD.config.modsInfo[mod].instruments[instrumentKey];
  instrument.overlayerOpacity = opacity;
  MFD.setConfig();
  // A4:设置透明度
  if (MFD.tagsOfOverlayerByInstrumentKey[instrumentKey]) {
    MFD.tagsOfOverlayerByInstrumentKey[instrumentKey].setPropertyOfStyleOfDiv('greenScreen', 'opacity', opacity);
  }
}
// 更新按键指引
MFD.updateIsEnableKeyGuide = (instrumentKey, isEnableKeyGuide) => {
  // 设置使能状态
  MFD.config.modsInfo[MFD.config.currentMod].instruments[instrumentKey].isEnableKeyGuide = isEnableKeyGuide;
  MFD.setConfig();
  // 重启笼罩层
  MFD.openOverlayer();
}
// 关闭笼罩层
MFD.closeOverlayer = () => {
  // 绿幕
  if (!_.isEmpty(MFD.tagsOfOverlayerByInstrumentKey)) {
    for (const instrumentKey in MFD.tagsOfOverlayerByInstrumentKey) {
      const tag = MFD.tagsOfOverlayerByInstrumentKey[instrumentKey];
      tag.closeWindow();
    }
    delete MFD.tagsOfOverlayerByInstrumentKey;
  }
}
// 打开标识ID
MFD.openIdentifyId = () => {
  // 如果窗口关闭或DCS运行时,则关闭标识ID
  if (MFD.dcsRunningStatus || !MFD.appShowStatus || !MFD.uiShowStatus) {
    MFD.closeIdentifyId();
    return
  }
  // 关闭旧的标识后重新打开
  if (!_.isEmpty(MFD.tags)) {
    MFD.closeIdentifyId();
  }
  MFD.tags = [];
  for (const id in MFD.monitorInfoById) {
    const info = MFD.monitorInfoById[id];
    const tag = new TransparentDisplayTag();
    const x = info.right - 255;
    const y = (info.top + info.bottom) / 2;
    tag.createWindow(x, y, 200, 80, !MFD.config.isDebug);
    const content = 'ID:' + info.id;
    tag.setContent(content);
    tag.setBackColor('#000000');
    MFD.tags.push(tag);
  }
}
// 关闭标识ID
MFD.closeIdentifyId = () => {
  for (const tag of MFD.tags || []) {
    tag.closeWindow();
  }
  MFD.tags = [];
}
// 独立功能=============================================================================End
// 通知渲染进程==========================================================================Beg
// 打开通知窗口
MFD.notify = () => {
  if (MFD.uiShowStatus || !MFD.dll.IsInstallDisplayLink()) {
    return
  }
  const local = MFD.store.get('Language');
  const title = local !== 'cn' ? 'MFD Display Warning' : 'MFD显示器警告';
  const body = local !== 'cn' ? 'Click to MFD Display to view more' : '点击查看更多信息';

  const notifier = new Notification({
    title,
    body,
    sound: true,
    icon: notifierIcon
  })
  notifier.on('click', (e, arg) => {
    MFD.win.show();
    MFD.switchToMFDDsiplayTab();
  })
  notifier.show();
}
MFD.sendEvent = (event, arg) => {
  MFD.win && MFD.win.webContents.send(event, arg)
}
// 通知切换到MFD选项卡
MFD.switchToMFDDsiplayTab = () => {
  MFD.sendEvent('home-switch-tab', 'MFD');
}
// 通知配置变更
MFD.sendConfig = () => {
  MFD.sendEvent('mfd-config', MFD.config);
}
// 通知发送检查单
MFD.sendCheckObject = () => {
  MFD.sendEvent('mfd-check-object', MFD.checkObject);
}
// 发送屏幕变化事件
MFD.sendMonitorChange = () => {
  MFD.sendEvent('mfd-monitor-change', MFD.monitorInfo);
}
// 发送SimAppPro显示事件
MFD.sendAppShow = () => {
  MFD.appShowStatus = true;
  MFD.sendEvent('mfd-app-show');
}
// 发送SimAppPro隐藏事件
MFD.sendAppHide = () => {
  MFD.appShowStatus = false;
  MFD.sendEvent('mfd-app-hide');
}
// 发送DCS运行状态
MFD.sendDcsRunningStatus = () => {
  MFD.sendEvent('dcs-running-status', MFD.dcsRunningStatus);
}
// 发送初始化
MFD.sendInit = () => {
  // 重新获取配置
  MFD.getConfig();
  // 发送屏幕信息
  MFD.sendMonitorChange();
  // 打开标识
  MFD.openIdentifyId();
  // 打开笼罩层
  MFD.openOverlayer();
  // 发送DCS状态
  MFD.sendDcsRunningStatus();
}
// 发送下载驱动进度
MFD.sendDownloadDriverProgress = () => {
  MFD.sendEvent('mfd-driver-download-info', MFD.DriverDownloadInfo);
}
// 通知渲染进程==========================================================================End
// 让渲染进程调用========================================================================Beg
ipcMain.on('MFD_Mounted', (e, arg) => {
  // MFD的界面状态
  MFD.uiShowStatus = true;
  // 发送检查单
  MFD.sendCheckObject();
  if (MFD.isInit) {
    MFD.sendInit()
  }
  // MFD.intervalCheckout();
})
ipcMain.on('MFD_Destroyed', (e, arg) => {
  // MFD的界面状态
  MFD.uiShowStatus = false;
  MFD.closeIdentifyId();
})
ipcMain.on('MFD_DownloadDriver', (e, arg) => {
  MFD.downloadDisplayLink();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
ipcMain.on('MFD_InstallDriver', (e, arg) => {
  spawn('cmd.exe', ['/c', MFD.driverPath]);
})
ipcMain.on('MFD_OpenDisplaySwitch', (e, arg) => {
  const displaySwitch = spawn('powershell', ['Start-Process', '-FilePath', 'DisplaySwitch.exe', '-Verb RunAs']);
  displaySwitch.stderr.on('data', (data) => {
    console.log(iconv.decode(data, 'cp936'));
  });
  displaySwitch.stdout.on('data', (data) => {
    // console.log(iconv.decode(data, 'cp936'));
  })
  displaySwitch.on('close', (code, sygnal) => {
    // console.log(iconv.decode(code, 'cp936'));
  })
})
ipcMain.on('MFD_OpenDeskCpl', (e, arg) => {
  const displaySwitch = spawn('cmd.exe', ['/c chcp 65001>nul && desk.cpl'], {
  });
  displaySwitch.stderr.on('data', (data) => {
    console.log(iconv.decode(data, 'cp936'));
  });
  displaySwitch.stdout.on('data', (data) => {
    console.log(data);
  })
  displaySwitch.on('close', (code, sygnal) => {
    console.log(code);
  })
})
ipcMain.on('MFD_SetOverlayerOpacity', (e, arg) => {
  MFD.updateOverlayer(arg.instrument, arg.opacity);
})
ipcMain.on('MFD_SetIsEnableKeyGuide', (e, arg) => {
  MFD.updateIsEnableKeyGuide(arg.instrument, arg.isEnableKeyGuide);
})
ipcMain.on('MFD_SetConfig', (e, arg) => {
  MFD.config = arg;
  MFD.setConfig();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
ipcMain.on('MFD_OpenIdentify', (e, arg) => {
  MFD.openIdentifyId();
})
ipcMain.on('MFD_CloseIdentify', (e, arg) => {
  MFD.closeIdentifyId();
})
ipcMain.on('MFD_OpenOverlayer', (e, arg) => {
  MFD.openOverlayer();
})
ipcMain.on('MFD_CloseOverlayer', (e, arg) => {
  MFD.closeOverlayer();
})
ipcMain.on('MFD_Apply', (e, arg) => {
  MFD.apply(MFD.config.currentMod);
})
ipcMain.on('MFD_MainMonitorApply', (e, arg) => {
  MFD.mainMonitorApply();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
ipcMain.on('MFD_DcsCameraModeApply', (e, arg) => {
  MFD.dcsCameraModeApply();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
ipcMain.on('MFD_MonitorLayoutApply', (e, arg) => {
  MFD.monitorLayoutApply();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
ipcMain.on('MFD_MfdSettingApply', (e, arg) => {
  MFD.mfdSettingApply();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
ipcMain.on('MFD_DedLayoutApply', (e, arg) => {
  MFD.dedLayoutApply(arg);
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
// 让渲染进程调用========================================================================End
module.exports = MFD;
