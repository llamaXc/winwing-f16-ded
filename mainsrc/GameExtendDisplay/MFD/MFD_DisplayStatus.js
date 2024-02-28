/*
 * @Description: 游戏外设-游戏运行时校验
 * @Author: lixingguo
 * @Date: 2023-12-29 17:46:31
 * @LastEditTime: 2023-12-29 17:50:03
 * @LastEditors: lixingguo
 */
const _ = require('lodash');

const MFD_DisplayStatus = {}
// 校验游戏运行时显示器状态
MFD_DisplayStatus.checkoutMonitorStatusWhenGameRunning = (gameConfig, checkObject, monitorInfoById) => {
  if (!gameConfig.gameRunningStatus) {
    checkObject.monitorStatusWhenGameRunning.status = 'process';
    MFD_DisplayStatus[gameConfig.gameId] = {
      ...monitorInfoById
    }
  } else {
    checkObject.monitorStatusWhenGameRunning.status = 'success';
    if (_.isEmpty(MFD_DisplayStatus[gameConfig.gameId])) {
      MFD_DisplayStatus[gameConfig.gameId] = {
        ...monitorInfoById
      }
    }
  }
  let isChange = false;
  for (const id in MFD_DisplayStatus[gameConfig.gameId]) {
    const monitor = MFD_DisplayStatus[gameConfig.gameId][id];
    checkObject[`monitorStatusWhenGameRunning_${id}`] = checkObject[`monitorStatusWhenGameRunning_${id}`] || {};
    checkObject[`monitorStatusWhenGameRunning_${id}`].parent = 'monitorStatusWhenGameRunning';
    checkObject[`monitorStatusWhenGameRunning_${id}`].show = true;
    checkObject[`monitorStatusWhenGameRunning_${id}`].monitorId = id;
    if (!gameConfig.gameRunningStatus) {
      checkObject[`monitorStatusWhenGameRunning_${id}`].status = 'process';
    } else {
      checkObject[`monitorStatusWhenGameRunning_${id}`].status = 'success';
    }
    for (const key in monitor) {
      if (!['deviceName'].includes(key)) {
        continue;
      }
      if (monitorInfoById && monitorInfoById[id] && monitor[key] !== monitorInfoById[id][key]) {
        checkObject.monitorStatusWhenGameRunning.status = 'error';
        checkObject[`monitorStatusWhenGameRunning_${id}`].status = 'error';
        isChange = true;
      }
    }
  }
  if (isChange) {
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
}
MFD_DisplayStatus.refreshMonitorInfoWithGameId = (gameId, monitorInfoById) => {
  MFD_DisplayStatus[gameId] = {
    ...monitorInfoById
  }
}
module.exports = MFD_DisplayStatus;
