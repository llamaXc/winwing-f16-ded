const path = require('path');
const _ = require('lodash');
const { ipcMain } = require('electron');

// 创建、存储、读取文件工具
const game_config_set = require('./game_config_set.js');

// 初始化子类
const MFD = require('./MFD/MFD.js');
const DED = require('./DED/DED.js');
// 把所有的子类，存储到数组中，用来遍历处理
const GED_ALL_Config = [MFD, DED];

// GED对象
const GED = {};
GED.unpackDir = __dirname.replace('app.asar', 'app.asar.unpacked');

// 初始化GED
GED.init = (dll, store, getPath, win) => {
  GED.win = win
  // 循环初始化子类信息
  for (let i = 0; i < GED_ALL_Config.length; i++) {
    const Child = GED_ALL_Config[i];
    Child.init(dll, store, getPath, win)
  }
  // 初始化文件存储路径
  GED.userPath = game_config_set.getFilePathForGED();
  // 初始化GED配置信息
  const defaultConfig = require(path.join(GED.unpackDir, '/../../config/GameExtendDisplay/GED.js'));
  GED.defaultConfig = defaultConfig.config;
  GED.isInit = true;
  GED.getConfig();
};
// 获取配置文件
GED.getConfig = () => {
  // A3:获取本地GED配置文件信息
  const fileConfig = game_config_set.getConfigWithKey('GED', GED.userPath);
  // A4:组装GED配置信息
  GED.config = _.merge({}, GED.defaultConfig, fileConfig);
  // 将配置发给渲染线程
  if (GED.uiShowStatus) {
    GED.sendConfig();
  }
}
// 事件发送
GED.sendEvent = (event, arg) => {
  GED.win && GED.win.webContents.send('GED-' + event, arg)
}
// 通知配置变更
GED.sendConfig = () => {
  GED.sendEvent('ged-config', GED.config);
}
// 写入配置文件
GED.setConfig = () => {
  game_config_set.setConfigForGED(GED.userPath, GED.config)
}
// 切换设备
GED.ChangeDeviceWithDeviceId = (deviceId) => {
  // 如果设备id不变，不做处理
  if (GED.config.curDeviceId !== deviceId) {
    GED.config.curDeviceId = deviceId
    // 写入配置文件
    GED.setConfig()
    // 将配置发给渲染线程
    GED.sendConfig();
  }
}

ipcMain.on('GameExtendDisplay_GED_Mounted', (e, arg) => {
  GED.uiShowStatus = true
  if (GED.isInit) {
    GED.sendConfig();
  }
})
ipcMain.on('GameExtendDisplay_GED_Destroyed', (e, arg) => {
  GED.uiShowStatus = false
})
ipcMain.on('GameExtendDisplay_ChangDevice', (e, arg) => {
  GED.ChangeDeviceWithDeviceId(arg)
})
module.exports = GED;
