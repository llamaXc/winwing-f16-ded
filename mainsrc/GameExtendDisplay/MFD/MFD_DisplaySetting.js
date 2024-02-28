/*
 * @Description: 游戏外设-MFD显示器-处理逻辑
 * @Author: lixingguo
 * @Date: 2023-12-21 13:15:23
 * @LastEditTime: 2023-12-29 11:24:11
 * @LastEditors: lixingguo
 */
const _ = require('lodash');

const MFD_DisplaySetting = {}

// 校验MFD显示器
MFD_DisplaySetting.checkoutMfdSetting = (gameConfig, monitorInfoById, checkObject) => {
  const mod = gameConfig.currentMod;
  // A1:校验是否点击过应用
  if (gameConfig.mfdSettingApplyStatus > 0) {
    checkObject.mfdSetting.status = 'success';
  } else {
    checkObject.mfdSetting.status = 'process';
    return { checkObject: checkObject, result: false };
  }
  // A2:遍历当前机模的仪表面板
  checkObject.mfdOnline.instrumentArray = [];
  checkObject.mfdDirection.instrumentArray = [];
  checkObject.mfdPositionAndSize.instrumentArray = [];
  for (const instrumentKey in gameConfig.modsInfo[mod] && gameConfig.modsInfo[mod].instruments) {
    const instrument = gameConfig.modsInfo[mod].instruments[instrumentKey];
    // 遍历仪表视窗绑定的显示器
    for (const id of instrument.id) {
      // B1:判断显示器是否在线
      if (monitorInfoById[id] === undefined) {
        checkObject.mfdOnline.instrumentArray.push(instrument);
        continue;
      }
      // B2:校验横竖屏
      if (monitorInfoById[id].direction !== instrument.direction) {
        checkObject.mfdDirection.instrumentArray.push(instrument);
        continue;
      }
      // B3:校验屏幕是否改变位置大小
      let isChange = false;
      for (const uiMonitorKey in instrument.displayMonitor) {
        if (['left', 'right', 'bottom', 'top', 'direction'].indexOf(uiMonitorKey) < 0) {
          continue;
        }
        if (monitorInfoById[id][uiMonitorKey] !== instrument.displayMonitor[uiMonitorKey]) {
          isChange = true;
        }
      }
      if (isChange) {
        checkObject.mfdPositionAndSize.instrumentArray.push(instrument);
      }
    }
  }
  // A3:判断是否在线
  if (_.isEmpty(checkObject.mfdOnline.instrumentArray)) {
    checkObject.mfdSetting.status = 'success';
    checkObject.mfdOnline.status = 'success';
  } else {
    checkObject.mfdSetting.status = 'error';
    checkObject.mfdOnline.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  // A4:判断横竖屏
  if (_.isEmpty(checkObject.mfdDirection.instrumentArray)) {
    checkObject.mfdSetting.status = 'success';
    checkObject.mfdDirection.status = 'success';
  } else {
    checkObject.mfdSetting.status = 'error';
    checkObject.mfdDirection.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  // A5:判断位置和大小
  if (_.isEmpty(checkObject.mfdPositionAndSize.instrumentArray)) {
    checkObject.mfdSetting.status = 'success';
    checkObject.mfdPositionAndSize.status = 'success';
  } else {
    checkObject.mfdSetting.status = 'error';
    checkObject.mfdPositionAndSize.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
// 计算游戏设备所有视窗数据转到配置文件
MFD_DisplaySetting.calcAllMonitor = (curGameConfig, monitorInfoById) => {
  const mod = curGameConfig.currentMod;
  // A2:初始化变量
  const gameMonitor = {
    left: undefined,
    top: undefined,
    right: undefined,
    bottom: undefined,
    width: 0,
    height: 0,
    aspect: 0
  }
  // A3:获取关联的显示器
  const { mainMonitorInfoById, usbMonitorInfoById } = MFD_DisplaySetting.getRelationMonitorInfoById(curGameConfig, monitorInfoById);
  const monitorInfoByIdInfo = {
    ...mainMonitorInfoById,
    ...usbMonitorInfoById
  }
  // A4:计算游戏设备外部坐标大小
  for (const id in monitorInfoByIdInfo) {
    const info = monitorInfoByIdInfo[id];
    gameMonitor.left = gameMonitor.left !== undefined ? gameMonitor.left : info.left;
    gameMonitor.top = gameMonitor.top !== undefined ? gameMonitor.top : info.top;
    gameMonitor.right = gameMonitor.right !== undefined ? gameMonitor.right : info.right;
    gameMonitor.bottom = gameMonitor.bottom !== undefined ? gameMonitor.bottom : info.bottom;
    if (info.left < gameMonitor.left) {
      gameMonitor.left = info.left;
    }
    if (info.top < gameMonitor.top) {
      gameMonitor.top = info.top;
    }
    if (info.right > gameMonitor.right) {
      gameMonitor.right = info.right;
    }
    if (info.bottom > gameMonitor.bottom) {
      gameMonitor.bottom = info.bottom;
    }
  }
  gameMonitor.width = gameMonitor.right - gameMonitor.left;
  gameMonitor.height = gameMonitor.bottom - gameMonitor.top;
  gameMonitor.aspect = Number(gameMonitor.width) / Number(gameMonitor.height);
  curGameConfig.gameMonitor = gameMonitor;
  // A5:计算options的值
  for (const key in curGameConfig.gameOptions.graphics) {
    if (gameMonitor[key] != undefined) {
      curGameConfig.gameOptions.graphics[key] = gameMonitor[key];
    }
  }
  // A6:计算游戏设备程序位于显示器的位置和大小
  curGameConfig.gameAppSettings.windowPlacement.x = gameMonitor.left;
  curGameConfig.gameAppSettings.windowPlacement.y = gameMonitor.top;
  curGameConfig.gameAppSettings.windowPlacement.w = gameMonitor.width;
  curGameConfig.gameAppSettings.windowPlacement.h = gameMonitor.height;
  // A7:计算游戏设备内外坐标的偏移值
  curGameConfig.gameOffset.left = -curGameConfig.gameAppSettings.windowPlacement.x;
  curGameConfig.gameOffset.top = -curGameConfig.gameAppSettings.windowPlacement.y;
  curGameConfig.gameOffset.right = -curGameConfig.gameAppSettings.windowPlacement.x;
  curGameConfig.gameOffset.bottom = -curGameConfig.gameAppSettings.windowPlacement.y;
  // A8:计算游戏设备内部主屏的位置和大小
  curGameConfig.gameViewports.Center = MFD_DisplaySetting.calcMonitor(curGameConfig.gameViewports.Center, monitorInfoById, curGameConfig);
  // A9:计算游戏设备内部各个MFD的分辨率
  const modInfo = curGameConfig.modsInfo[mod];
  const instruments = (modInfo && modInfo.instruments) || [];
  for (const name in instruments) {
    var instrument = instruments[name];
    const result = MFD_DisplaySetting.calcMonitor(instrument, monitorInfoById, curGameConfig);
    curGameConfig.modsInfo[mod].instruments[name] = result;
  }
  return { curGameConfig: curGameConfig };
}
// 获取关联屏幕
MFD_DisplaySetting.getRelationMonitorInfoById = (curGameConfig, monitorInfoById) => {
  const mod = curGameConfig.currentMod;
  const mainMonitorInfoById = {};
  const usbMonitorInfoById = {};
  for (const id in monitorInfoById) {
    const info = monitorInfoById[id];
    for (const viewPort in curGameConfig.gameViewports) {
      const viewPortInfo = curGameConfig.gameViewports[viewPort];
      if (viewPortInfo.id && viewPortInfo.id.includes(info.id)) {
        mainMonitorInfoById[info.id] = info;
      }
    }
    const modInfo = curGameConfig.modsInfo[mod];
    for (const instrument in modInfo && modInfo.instruments) {
      const instrumentInfo = modInfo.instruments[instrument];
      if (instrumentInfo.id && instrumentInfo.id.includes(info.id)) {
        usbMonitorInfoById[info.id] = info;
      }
    }
  }
  return { mainMonitorInfoById, usbMonitorInfoById };
};
// 计算游戏设备单个视窗
MFD_DisplaySetting.calcMonitor = (instrument, monitorInfoById, curGameConfig) => {
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
  for (const id of instrument.id || []) {
    if (monitorInfoById && monitorInfoById[id]) {
      monitorInfo.push(monitorInfoById[id]);
    }
  }
  // C1:将显示器的分辨率转为游戏设备内外坐标
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
    instrument.displayMonitor = MFD_DisplaySetting.updateObject(instrument.displayMonitor, monitor);
    // C2.3:计算gameMonitor
    for (const key in instrument.tailorMonitor) {
      if (instrument.isEnableKeyGuideShow && !instrument.isEnableKeyGuide) {
        instrument.gameMonitor[key] = instrument.displayMonitor[key] + instrument.overlayerTailorMonitor[key];
      } else {
        instrument.gameMonitor[key] = instrument.displayMonitor[key] + instrument.tailorMonitor[key];
      }
      // DCS游戏需要计算游戏偏移量
      if (curGameConfig.gameId === 'DCS') {
        instrument.gameMonitor[key] = instrument.gameMonitor[key] + curGameConfig.gameOffset[key];
      }
    }
    instrument.gameMonitor.width = instrument.gameMonitor.right - instrument.gameMonitor.left;
    instrument.gameMonitor.height = instrument.gameMonitor.bottom - instrument.gameMonitor.top;
    instrument.gameMonitor.aspect = Number(instrument.gameMonitor.width) / Number(instrument.gameMonitor.height);
  } else {
    // C3.1当对应显示器下线需要给默认值
    monitor.left = 0;
    monitor.top = 0;
    monitor.right = 0;
    monitor.bottom = 0;
    instrument.displayMonitor = _.cloneDeep(monitor);
    instrument.gameMonitor = _.cloneDeep(monitor);
  }
  return instrument;
}
// 根据目标对象所拥有的属性更新对象
MFD_DisplaySetting.updateObject = (target, source) => {
  for (const key in target) {
    target[key] = source[key]
  }
  return target;
}
module.exports = MFD_DisplaySetting;
