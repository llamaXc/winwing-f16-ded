/*
 * @Description: 游戏外设-游戏显示器应用
 * @Author: lixingguo
 * @Date: 2023-12-29 09:06:51
 * @LastEditTime: 2023-12-29 11:05:47
 * @LastEditors: lixingguo
 */
const _ = require('lodash');
var spawn = require('child_process').spawn;

const MFD_DisplayLayout = {};
// 校验屏幕排布与方向
MFD_DisplayLayout.checkoutMonitor = (gameConfig, monitorInfoById, checkObject) => {
  // A1:校验是否点击过应用
  if (gameConfig.monitorLayoutApplyStatus > 0) {
    checkObject.monitorLayout.status = 'success';
  } else {
    checkObject.monitorLayout.status = 'process';
    return { checkObject: checkObject, result: false };
  }
  // A1:校验屏幕排布与方向是否与激活的配置一致
  const mainMonitorInfoById = gameConfig.mainMonitorInfoById;
  const usbMonitorInfoById = gameConfig.usbMonitorInfoById;
  var isChange = false;
  for (const id in mainMonitorInfoById) {
    const monitor = mainMonitorInfoById[id];
    for (const key in monitor) {
      if (['deviceName'].includes(key)) {
        continue;
      }
      if (monitorInfoById && monitorInfoById[id] && monitor[key] !== monitorInfoById[id][key]) {
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
      if (monitorInfoById && monitorInfoById[id] && monitor[key] !== monitorInfoById[id][key]) {
        isChange = true;
      }
    }
  }
  if (!isChange) {
    checkObject.monitorLayout.status = 'success';
    checkObject.monitorLayoutChange.status = 'success';
  } else {
    checkObject.monitorLayout.status = 'error';
    checkObject.monitorLayoutChange.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
MFD_DisplayLayout.openDeskCpl = () => {
  const displaySwitch = spawn('cmd.exe', ['/c chcp 65001>nul && desk.cpl'], {
  });
  displaySwitch.stderr.on('data', (data) => { });
  displaySwitch.stdout.on('data', (data) => { })
  displaySwitch.on('close', (code, sygnal) => { })
}
// 屏幕排布与方向点击“应用”处理逻辑
MFD_DisplayLayout.monitorLayoutApply = (gameConfig, monitorInfoById) => {
  // A1:获取所有MFD显示器信息
  const usbMonitorInfoById = {};
  const mainMonitorInfoById = {};
  for (const id in monitorInfoById) {
    const info = monitorInfoById[id];
    for (const viewPort in gameConfig.gameViewports) {
      const viewPortInfo = gameConfig.gameViewports[viewPort];
      if (viewPortInfo.id.includes(info.id)) {
        mainMonitorInfoById[info.id] = info;
      }
    }
    if (info.driveName === 'DisplayLink USB Device') {
      usbMonitorInfoById[info.id] = info;
    }
  }
  // A2:保存MFD显示器信息
  gameConfig.mainMonitorInfoById = mainMonitorInfoById;
  gameConfig.usbMonitorInfoById = usbMonitorInfoById;
  return gameConfig
};
module.exports = MFD_DisplayLayout;
