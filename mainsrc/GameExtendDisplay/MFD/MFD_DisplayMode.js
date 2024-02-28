var exec = require('child_process').exec;
exec('NET SESSION');
const log = require('electron-log');

const MFD_DisplayMode = {}

// 校验扩展模式
MFD_DisplayMode.checkoutMode = (monitorInfoById, checkObject) => {
  let isExtend = true;
  for (const id in monitorInfoById) {
    const info = monitorInfoById[id];
    // 判断显示器类型非扩展或者非第二显示屏（兼容笔记本电脑第二显示屏）
    if ((info.mode !== 'extend') && (info.mode !== 'Second Screen Only')) {
      isExtend = false;
    }
    break;
  }
  if (isExtend) {
    checkObject.extendMode.status = 'success';
  } else {
    checkObject.extendMode.status = 'error';
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
}
// 打开windows扩展投影（这里有问题，打不开）
MFD_DisplayMode.DisplaySwitch = () => {
  exec('DisplaySwitch.exe', (error, stdout, stderr) => {
    if (error) {
      log.error(`Command execution error: ${error.message}`);
      return;
    }
    if (stderr) {
      log.error(`Command execution result contains error information: ${stderr}`);
      return;
    }
    log.info(`Command execution successful:\n${stdout}`);
  });
}
module.exports = MFD_DisplayMode;
