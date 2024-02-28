const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const log = require('electron-log');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

/** ********以下是每个子文件都必须要实现的配置和方法***************** **/
const BMS = {
  gameKey: 'BMS', // 1.获取config/GameExtendDisplay/MFD路径下本地配置信息和extra扩展信息; 2.game_config_set获取存储文件BMS_config.json信息;3.MFD遍历任务需要用到的key
  extraConfig: {}, // 游戏强制配置文件，游戏图标从这里面读取
  gameConfig: {}, // 游戏总配置信息BMS.js + BMS_extra.js + BMS_config.json 三个文件总配置信息
  checkObject: {}, // 检查单
  gameRunningStatusChange: false
};
// 检查文件是否存在
BMS.isFileExist = (path) => {
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
BMS.checkObjectDefault = {
  gameId: 'BMS',
  bmsPath: {
    ...checkDefault
  },
  bmsInstallPath: {
    ...checkDefault,
    parent: 'bmsPath'
  },
  bmsCFGPath: {
    ...checkDefault,
    parent: 'bmsPath'
  },
  bmsRTTPath: {
    ...checkDefault,
    parent: 'bmsPath'
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
  // 设置BMS视角
  bmsFovMode: {
    ...checkDefault
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
  bmsCfgConfig: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: true
  },
  bmsRttConfig: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: true
  },
  bmsD3DPath: {
    ...checkDefault,
    parent: 'mfdSetting',
    show: true
  },
  // 游戏运行时显示器状态
  monitorStatusWhenGameRunning: {
    ...checkDefault
  }
};
// 获取BMS配置文件路径信息，返回true或者false（true代表所有配置文件均存在）
BMS.getChildFilePath = (getPath) => {
  let getAllPath = true;
  BMS.getPath = getPath;
  BMS.gameExePath = getPath.GetActiveBMSEXEPath();
  if (!BMS.gameExePath) {
    getAllPath = false;
  }
  if (BMS.gameExePath) {
    BMS.isExistExe = BMS.isFileExist(path.join(BMS.gameExePath, 'Launcher.exe'));
    if (!BMS.isExistExe) {
      getAllPath = false;
    }
    BMS.bmsCFGPath = path.join(BMS.gameExePath, 'User\\Config\\Falcon BMS.cfg');
    if (!BMS.isFileExist(BMS.bmsCFGPath)) {
      getAllPath = false;
    }
    BMS.bmsD3DPath = path.join(BMS.gameExePath, 'User\\Config\\d3d11.dsp');
    BMS.bmsRTTPath = path.join(BMS.gameExePath, 'Tools\\RTTRemote\\RTTClient.ini');
    if (!BMS.isFileExist(BMS.bmsRTTPath)) {
      getAllPath = false;
    }
  }
  return getAllPath
};
// 校验配置文件地址
BMS.checkoutPath = (checkObject) => {
  // step1:校验BMS安装路径
  BMS.gameExePath = BMS.getPath.GetActiveBMSEXEPath();
  if (BMS.gameExePath) {
    BMS.isExistExe = BMS.isFileExist(path.join(BMS.gameExePath, 'Launcher.exe'));
    if (BMS.isExistExe) {
      checkObject.bmsPath.status = 'success'
      checkObject.bmsInstallPath.status = 'success'
    } else {
      checkObject.bmsPath.status = 'error'
      checkObject.bmsInstallPath.status = 'error'
      return { checkObject: checkObject, result: false };
    }
  } else {
    checkObject.bmsPath.status = 'error'
    checkObject.bmsInstallPath.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // step2:校验BMS配置文件Falcon BMS.cfg是否存在
  BMS.bmsCFGPath = path.join(BMS.gameExePath, 'User\\Config\\Falcon BMS.cfg');
  if (BMS.isFileExist(BMS.bmsCFGPath)) {
    checkObject.bmsPath.status = 'success'
    checkObject.bmsCFGPath.status = 'success'
  } else {
    checkObject.bmsPath.status = 'error'
    checkObject.bmsCFGPath.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // step3:校验RTTClient.ini是否存在
  BMS.bmsRTTPath = path.join(BMS.gameExePath, 'Tools\\RTTRemote\\RTTClient.ini');
  if (BMS.isFileExist(BMS.bmsRTTPath)) {
    checkObject.bmsPath.status = 'success'
    checkObject.bmsRTTPath.status = 'success'
  } else {
    checkObject.bmsPath.status = 'error'
    checkObject.bmsRTTPath.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // step4:d3d文件路径是否存在
  BMS.bmsD3DPath = path.join(BMS.gameExePath, 'User\\Config\\d3d11.dsp');
  if (BMS.isFileExist(BMS.bmsD3DPath)) {
    checkObject.bmsPath.status = 'success'
    checkObject.bmsD3DPath.status = 'success'
  } else {
    checkObject.bmsPath.status = 'error'
    checkObject.bmsD3DPath.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
// 检查当前子模块独有的应用配置信息
BMS.checkOwnerConfigInfo = (checkObject) => {
  // A1:校验是否点击过应用
  if (BMS.gameConfig.bmsFovModeApplyStatus > 0) {
    checkObject.bmsFovMode.status = 'success'
  } else {
    checkObject.bmsFovMode.status = 'process'
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
// 检查游戏配置是否变更
BMS.checkoutGameInfoChange = (checkObject, templatePath) => {
  // A1:校验Falcon BMS.cfg文件是否发生改变
  const configContent = fs.readFileSync(BMS.bmsCFGPath, 'utf-8');
  if (BMS.checkConfigContent(configContent)) {
    checkObject.mfdSetting.status = 'success'
    checkObject.bmsCfgConfig.status = 'success'
  } else {
    checkObject.mfdSetting.status = 'error'
    checkObject.bmsCfgConfig.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  // A2:校验RTTClient.ini文件设备坐标配置是否和当前游戏坐标配置相同
  const rttContent = fs.readFileSync(BMS.bmsRTTPath, 'utf-8');
  if (BMS.checkRTTContent(rttContent)) {
    checkObject.mfdSetting.status = 'success'
    checkObject.bmsRttConfig.status = 'success'
  } else {
    checkObject.mfdSetting.status = 'error'
    checkObject.bmsRttConfig.status = 'error'
    return { checkObject: checkObject, result: false };
  }
  return { checkObject: checkObject, result: true };
};
// 设置BMS配置文件
BMS.setGameConfig = (gameConfig, templatePath) => {
  BMS.gameConfig = _.cloneDeep(gameConfig);
  // step1：修改Falcon BMS.cfg文件rtt文件可扩展性
  BMS.resetConfigForRTT()
  // step2: 修改Falcon BMS.cfg文件中fov值
  BMS.resetConfigForFov()
  // step3：设置RTT文件（目的：设置MFD显示器位置和大小）
  BMS.resetRTTConfigForMFD()
}
// 游戏运行或者关闭的时候，BMS需要做的设置操作
BMS.gameRuningSetting = (runningStatus, MFDDLL) => {
  if (runningStatus) {
    // A1：游戏启动，自动启动RTTClient64.exe配置文件
    BMS.startRTTClient(MFDDLL)
    // A2：显设置d3d配置文件信息(d3d配置文件修改显示器宽度和高度)
    BMS.calcAndmodifyD3DFile()
    // A3：游戏启动，把窗口位置和大小传递给接口WWTHID_JSAPI，通过WWTHID_JSAPI控制游戏窗口位置和大小
    BMS.calcMainMonitorWindow(MFDDLL)
  } else {
    // B1：游戏关闭，需要关闭RTTClient64.exe配置
    BMS.closeRTTClient()
    // B2：游戏关闭，重置游戏窗口设置
    BMS.hasCalcMainMonitor = false
    // B3: 游戏关闭, 还原d3d配置文件信息
    fs.writeFileSync(BMS.bmsD3DPath, BMS.oldD3DContent, 'hex');
  }
}
/** ********以下是每个子文件自己处理业务逻辑的方法***************** **/

/** ********检查单用到的检查相关的方法*************start**** **/
// 校验config文件是否发生改变
BMS.checkConfigContent = (configContent) => {
  // step1:检验g_bExportRTTTextures是否为1
  const regex_rtt = /g_bExportRTTTextures\s+(\d+)/;
  const match_rtt = configContent.match(regex_rtt);
  if (match_rtt) {
    const result = match_rtt[1]
    if (result != 1) {
      return false;
    }
  } else {
    return false;
  }
  // step2:检验fov值是否和配置的保持一致
  const regex_fov = /g_fMaximumFOV\s+(\d+)/;
  const match_fov = configContent.match(regex_fov);
  if (match_fov) {
    const result = match_fov[1];
    if (result != (BMS.gameConfig.bmsFovNum + 20)) {
      return false;
    }
  } else {
    return false;
  }
  // step3:检验fov最大值值是否和配置的保持一致
  const regex_def = /g_fDefaultFOV\s+(\d+)/;
  const match_def = configContent.match(regex_def);
  if (match_def) {
    const result = match_def[1];
    if (result != BMS.gameConfig.bmsFovNum) {
      return false;
    }
  } else {
    return false
  }
  return true
}
// 检验RTT文件内容是否包含游戏坐标配置信息
BMS.checkRTTContent = (content) => {
  // 遍历当前游戏的机模信息，逐个检查配置是否匹配
  const modInfo = BMS.gameConfig.modsInfo[BMS.gameConfig.currentMod];
  const monitorConfig = modInfo.instruments;
  for (const key in monitorConfig) {
    const instrument = monitorConfig[key];
    // 只要有一条数据不满足要求，则返回false
    const need = !_.isEmpty(instrument.id)
    if (!BMS.checkSingleCoordinateData(content, need, instrument.gameConfigKey)) {
      return false
    }
  }
  return true
}
// 检查单条坐标数据
BMS.checkSingleCoordinateData = (content, need, key) => {
  // step1：获取USE_+key的值
  const regkey = 'USE_' + key;
  const regex = new RegExp(`${regkey}\\s*=\\s*(\\d+)`);
  const match = content.match(regex);
  const use_value = match ? parseInt(match[1]) : null;

  // step2：计算符合坐标数据条件的数量
  const regkey_coor = new RegExp(`^${key}_.+`, 'gm');
  const match_coor = content.match(regkey_coor);
  const count = match_coor ? match_coor.length : 0;

  // step3：做比较
  if (need) {
    if ((use_value === 1) && (count === 5)) {
      return true
    }
  } else {
    if ((use_value === 0) && (count === 0)) {
      return true
    }
  }
  return false
}
/** ********检查单用到的检查相关的方法*************end**** **/

/** ********点击应用，修改配置用到的相关方法*************start**** **/
// 修改配置文件的RTT
BMS.resetConfigForRTT = () => {
  var configContent = fs.readFileSync(BMS.bmsCFGPath, 'utf-8');
  // fov设置, 使用正则表达式进行匹配, 修改最高fov值
  const regex = /g_bExportRTTTextures\s+(\d+)/;
  const match = configContent.match(regex);
  if (match) {
    const oldStr = match[0];
    const newStr = 'g_bExportRTTTextures 1'
    configContent = configContent.replace(oldStr, newStr)
  }
  fs.writeFileSync(BMS.bmsCFGPath, configContent);
}
// 修改rttconfig配置文件中的MFD坐标信息
BMS.resetRTTConfigForMFD = () => {
  let rttContent = fs.readFileSync(BMS.bmsRTTPath, 'utf-8');
  const mod = BMS.gameConfig.currentMod;
  const modInfo = BMS.gameConfig.modsInfo[mod];
  const monitorConfig = modInfo.instruments;
  for (const key in monitorConfig) {
    const instrument = monitorConfig[key];
    rttContent = BMS.clearAllRttConfig(rttContent, instrument.gameConfigKey)
    if (!_.isEmpty(instrument.id)) {
      rttContent = BMS.toMonitorLua(rttContent, instrument);
      rttContent = BMS.resetRTTConfigStr(rttContent, instrument.gameConfigKey, 1);
    }
  }
  fs.writeFileSync(BMS.bmsRTTPath, rttContent);
}
// 先清除所有的游戏坐标数据信息
BMS.clearAllRttConfig = (content, key) => {
  // step1：处理USE_+key的值为0
  content = BMS.resetRTTConfigStr(content, key, 0);
  // step2：处理key+_的整行数据
  const regex = new RegExp(`^${key}_.+`, 'gm');
  content = content.replace(regex, '')
  return content
}
// 修改rttClient配置文件中USE_+key为1
BMS.resetRTTConfigStr = (content, key, newValue) => {
  // 构建正则表达式并替换
  const regkey = 'USE_' + key;
  const regex = new RegExp(`${regkey}\\s*=\\s*\\d+`, 'g');
  content = content.replace(regex, `${regkey} = ${newValue}`);
  return content;
}
// 计算坐标,并转换成lua语句返回
BMS.toMonitorLua = (content, obj) => {
  const direction = obj.gameConfigKey
  const gameMonitor = obj.gameMonitor
  content = content + '\n';
  content = content + `${direction}_X = ${gameMonitor.left} \n`;
  content = content + `${direction}_Y = ${gameMonitor.top} \n`;
  content = content + `${direction}_W = ${gameMonitor.width} \n`;
  content = content + `${direction}_H = ${gameMonitor.height} \n`;
  content = content + `${direction}_ONTOP = 1\n`;
  content = content + '\n';
  return content
}
// 计算游戏显示器位置和大小（游戏运行所选用的显示器组合位置和大小，通过接口设置，实现拖拽效果）
BMS.calcMainMonitorWindow = (MFDDLL) => {
  const { gameViewports } = BMS.gameConfig
  if (gameViewports) {
    const { Center } = gameViewports
    if (Center) {
      const { gameMonitor } = Center
      if (gameMonitor) {
        // 开启循环监听，监听BMS游戏运行窗口变化
        BMS.listenBMSWindowInfo(gameMonitor, MFDDLL)
      }
    }
  }
}
// 监听游戏运行状态，设置游戏显示器组合位置和大小
BMS.listenBMSWindowInfo = (gameMonitor, MFDDLL) => {
  // 如果游戏停止运行，需要退出循环
  if (BMS.gameConfig.gameRunningStatus) {
    const windowInfo = MFDDLL.GetWindowsPosByTitle('Falcon BMS')
    if ((gameMonitor.left !== windowInfo.x) || (gameMonitor.top !== windowInfo.y) || (gameMonitor.width !== windowInfo.w) || (gameMonitor.height !== windowInfo.h)) {
      // 只要不匹配，就一直调用接口设置
      MFDDLL.SetWindowsPosByTitle('Falcon BMS', gameMonitor.left, gameMonitor.top, gameMonitor.width, gameMonitor.height, 1)
    }
    // 每隔1秒进行1次循环，
    setTimeout(() => {
      BMS.listenBMSWindowInfo(gameMonitor, MFDDLL)
    }, 1000);
  }
}
// 启动RTTClient64.exe配置进程任务
BMS.startRTTClient = (MFDDLL) => {
  if (!MFDDLL.CheckProcessExists(BMS.gameConfig.RTTClientName)) {
    BMS.bmsRTTExEPath = path.join(BMS.gameExePath, 'Tools\\RTTRemote\\' + BMS.gameConfig.RTTClientName);
    BMS.bmsRTTExERunPath = path.join(BMS.gameExePath, 'Tools\\RTTRemote');

    const child = spawn('cmd.exe', ['/c', BMS.bmsRTTExEPath], { cwd: BMS.bmsRTTExERunPath });

    // 监听进程启动事件
    child.on('spawn', () => {
      return true
    });

    // 监听进程错误事件
    child.on('error', () => {
      return false
    });
  }
}
// 关闭RTTClient64.exe配置进程任务,restart是否需要重启，在MFD断线重连的时候，需要重启
BMS.closeRTTClient = () => {
  // 假设 pid 包含要终止的进程的名称，且是一个数组
  const processesToKill = [BMS.gameConfig.RTTClientName];
  // 构建 taskkill 命令
  const command = `taskkill /F /T ${processesToKill.map(process => `/IM ${process}`).join(' ')}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      log.error(error);
      return false;
    }
    log.info(stdout);
    log.info(stderr);
    return true
  });
}
// B3：这里暂存d3d游戏窗口原有配置文件并保存simAppPro的配置文件（目的：多窗口下，鼠标可以正常移动屏幕）
BMS.calcAndmodifyD3DFile = () => {
  const d3dContent = fs.readFileSync(BMS.bmsD3DPath, 'hex');
  if (d3dContent) {
    // 先保存之前的配置文件信息
    BMS.oldD3DContent = _.cloneDeep(d3dContent)
    // 再计算新的值
    const { gameViewports } = BMS.gameConfig
    if (gameViewports) {
      const { Center } = gameViewports
      if (Center) {
        const { gameMonitor } = Center
        if (gameMonitor) {
          const preStr = d3dContent.substring(0, 168)
          const newStr_w = BMS.conversionNumberForHex(gameMonitor.width)
          const midStr = d3dContent.substring(172, 176)
          const newStr_h = BMS.conversionNumberForHex(gameMonitor.height)
          const sufStr = d3dContent.substring(180, d3dContent.length)

          const newContent = preStr + newStr_w + midStr + newStr_h + sufStr
          BMS.newD3DContent = newContent
          fs.writeFileSync(BMS.bmsD3DPath, BMS.newD3DContent, 'hex');
        }
      }
    }
  }
}
// 数值十进制转换成十六进制
BMS.conversionNumberForHex = (oldStr) => {
  // step1:先把十进制转换成十六进制
  var newStr = (oldStr).toString(16)
  // step2:字符小写转大写
  newStr = newStr.toUpperCase()
  // step3:lodash自动补0成4位数
  const paddedStr = _.padStart(newStr, 4, '0')
  // step4:将字符串分成两组数据（分成大小端数据形式）
  const strArr = [paddedStr.substring(0, 2), paddedStr.substring(2, 4)]
  // step5:lodash对数组进行翻转(x86要用小端，所以这里需要翻转)
  const reverseArry = strArr.reverse()
  // step6:把新数组组装成新的字符串
  return reverseArry.join('')
}
// 修改config文件中fov配置信息
BMS.resetConfigForFov = () => {
  var fovContent = fs.readFileSync(BMS.bmsCFGPath, 'utf-8');
  // fov设置, 使用正则表达式进行匹配, 修改最高fov值
  const regex = /g_fMaximumFOV\s+(\d+)/;
  const match = fovContent.match(regex);
  if (match) {
    const oldStr = match[0];
    const newStr = 'g_fMaximumFOV ' + (BMS.gameConfig.bmsFovNum + 20)
    fovContent = fovContent.replace(oldStr, newStr)
  }
  // fov设置, 使用正则表达式进行匹配, 修改默认fov值
  const regex_def = /g_fDefaultFOV\s+(\d+)/;
  const match_def = fovContent.match(regex_def);
  if (match_def) {
    const oldStr = match_def[0];
    const newStr = 'g_fDefaultFOV ' + BMS.gameConfig.bmsFovNum
    fovContent = fovContent.replace(oldStr, newStr)
  }
  fs.writeFileSync(BMS.bmsCFGPath, fovContent);
}
/** ********点击应用，修改配置用到的相关方法*************end**** **/
module.exports = BMS;
