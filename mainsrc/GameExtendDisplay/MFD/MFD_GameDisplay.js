const _ = require('lodash');

const MFD_GameDisplay = {};

// 校验游戏画面显示器
MFD_GameDisplay.checkoutMainMonitor = (gameConfig, monitorInfoById, checkObject) => {
  // A1:校验是否点击过应用
  if (gameConfig.mainMonitorApplyStatus > 0) {
    checkObject.mainMonitor.status = 'success';
  } else {
    checkObject.mainMonitor.status = 'process';
    return { checkObject: checkObject, result: false };
  }
  // A2:校验游戏主屏是否上线
  checkObject.mainMonitorOnline.monitorIdArray = [];
  for (const id of gameConfig.gameViewports.Center.id) {
    if (_.isEmpty(monitorInfoById[id])) {
      checkObject.mainMonitorOnline.monitorIdArray.push(id);
    }
  }
  if (_.isEmpty(checkObject.mainMonitorOnline.monitorIdArray)) {
    checkObject.mainMonitor.status = 'success';
    checkObject.mainMonitorOnline.status = 'success';
  } else {
    checkObject.mainMonitor.status = 'error';
    checkObject.mainMonitorOnline.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  // A3:校验游戏主屏至少一个
  if (!_.isEmpty(gameConfig.gameViewports.Center.id) && !_.isEqual(gameConfig.gameViewports.Center.id, checkObject.mainMonitorOnline.monitorIdArray)) {
    checkObject.mainMonitor.status = 'success';
    checkObject.mainMonitorAtLeastOne.status = 'success';
  } else {
    checkObject.mainMonitor.status = 'error';
    checkObject.mainMonitorAtLeastOne.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
// 应用游戏画面显示器
MFD_GameDisplay.mainMonitorApply = (gameConfig, monitorInfoById) => {
  // A1:获取已绑定的游戏画面
  const mainMonitorInfoById = {};
  for (const id in monitorInfoById) {
    const info = monitorInfoById[id];
    for (const viewPort in gameConfig.gameViewports) {
      const viewPortInfo = gameConfig.gameViewports[viewPort];
      if (viewPortInfo.id.includes(info.id)) {
        mainMonitorInfoById[info.id] = info;
      }
    }
  }
  // A2:未变更则跳过
  if (_.isEqual(gameConfig.mainMonitorInfoById, mainMonitorInfoById)) {
    return gameConfig;
  }
  // A3:保存已绑定的屏幕信息
  gameConfig.mainMonitorInfoById = mainMonitorInfoById;
  return gameConfig;
};

module.exports = MFD_GameDisplay;
